import { db } from "@/drizzle/db";
import { clerkClient } from "@clerk/nextjs/server";
import { EventToBookCard, BookEventEmptyState } from "@/components/bookPages";

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
        {events.length === 0 ? (
          <BookEventEmptyState />
        ) : (
          events.map((event) => <EventToBookCard key={event.id} {...event} />)
        )}
      </div>
    </div>
  );
}
