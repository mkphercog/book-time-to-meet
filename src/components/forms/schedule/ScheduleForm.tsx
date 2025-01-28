"use client";

import { Control, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScheduleFormSchemaType, scheduleFormSchema } from "@/schema/schedule";
import { Form } from "../../ui/form";
import { Button } from "../../ui/button";
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";
import { timeToInt } from "@/lib/utils";

import { Fragment, useState } from "react";
import { Plus } from "lucide-react";
import { saveSchedule } from "@/server/actions/schedule";
import { TimeRange } from "./TimeRange";
import { TimezoneField } from "../shared/TimezoneField";

export type Availabilities = {
  startTime: string;
  endTime: string;
  dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number];
};

type ScheduleFormProps = {
  schedule?: {
    timezone: string;
    availabilities: Availabilities[];
  };
};

export const ScheduleForm = ({ schedule }: ScheduleFormProps) => {
  const [successMessage, setSuccessMessage] = useState<string>();
  const form = useForm<ScheduleFormSchemaType>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      timezone:
        schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      availabilities: schedule?.availabilities.toSorted((a, b) => {
        return timeToInt(a.startTime) - timeToInt(b.startTime);
      }),
    },
  });

  const {
    append: addAvailability,
    remove: removeAvailability,
    fields: availabilityFields,
  } = useFieldArray({ name: "availabilities", control: form.control });

  const groupedAvailabilityFields = Object.groupBy(
    availabilityFields.map((field, index) => ({ ...field, index })),
    (availability) => availability.dayOfWeek
  );

  const onSubmit = async (values: ScheduleFormSchemaType) => {
    const data = await saveSchedule(values);
    if (data?.error) {
      form.setError("root", {
        message: "There was an error saving your schedule",
      });
    } else {
      setSuccessMessage("Schedule saved!");
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

        {successMessage && (
          <div className="text-green-500 text-sm">{successMessage}</div>
        )}

        <TimezoneField
          control={form.control as Control<ScheduleFormSchemaType>}
          name="timezone"
        />

        <div className="grid grid-cols-[auto,1fr] gap-y-6 gap-x-4">
          {DAYS_OF_WEEK_IN_ORDER.map((dayOfWeek) => (
            <Fragment key={dayOfWeek}>
              <div className="capitalize text-sm font-semibold">
                {dayOfWeek.substring(0, 3)}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  className="size-6 p-1"
                  variant="outline"
                  onClick={() => {
                    addAvailability({
                      dayOfWeek,
                      startTime: "9:00",
                      endTime: "17:00",
                    });
                  }}
                >
                  <Plus className="size-full" />
                </Button>

                {groupedAvailabilityFields[dayOfWeek]?.map(
                  (field, labelIndex) => {
                    return (
                      <TimeRange
                        key={labelIndex}
                        labelIndex={labelIndex}
                        form={form}
                        removeAvailability={removeAvailability}
                        dayOfWeek={dayOfWeek}
                        field={field}
                      />
                    );
                  }
                )}
              </div>
            </Fragment>
          ))}
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
