import z from "zod";

const message = "This field is required";

export const addBookSchema = z.object({
  title: z.string().min(1, message).max(255),
  description: z.string().min(1, message).max(255),
  author: z.string().min(1, message).max(255),
  genre: z.string().min(1, message).max(255),
  copies: z.coerce.number().min(1, message).max(20),
  fileKey: z.string().optional(),
});
