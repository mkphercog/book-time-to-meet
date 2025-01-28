"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import {
  MeetingFormSchemaType,
  meetingFormDefaultValues,
  meetingFormSchema,
} from "@/schema/meetings";
import { toZonedTime } from "date-fns-tz";
import { createMeeting } from "@/server/actions/meetings";
import { ROUTES } from "@/data/routes";
import { MeetingDateField } from "./MeetingDateField";
import { MeetingTimeField } from "./MeetingTimeField";
import { TimezoneField } from "../shared/TimezoneField";

type MeetingFormProps = {
  validTimes: Date[];
  eventId: string;
  clerkUserId: string;
};

export const MeetingForm = ({
  validTimes,
  eventId,
  clerkUserId,
}: MeetingFormProps) => {
  const form = useForm<MeetingFormSchemaType>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: meetingFormDefaultValues,
  });
  const watchers = {
    timezone: form.watch("timezone"),
    date: form.watch("date"),
  };

  const validTimesInTimezone = useMemo(() => {
    return validTimes.map((date) => toZonedTime(date, watchers.timezone));
  }, [validTimes, watchers.timezone]);

  const onSubmit = async (values: MeetingFormSchemaType) => {
    const data = await createMeeting({ ...values, eventId, clerkUserId });

    if (data?.error) {
      form.setError("root", {
        message: "There was an error saving your event",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex gap-6 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {form.formState.errors.root && (
          <div className="text-destructive text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <TimezoneField
          control={form.control as Control<MeetingFormSchemaType>}
          name="timezone"
        />

        <div className="flex gap-4 flex-col md:flex-row">
          <MeetingDateField
            formControl={form.control}
            validTimesInTimezone={validTimesInTimezone}
          />

          <MeetingTimeField
            formControl={form.control}
            validTimesInTimezone={validTimesInTimezone}
            watchers={watchers}
          />
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="guestName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Your name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guestEmail"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Your email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="guestNotes"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <Button
            asChild
            variant="outline"
            type="button"
            disabled={form.formState.isSubmitting}
          >
            <Link href={ROUTES.book.allUserEvents(clerkUserId)}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Book
          </Button>
        </div>
      </form>
    </Form>
  );
};
