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
import { Book, User } from "@prisma/client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";

type Props = {};

const UsersTable = (props: Props) => {
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
  } = useQuery<{ data: User[] }>({
    queryKey: ["users", debouncedKeyword, page],
    queryFn: async () => {
      const res = await axios.get(
        `/api/users?search=${debouncedKeyword}&page=${page}`
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  return (
    <Table className="rounded-lg">
      <TableCaption>A list of all users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Created at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {books?.data.map((book) => (
          <TableRow key={book.id}>
            <TableCell className="font-medium">{book.id}</TableCell>
            <TableCell className="font-medium">{book.name}</TableCell>
            <TableCell>{book.email}</TableCell>
            <TableCell>{book.role}</TableCell>
            <TableCell className="text-right">
              {new Date(book.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
