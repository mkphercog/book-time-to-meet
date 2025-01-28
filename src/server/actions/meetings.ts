"use server";

import "use-server";
import { db } from "@/drizzle/db";
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";
import {
  MeetingActionSchemaType,
  meetingActionSchema,
} from "@/schema/meetings";
import { createCalendarEvent } from "./googleCalendar";
import { redirect } from "next/navigation";
import { fromZonedTime } from "date-fns-tz";
import { ROUTES } from "@/data/routes";

export const createMeeting = async (unsafeData: MeetingActionSchemaType) => {
  const { success, data } = meetingActionSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true };
  }

  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId, isActive, id }, { and, eq }) =>
      and(
        eq(isActive, true),
        eq(clerkUserId, data.clerkUserId),
        eq(id, data.eventId)
      ),
  });

  if (event == null) {
    return { error: true };
  }
  const startInTimezone = fromZonedTime(data.startTime, data.timezone);

  const validTimes = await getValidTimesFromSchedule([startInTimezone], event);

  if (validTimes.length === 0) {
    return { error: true };
  }

  await createCalendarEvent({
    ...data,
    startTime: startInTimezone,
    durationInMinutes: event.durationInMinutes,
    eventName: event.name,
  });

  redirect(
    ROUTES.book.succes(
      data.clerkUserId,
      data.eventId,
      data.startTime.toISOString()
    )
  );
};
