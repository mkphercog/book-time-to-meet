import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { ROUTES } from "@/data/routes";

type NoTimeSlotsProps = {
  event: { name: string; description: string | null };
  calendarUser: {
    id: string;
    fullName: string | null;
  };
};

export const NoTimeSlots: FC<NoTimeSlotsProps> = ({ event, calendarUser }) => {
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
