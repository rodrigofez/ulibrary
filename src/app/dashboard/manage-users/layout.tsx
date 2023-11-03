import { getAuthSession } from "@/lib/nextauth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import Navigation from "../components/Navigation";

const routes = [
  {
    name: "User list",
    path: "/dashboard/manage-users",
  },
];

export const DashboardLayout = async ({
  children, // will be a page or nested layout
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
