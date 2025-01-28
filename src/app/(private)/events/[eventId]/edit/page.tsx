import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/forms/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 0;

type EditEventPageProps = {
  params: { eventId: string };
};

export default async function EditEventPage({
  params: { eventId },
}: EditEventPageProps) {
  const { userId, redirectToSignIn } = auth();

  if (userId == null) return redirectToSignIn();

  const event = await db.query.EventTable.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) =>
      and(eq(clerkUserId, userId), eq(id, eventId)),
  }).catch(() => {
    notFound();
  });

  if (event == null) return notFound();

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Edit Event</CardTitle>
      </CardHeader>
      <CardContent>
        <EventForm
          event={{ ...event, description: event.description || undefined }}
        />
      </CardContent>
    </Card>
  );
}
