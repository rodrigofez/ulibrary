import { prisma } from "@/lib/db";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const GET = async (req: Request, res: NextApiResponse) => {
  const books = await prisma.book.findMany({
    orderBy: {
      timesBorrowed: "desc",
    },
    take: 3,
  });

  return NextResponse.json({ data: books });
};

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();

    return NextResponse.json({ data: body });
  } catch (e: any) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }

    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
