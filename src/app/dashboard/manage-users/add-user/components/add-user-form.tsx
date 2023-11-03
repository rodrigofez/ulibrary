"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { addUserSchema } from "@/schemas/add-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role, User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { LoaderIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Input = z.infer<typeof addUserSchema>;

const AddUserForm = () => {
  const { toast } = useToast();
  const { push } = useRouter();

  const { mutateAsync: createUser } = useMutation<User, AxiosError, Input>({
    mutationFn: async (user: Input) => {
      const res = await axios.post("/api/users", user);
      return res.data;
    },
    onSuccess: () => {},
    onError: (error) => {
      form.reset();
      return toast({
        variant: "destructive",
        title: "Error",
        description:
          (error.response?.data as { message: string }).message ||
          error.message,
      });
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      role: Role.STUDENT,
      email: "",
    },
  });

  const onSubmit = async (data: Input) => {
    const user = await createUser(data);

    if (!user) return;

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
      toast({
        title: "Success",
        description: `You have added a new user`,
      });
      push("/dashboard/manage-users");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a user</CardTitle>
        <CardDescription>Fill all the fields to invite a user</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(Role).map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button className="mt-6" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add user
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddUserForm;
