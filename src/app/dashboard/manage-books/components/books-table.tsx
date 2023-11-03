"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDebounce from "@/hooks/useDebounce";
import { Book } from "@prisma/client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";

type Props = {};

const BooksTable = (props: Props) => {
  const session = useSession();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const debouncedKeyword = useDebounce(search, 300);
  if (!session) redirect("/login");

  const {
    data: books,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<{ data: Book[] }>({
    queryKey: ["books", debouncedKeyword, page],
    queryFn: async () => {
      const res = await axios.get(
        `/api/books?search=${debouncedKeyword}&page=${page}`
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  return (
    <Table className="rounded-lg">
      <TableCaption>A list of all books</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Cover</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Genre</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Copies</TableHead>
          <TableHead className="text-right">Created at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {books?.data.map((book) => (
          <TableRow key={book.id}>
            <TableCell>{book.id}</TableCell>
            <TableCell className="font-medium">
              <div className="relative w-10 h-16 flex flex-row gap-4 items-center overflow-hidden rounded-lg">
                <Image
                  alt="book cover "
                  fill
                  style={{ objectFit: "cover" }}
                  src={book.coverImage || "/placeholder.jpg"}
                />
              </div>
            </TableCell>

            <TableCell className="font-medium">{book.title}</TableCell>
            <TableCell className="font-medium">{book.author}</TableCell>
            <TableCell>{book.genre}</TableCell>
            <TableCell>{book.stock}</TableCell>
            <TableCell>{book.copies}</TableCell>
            <TableCell className="text-right">
              {new Date(book.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BooksTable;
