import { notFound } from "next/navigation";
import Link from "next/link";
import { MeetingForm } from "@/components/forms/MeetingForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/data/routes";
import { db } from "@/drizzle/db";
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";
import { clerkClient } from "@clerk/nextjs/server";
import {
  addMonths,
  eachMinuteOfInterval,
  endOfDay,
  roundToNearestMinutes,
} from "date-fns";

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
        />
      </CardContent>
    </Card>
  );
}

const NoTimeSlots = ({
  event,
  calendarUser,
}: {
  event: { name: string; description: string | null };
  calendarUser: {
    id: string;
    fullName: string | null;
  };
}) => {
  return (
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
        {calendarUser.fullName} is currently booked up. Please check back later
        or choose a shorter event.
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={ROUTES.book.allUserEvents(calendarUser.id)}>
            Choose Another Event
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
