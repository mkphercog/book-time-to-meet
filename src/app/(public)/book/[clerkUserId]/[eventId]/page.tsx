import {
  addMonths,
  eachMinuteOfInterval,
  endOfDay,
  roundToNearestMinutes,
} from "date-fns";
import { notFound } from "next/navigation";
import { MeetingForm } from "@/components/forms/meeting";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";
import { clerkClient } from "@clerk/nextjs/server";
import { NoTimeSlots } from "@/components/bookPages";
import { AppName } from "@/components/AppName";

export const revalidate = 0;

type BookEventPageProps = {
  params: { clerkUserId: string; eventId: string };
};

export default async function BookEventPage({
  params: { clerkUserId, eventId },
}: BookEventPageProps) {
  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId: userIdCol, isActive, id }, { and, eq }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true), eq(id, eventId)),
  }).catch(() => notFound());

  if (event == null) return notFound();

  const calendarUser = await clerkClient().users.getUser(clerkUserId);
  const startDate = roundToNearestMinutes(new Date(), {
    nearestTo: 15,
    roundingMethod: "ceil",
  });
  const endDate = endOfDay(addMonths(startDate, 2));

  const validTimes = await getValidTimesFromSchedule(
    eachMinuteOfInterval({ start: startDate, end: endDate }, { step: 15 }),
    event
  );

  if (validTimes.length === 0) {
    return <NoTimeSlots event={event} calendarUser={calendarUser} />;
  }

  return (
    <>
      <AppName />
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            Book {`"${event.name}"`} with {calendarUser.fullName}
          </CardTitle>
          {event.description && (
            <CardDescription>{event.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <MeetingForm
            validTimes={validTimes}
            eventId={event.id}
            clerkUserId={clerkUserId}
            durationInMinutes={event.durationInMinutes}
          />
        </CardContent>
      </Card>
    </>
  );
}
