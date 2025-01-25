"use server";

import "use-server";
import { clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { addMinutes, endOfDay, startOfDay } from "date-fns";

export async function getCalendarEventTimes(
  clerkUserId: string,
  { start, end }: { start: Date; end: Date }
) {
  const oAuthClient = await getOAuthClient(clerkUserId);

  const events = await google.calendar("v3").events.list({
    calendarId: "primary",
    eventTypes: ["default"],
    singleEvents: true,
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    maxResults: 2500,
    auth: oAuthClient,
  });

  return (
    events.data.items
      ?.map((event) => {
        if (event.start?.date != null && event.end?.date != null) {
          return {
            start: startOfDay(event.start.date),
            end: endOfDay(event.end.date),
          };
        }

        if (event.start?.dateTime != null && event.end?.dateTime != null) {
          return {
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
          };
        }
      })
      .filter((date) => date != null) || []
  );
}

async function getOAuthClient(clerkUserId: string) {
  const token = await clerkClient().users.getUserOauthAccessToken(
    clerkUserId,
    "oauth_google"
  );

  if (token.data.length === 0 || token.data[0].token == null) {
    return;
  }

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URL
  );

  client.setCredentials({ access_token: token.data[0].token });

  return client;
}

export const createCalendarEvent = async ({
  clerkUserId,
  guestName,
  guestEmail,
  startTime,
  guestNotes,
  durationInMinutes,
  eventName,
}: {
  clerkUserId: string;
  guestName: string;
  guestEmail: string;
  startTime: Date;
  guestNotes?: string | null;
  durationInMinutes: number;
  eventName: string;
}) => {
  const oAuthClient = await getOAuthClient(clerkUserId);
  const calendarUser = await clerkClient().users.getUser(clerkUserId);
  if (calendarUser.primaryEmailAddress == null) {
    throw new Error("Clerk user has no email");
  }

  const calendarEvent = await google.calendar("v3").events.insert({
    calendarId: "primary",
    auth: oAuthClient,
    sendUpdates: "all",
    requestBody: {
      attendees: [
        { email: guestEmail, displayName: guestName },
        {
          email: calendarUser.primaryEmailAddress.emailAddress,
          displayName: calendarUser.fullName,
          responseStatus: "accepted",
        },
      ],
      reminders: {
        overrides: [
          { method: "email", minutes: 1440 },
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 10 },
        ],
        useDefault: false,
      },
      description: guestNotes ? `Additional details: ${guestNotes}` : undefined,
      start: {
        dateTime: startTime.toISOString(),
      },
      end: {
        dateTime: addMinutes(startTime, durationInMinutes).toISOString(),
      },
      summary: `${guestName} + ${calendarUser.fullName}: ${eventName}`,
    },
  });

  const gmail = google.gmail({ version: "v1", auth: oAuthClient });

  const messageParts = [
    `To: ${calendarUser.primaryEmailAddress.emailAddress}`,
    `From: ${calendarUser.fullName} <${calendarUser.primaryEmailAddress.emailAddress}>`,
    `Subject: New meeting with ${guestName}!`,
    "Content-Type: text/html; charset=UTF-8",
    `
    <html>
      <body>
        <h2>Nowe wydarzenie w kalendarzu!</h2>
        <p>
          Z maila <b>${guestEmail}</b> utworzono nowe wydarzenie: <b>${eventName}</b>
        </p>
        <p>
          Spotkanie odbędzie się dnia: <b>${startTime.toLocaleDateString()}</b>
        </p>
        <p>
          Czas spotkania: <b>${startTime.toLocaleTimeString()} - ${addMinutes(
      startTime,
      durationInMinutes
    ).toLocaleTimeString()}</b>
        </p>
        ${
          guestNotes &&
          `
            <p>
            Komentarz do spotkania: <b>${guestNotes}</b>
            </p>
          `
        }
      </body>
    </html>
    `,
  ];

  const message = messageParts.join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  try {
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });
  } catch (error: any) {
    console.error("Gmail error: ", error?.response?.data || error?.message);
  }

  return calendarEvent.data;
};
