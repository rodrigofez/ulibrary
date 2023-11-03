"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import BookCard from "../components/BookCard";
import PopularBookCard from "../components/PopularBookCard";
import { Book } from "@prisma/client";
import BooksSkeleton from "../components/BooksSkeleton";
import SearchBar from "../components/SearchBar";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { BookSheet } from "../components/BookSheet";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

type Props = {};

const Dashboard = (props: Props) => {
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

  const {
    data: topBooks,
    isLoading: isLoadingTopBooks,
    isError: isErrorTopBooks,
    isSuccess: isSuccessTopBooks,
  } = useQuery<{ data: Book[] }>({
    queryKey: ["top-books"],
    queryFn: async () => {
      const res = await axios.get(`/api/books/top`);
      return res.data;
    },
    refetchOnMount: true,
  });

  if (isError) return <div>Error</div>;

  return (
    <div className="h-full py-4  flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <h2 className="px-6 text-lg font-bold ml-3">Popular</h2>
        <div className="w-full overflow-x-auto">
          <div className="flex px-6 pb-4 gap-4 flex-row">
            {isLoadingTopBooks && <BooksSkeleton />}
            {isSuccessTopBooks &&
              topBooks.data.map((book) => (
                <PopularBookCard
                  onClick={(book) => {
                    setIsSheetOpen(true);
                    setSelectedBook(book);
                  }}
                  key={book.id}
                  {...book}
                />
              ))}
            <div className="w-12 h-2 opacity-0">.</div>
          </div>
        </div>
      </section>
      <section className="flex px-6 flex-col gap-4 pb-12">
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <h2 className="text-lg font-bold ml-3">All books</h2>
          <div className="flex gap-4">
            <SearchBar
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
        {isLoading && <BooksSkeleton />}
        {isSuccess && (
          <>
            {" "}
            <div className="flex gap-4 flex-wrap">
              {books.data.map((book) => (
                <BookCard
                  isSelected={selectedBook?.id === book.id && isSheetOpen}
                  onClick={(book) => {
                    setIsSheetOpen(true);
                    setSelectedBook(book);
                  }}
                  key={book.id}
                  {...book}
                />
              ))}
            </div>
            <div className="flex gap-2 w-full justify-end">
              <Button disabled={page == 1} onClick={() => setPage(page - 1)}>
                <ArrowLeftIcon />
              </Button>
              <Button
                disabled={books?.data.length < 8}
                onClick={() => setPage(page + 1)}
              >
                <ArrowRightIcon />
              </Button>
            </div>
          </>
        )}
        <BookSheet
          onClose={() => setIsSheetOpen(false)}
          {...selectedBook}
          open={isSheetOpen}
        />
      </section>
    </div>
  );
};

export default Dashboard;
