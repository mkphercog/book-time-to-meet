"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormSchemaType, eventFormSchema } from "@/schema/events";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { createEvent, deleteEvent, updateEvent } from "@/server/actions/events";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useTransition } from "react";
import { AlertDialogHeader } from "../ui/alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@radix-ui/react-alert-dialog";

type EventFormProps = {
  event?: {
    id: string;
    name: string;
    description?: string;
    durationInMinutes: number;
    isActive: boolean;
  };
};

export const EventForm = ({ event }: EventFormProps) => {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const form = useForm<EventFormSchemaType>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: event ?? {
      isActive: true,
      durationInMinutes: 30,
    },
  });

  const onSubmit = async (values: EventFormSchemaType) => {
    const action =
      event == null ? createEvent : updateEvent.bind(null, event.id);
    const data = await action(values);

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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The name users will see when booking
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="durationInMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>In minutes</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className="resize-none h-32" {...field} />
              </FormControl>
              <FormDescription>
                Optional description of the event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormLabel>Active</FormLabel>
              <FormDescription>
                Inactive events will not be visible for users to book
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          {event && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructiveGhost"
                  disabled={isDeletePending || form.formState.isSubmitting}
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your event.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="outline">Cancel</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      variant="destructive"
                      disabled={isDeletePending || form.formState.isSubmitting}
                      onClick={() => {
                        startDeleteTransition(async () => {
                          const data = await deleteEvent(event.id);

                          if (data?.error) {
                            form.setError("root", {
                              message: "There was an error deleting your event",
                            });
                          }
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button
            asChild
            variant="outline"
            type="button"
            disabled={isDeletePending || form.formState.isSubmitting}
          >
            <Link href="/events">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={isDeletePending || form.formState.isSubmitting}
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
