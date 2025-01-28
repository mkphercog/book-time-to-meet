"use server";

import "use-server";
import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { EventFormSchemaType, eventFormSchema } from "@/schema/events";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ROUTES } from "@/data/routes";

export async function createEvent(
  unsafeData: EventFormSchemaType
): Promise<{ error: boolean } | undefined> {
  const { userId } = auth();
  const { success, data } = eventFormSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return { error: true };
  }

  await db.insert(EventTable).values({ ...data, clerkUserId: userId });
  redirect(ROUTES.events.home());
}

export async function updateEvent(
  id: string,
  unsafeData: EventFormSchemaType
): Promise<{ error: boolean } | undefined> {
  const { userId } = auth();
  const { success, data } = eventFormSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return { error: true };
  }

  const { rowCount } = await db
    .update(EventTable)
    .set({ ...data })
    .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

  if (rowCount === 0) {
    return { error: true };
  }

  redirect(ROUTES.events.home());
}

export const deleteEvent = async (
  id: string
): Promise<{ error: boolean } | undefined> => {
  const { userId } = auth();

  if (userId == null) {
    return { error: true };
  }

  await db
    .delete(EventTable)
    .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

  redirect(ROUTES.events.home());
};
