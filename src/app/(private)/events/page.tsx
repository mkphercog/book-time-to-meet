import Link from "next/link";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { ROUTES } from "@/data/routes";
import { EventCard, EventsEmptyState } from "@/components/events";

export const revalidate = 0;

export default async function EventsPage() {
  const { userId, redirectToSignIn } = auth();

  if (userId == null) return redirectToSignIn();

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });

  return (
    <>
      <div className="flex gap-4 items-baseline">
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6">
          Events
        </h1>
        <Button asChild>
          <Link href={ROUTES.events.new()}>
            <CalendarPlus className="mr-4 size-6" /> New Event
          </Link>
        </Button>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <EventsEmptyState />
      )}
    </>
  );
}
