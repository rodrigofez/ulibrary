import { Role } from "@prisma/client";
import z from "zod";

const message = "This field is required";

export const addUserSchema = z.object({
  name: z.string().min(1, message).max(255),
  email: z.string().min(1, message).max(255),
  role: z.enum([Role.ADMIN, Role.STUDENT]),
});
