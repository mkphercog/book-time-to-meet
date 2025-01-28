"use server";

import "use-server";
import { User } from "@clerk/nextjs/server";
import { addMinutes } from "date-fns";
import { Auth, google } from "googleapis";

type SendEmailAboutNewMeetingProps = {
  oAuthClient: Auth.OAuth2Client | undefined;
  calendarUser: User;
  guest: {
    name: string;
    email: string;
    notes: string | null | undefined;
  };
  event: {
    name: string;
    startTime: Date;
    durationInMinutes: number;
  };
};

export const sendEmailAboutNewMeeting = async ({
  oAuthClient,
  calendarUser,
  guest,
  event,
}: SendEmailAboutNewMeetingProps) => {
  const gmail = google.gmail({ version: "v1", auth: oAuthClient });

  const messageParts = [
    `To: ${calendarUser.primaryEmailAddress?.emailAddress}`,
    `From: ${calendarUser.fullName} <${calendarUser.primaryEmailAddress?.emailAddress}>`,
    `Subject: New meeting with ${guest.name}!`,
    "Content-Type: text/html; charset=UTF-8",
    `
   <html>
     <body>
       <h2>Nowe wydarzenie w kalendarzu!</h2>
       <p>
         Z maila <b>${guest.email}</b> utworzono nowe wydarzenie: <b>${
      event.name
    }</b>
       </p>
       <p>
         Spotkanie odbędzie się dnia: <b>${event.startTime.toLocaleDateString()}</b>
       </p>
       <p>
         Czas spotkania: <b>${event.startTime.toLocaleTimeString()} - ${addMinutes(
      event.startTime,
      event.durationInMinutes
    ).toLocaleTimeString()}</b>
       </p>
       ${`
           <p>
           Komentarz do spotkania: <b>${
             guest.notes ? guest.notes : "- brak -"
           }</b>
           </p>
         `}
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
};
