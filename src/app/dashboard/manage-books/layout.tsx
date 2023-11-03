import { getAuthSession } from "@/lib/nextauth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import Navigation from "../components/Navigation";

const routes = [
  {
    name: "Book list",
    path: "/dashboard/manage-books",
  },
  {
    name: "Borrowed books",
    path: "/dashboard/manage-books/borrowed",
  },
];

export const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getAuthSession();

  if (!session || session.user.role !== Role.ADMIN) redirect("/");

  return (
    <>
      <Navigation routes={routes} />
      {children}
    </>
  );
};

export default DashboardLayout;
