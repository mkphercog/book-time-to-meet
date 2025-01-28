import { notFound } from "next/navigation";
import Link from "next/link";
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
import { formatEventDescription } from "@/lib/formatters";
import { clerkClient } from "@clerk/nextjs/server";

export const revalidate = 0;

type BookingPageProps = {
  params: { clerkUserId: string };
};

export default async function BookingPage({
  params: { clerkUserId },
}: BookingPageProps) {
  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  });

  if (events.length === 0) return notFound();
  const { fullName } = await clerkClient().users.getUser(clerkUserId);
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-4xl md:text-5xl font-semibold mb-4 text-center">
        {fullName}
      </div>
      <div className="text-muted-foreground mb-6 max-w-sm mx-auto text-center">
        Welcome to my scheduling page. Please follow the instructions to add an
        event to my calendar.
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
}

type EventCardProps = {
  id: string;
  name: string;
  description: string | null;
  durationInMinutes: number;
  clerkUserId: string;
};

const EventCard = ({
  id,
  name,
  description,
  durationInMinutes,
  clerkUserId,
}: EventCardProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {formatEventDescription(durationInMinutes)}
        </CardDescription>
      </CardHeader>
      {description != null && <CardContent>{description}</CardContent>}
      <CardFooter className="flex justify-end gap-2 mt-auto">
        <Button asChild>
          <Link href={ROUTES.book.eventDetails(clerkUserId, id)}>Select</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
