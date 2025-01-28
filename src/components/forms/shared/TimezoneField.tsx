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
import { formatTimezoneOffset } from "@/lib/formatters";
import {
  Control,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";

type TimezoneFieldProps<T extends FieldValues> = Omit<
  UseControllerProps<T>,
  "control"
> & {
  control: Control<T>;
  name: FieldPath<T>;
};

export const TimezoneField = <T extends FieldValues>({
  control,
  name,
}: TimezoneFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Timezone</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Intl.supportedValuesOf("timeZone").map((timezone) => (
                <SelectItem key={timezone} value={timezone}>
                  {timezone}
                  {` (${formatTimezoneOffset(timezone)})`}
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
