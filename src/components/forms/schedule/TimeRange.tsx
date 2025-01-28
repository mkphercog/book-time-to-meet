import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScheduleFormSchemaType } from "@/schema/schedule";
import { X } from "lucide-react";
import { FC } from "react";
import { UseFieldArrayRemove, UseFormReturn } from "react-hook-form";
import { Availabilities } from "./ScheduleForm";

type TimeRangeProps = {
  labelIndex: number;
  form: UseFormReturn<ScheduleFormSchemaType>;
  removeAvailability: UseFieldArrayRemove;
  dayOfWeek: string;
  field: Availabilities & { index: number };
};

export const TimeRange: FC<TimeRangeProps> = ({
  labelIndex,
  form,
  removeAvailability,
  dayOfWeek,
  field,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <FormField
          control={form.control}
          name={`availabilities.${field.index}.startTime`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="w-24"
                  aria-label={`${dayOfWeek} Start Time ${labelIndex + 1}`}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        -
        <FormField
          control={form.control}
          name={`availabilities.${field.index}.endTime`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="w-24"
                  aria-label={`${dayOfWeek} End Time ${labelIndex + 1}`}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="button"
          className="size-6 p-1"
          variant="destructiveGhost"
          onClick={() => removeAvailability(field.index)}
        >
          <X />
        </Button>
      </div>
      <FormMessage>
        {form.formState.errors.availabilities?.at?.(field.index)?.root?.message}
      </FormMessage>
      <FormMessage>
        {
          form.formState.errors.availabilities?.at?.(field.index)?.startTime
            ?.message
        }
      </FormMessage>
      <FormMessage>
        {
          form.formState.errors.availabilities?.at?.(field.index)?.endTime
            ?.message
        }
      </FormMessage>
    </div>
  );
};
