import * as z from "zod";

export const createSprintSchema = z
  .object({
    name: z.string().min(3, "Sprint name must be at least 3 characters"),
    start_date: z.date({ required_error: "Start date is required" }),
    end_date: z.date({ required_error: "End date is required" }),
  })
  .refine((data) => data.end_date > data.start_date, {
    message: "End date must be after start date",
    path: ["end_date"],
  });

export type CreateSprintInput = z.infer<typeof createSprintSchema>;
