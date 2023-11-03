"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

import { emailSchema } from "@/schemas/login";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Input = z.infer<typeof emailSchema>;
interface EmailAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EmailAuthForm({ className, ...props }: EmailAuthFormProps) {
  const { toast } = useToast();
  const { push } = useRouter();

  const form = useForm<Input>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: Input) => {
    const res = await signIn("email", {
      ...data,
      callbackUrl: "/dashboard/me",
      redirect: false,
    });

    if (res?.error || res?.status !== 200) {
      toast({
        variant: "destructive",
        duration: 2000,
        title: "Error",
        description: "Link could not be sent",
      });
    }

    if (res?.status === 200) {
      push("/dashboard/me");
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Type your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="mt-2" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send link
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
