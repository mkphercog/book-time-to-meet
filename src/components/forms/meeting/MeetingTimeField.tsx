import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTimeString } from "@/lib/formatters";
import { MeetingFormSchemaType } from "@/schema/meetings";
import { isSameDay } from "date-fns";
import { FC } from "react";
import { Control } from "react-hook-form";

type MeetingTimeFieldProps = {
  formControl: Control<MeetingFormSchemaType>;
  watchers: {
    date: Date;
    timezone: string;
  };
  validTimesInTimezone: Date[];
};

export const MeetingTimeField: FC<MeetingTimeFieldProps> = ({
  formControl,
  watchers,
  validTimesInTimezone,
}) => {
  return (
    <FormField
      control={formControl}
      name="startTime"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>Time</FormLabel>
          <Select
            disabled={watchers.date == null || watchers.timezone == null}
            onValueChange={(value) =>
              field.onChange(new Date(Date.parse(value)))
            }
            defaultValue={field.value?.toISOString()}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    watchers.date == null || watchers.timezone == null
                      ? "Select a date/timezone first"
                      : "Select a meeting time"
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {validTimesInTimezone
                .filter((time) => isSameDay(time, watchers.date))
                .map((time) => (
                  <SelectItem
                    key={time.toISOString()}
                    value={time.toISOString()}
                  >
                    {formatTimeString(time)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
