import z from "zod";

const props = {
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
};

export const emailSchema = z.object({
  email: props.email,
});

export const credentialsSchema = z.object({
  email: props.email,
  password: props.password,
});
