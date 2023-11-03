import React from "react";
import BooksTable from "./components/books-table";
import SearchBar from "../components/SearchBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {};

const ManageBooks = (props: Props) => {
  return (
    <div className="p-4">
      <div className="flex gap-4 mb-8 items-center justify-between">
        <SearchBar />
        <Link href="/dashboard/manage-books/add-book">
          <Button>Add book</Button>
        </Link>
      </div>
      <BooksTable />
    </div>
  );
};

export default ManageBooks;
