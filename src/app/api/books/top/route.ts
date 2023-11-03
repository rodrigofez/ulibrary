import { prisma } from "@/lib/db";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const GET = async (req: Request, res: NextApiResponse) => {
  console.log("Hello World");

  const books = await prisma.book.findMany({
    orderBy: {
      timesBorrowed: "desc",
    },
    take: 3,
  });

  return NextResponse.json({ data: books });
};
