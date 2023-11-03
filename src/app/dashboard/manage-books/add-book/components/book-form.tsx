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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { addBookSchema } from "@/schemas/add-book";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LoaderIcon } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Input = z.infer<typeof addBookSchema>;

type Props = {};

const BookForm = (props: Props) => {
  const file = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { push } = useRouter();

  const { mutateAsync: createBook, status } = useMutation({
    mutationFn: async (book: Input) => {
      const res = await axios.post("/api/books", book);
      return res.data;
    },
  });

  const { mutateAsync: uploadImage } = useMutation({
    mutationFn: async ({
      signedUrl,
      file,
      fileType,
    }: {
      signedUrl: string;
      fileType: string;
      file: File;
    }) => {
      const res = await axios.put(signedUrl, file, {
        headers: { "Content-Type": fileType },
      });
      return res.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      genre: "",
      copies: 1,
    },
  });

  const onSubmit = async (data: Input) => {
    console.log(data);
    const res = await createBook(data);

    if (res?.data?.signedUrl && data.fileKey && file && file.current?.files) {
      await uploadImage({
        signedUrl: res.data.signedUrl,
        file: file.current.files[0],
        fileType: data.fileKey.split(".")[1],
      });
    }

    toast({
      duration: 2000,
      title: "Success",
      description: "Book added successfully",
    });

    push("/dashboard/manage-books");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a book</CardTitle>
        <CardDescription>Fill all the fields to add a book</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="copies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of copies</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fileKey"
                  render={() => (
                    <FormItem>
                      <FormLabel>Book cover</FormLabel>
                      <FormControl>
                        <Input
                          ref={file}
                          type="file"
                          accept=".png, .jpg, .jpeg"
                          onChange={(e) => {
                            if (!e.target.files) return;
                            const newFile = e.target.files[0];
                            if (!newFile) return;

                            if (newFile.size > 1024 * 1024 * 6) {
                              form.setValue("fileKey", "");

                              form.setError("fileKey", {
                                message: "File size must be less than 6MB",
                              });
                              if (!!file.current) {
                                form.setValue("fileKey", "");
                                return (file.current.value = "");
                              }
                            }

                            if (
                              newFile.type !== "image/jpeg" &&
                              newFile.type !== "image/png"
                            ) {
                              form.setError("fileKey", {
                                message: "File type must be either jpeg or png",
                              });
                              if (!!file.current) {
                                form.setValue("fileKey", "");
                                return (file.current.value = "");
                              }
                            }

                            console.log(e.target.files[0].name);

                            return form.setValue(
                              "fileKey",
                              e.target.files[0].name
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button className="mt-6" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add book
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BookForm;
