import { z } from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(1, "Required").max(30, "Max 30 characters."),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  durationInMinutes: z.coerce
    .number()
    .int()
    .positive("Duration must be grater than 0")
    .max(60 * 12, `Duration must be less than 12 hours (${60 * 12} minutes)`),
});

export type EventFormSchemaType = z.infer<typeof eventFormSchema>;

export const eventFormDefaultsValues: EventFormSchemaType = {
  name: "",
  description: "",
  isActive: true,
  durationInMinutes: 30,
};
