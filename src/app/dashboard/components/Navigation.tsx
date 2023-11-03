"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  routes: {
    name: string;
    path: string;
  }[];
};

const Navigation = ({ routes }: Props) => {
  const path = usePathname();

  return (
    <div className="p-4 px-7 flex flex-row flex-wrap gap-4 justify-between w-full">
      <div className="font-extrabold flex gap-5">
        {routes.map((route) => (
          <Link
            className={clsx("border-b-2", {
              "border-blue-500": path === route.path,
              "font-normal": path !== route.path,
            })}
            href={route.path}
            key={route.path}
          >
            {route.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
