import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import AvatarNav from "./AvatarNav";
import ThemeToggle from "./ThemeToggle";
import { Menu } from "./Menu";
import { Role } from "@prisma/client";

type Props = {};

const Navbar = async (props: Props) => {
  const session = await getAuthSession();

  if (!session) return redirect("/login");

  return (
    <div className="w-full h-16 flex items-center justify-between px-6">
      {session?.user.role === Role.ADMIN && <Menu />}
      <h1 className="font-extrabold">ULibrary</h1>
      <div className="flex flex-row gap-4 items-center">
        <ThemeToggle />
        <AvatarNav user={session?.user} />
      </div>
    </div>
  );
};

export default Navbar;
