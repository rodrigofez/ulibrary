import React from "react";
import UsersTable from "./components/users-table";
import SearchBar from "../components/SearchBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {};

const ManageUsers = (props: Props) => {
  return (
    <div className="p-4">
      <div className="flex gap-4 mb-8 items-center justify-between">
        <SearchBar />
        <Link href="/dashboard/manage-users/add-user">
          <Button>Add user</Button>
        </Link>
      </div>
      <UsersTable />
    </div>
  );
};

export default ManageUsers;
