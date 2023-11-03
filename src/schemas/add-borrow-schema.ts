import z from "zod";

const message = "This field is required";

export const addBorrowSchema = z.object({
  id: z.string().min(1, message),
});
