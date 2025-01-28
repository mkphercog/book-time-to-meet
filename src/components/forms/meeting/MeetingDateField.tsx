import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { formatDate } from "@/lib/formatters";
import { Control } from "react-hook-form";
import { FC } from "react";
import { MeetingFormSchemaType } from "@/schema/meetings";

type MeetingDateFieldProps = {
  formControl: Control<MeetingFormSchemaType>;
  validTimesInTimezone: Date[];
};

export const MeetingDateField: FC<MeetingDateFieldProps> = ({
  formControl,
  validTimesInTimezone,
}) => {
  return (
    <FormField
      control={formControl}
      name="date"
      render={({ field }) => (
        <Popover>
          <FormItem className="flex-1">
            <FormLabel>Date</FormLabel>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "pl-3 text-left font-normal flex w-full",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    formatDate(field.value)
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                weekStartsOn={1}
                disabled={(date) =>
                  !validTimesInTimezone.some((time) => isSameDay(date, time))
                }
              />
            </PopoverContent>
            <FormMessage />
          </FormItem>
        </Popover>
      )}
    />
  );
};
