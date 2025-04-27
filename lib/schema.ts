import { z } from "zod";

export const restroomFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  cleanliness: z.number().min(1).max(5),
  features: z.array(z.string()),
  paymentType: z.enum(["Free", "Paid"]),
  type: z.enum(["Public", "Private"]),
  gender: z
    .array(z.string())
    .min(1, "At least one gender option must be selected"),
});

export type RestroomFormValues = z.infer<typeof restroomFormSchema>;
