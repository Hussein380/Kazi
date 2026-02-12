import { z } from "zod";

const phoneSchema = z
  .string()
  .regex(/^\+254\d{9}$/, "Phone must be +254 followed by 9 digits");

const pinSchema = z
  .string()
  .regex(/^\d{4}$/, "PIN must be exactly 4 digits");

export const workerRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: phoneSchema,
  county: z.string().min(1, "Please select a county"),
  workTypes: z.array(z.string()).min(1, "Select at least one role"),
  pin: pinSchema,
});

export const employerRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: phoneSchema,
  county: z.string().min(1, "Please select a county"),
  pin: pinSchema,
});

export const loginSchema = z.object({
  phone: phoneSchema,
  pin: pinSchema,
});

export type WorkerRegistrationData = z.infer<typeof workerRegistrationSchema>;
export type EmployerRegistrationData = z.infer<typeof employerRegistrationSchema>;
export type LoginData = z.infer<typeof loginSchema>;
