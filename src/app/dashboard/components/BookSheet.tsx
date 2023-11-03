import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Book, BorrowedBook } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";

type Props = Partial<Book> & {
  open: boolean;
  onClose: (open: boolean) => void;
};

export function BookSheet({
  id,
  author,
  title,
  coverImage,
  description,
  genre,
  stock,
  open,
  copies,
  timesBorrowed,
  onClose,
}: Props) {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate, status } = useMutation<BorrowedBook, AxiosError, string>({
    mutationFn: async (bookId: string) => {
      const res = await axios.post("/api/books/borrow", { id: bookId });
      return res.data;
    },
    onSuccess: (data) => {
      toast({
        duration: 2000,
        title: "Success",
        description: `You have borrowed this book`,
      });
      onClose(false);
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      onClose(false);
      return toast({
        variant: "destructive",
        duration: 2000,
        title: "Error",
        description:
          (error.response?.data as { message: string }).message ||
          error.message,
      });
    },
  });

  const handleBorrow = () => {
    id && mutate(id);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="flex flex-col">
        <div className="overflow-auto flex-1">
          <SheetHeader className="items-center gap-4">
            <SheetTitle className="text-md">About this book</SheetTitle>
            <div className="relative overflow-hidden rounded-xl h-64 w-40">
              <Image
                alt="Book cover"
                style={{ objectFit: "cover" }}
                fill
                src={coverImage || "/placeholder.png"}
              />
            </div>
            <div className="text-center">
              <h2 className="font-semibold text-xl">{title}</h2>
              <SheetDescription>{author}</SheetDescription>
              <SheetDescription>Genre: {genre}</SheetDescription>
            </div>
          </SheetHeader>
          <div className="flex flex-col gap-5 flex-1">
            <div className="mt-4 flex justify-around gap-4 p-4 bg-accent rounded-lg ">
              <div className="flex flex-col items-center">
                <h4 className="font-semibold">{stock}</h4>
                <div className="text-sm">Stock</div>
              </div>
              <div className="flex flex-col items-center">
                <h4 className="font-semibold">{timesBorrowed}</h4>
                <div className="text-sm">Borrowed</div>
              </div>
              <div className="flex flex-col items-center">
                <h4 className="font-semibold">{copies}</h4>
                <div className="text-sm">Copies</div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Description</h3>
              <p className="text-sm mt-2">{description}</p>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button
            onClick={handleBorrow}
            disabled={status == "pending"}
            className="w-full"
          >
            {status == "pending" && (
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Request
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
