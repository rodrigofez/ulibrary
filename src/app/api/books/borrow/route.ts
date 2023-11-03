import { prisma } from "@/lib/db";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

import { ZodError } from "zod";

import { getAuthSession } from "@/lib/nextauth";
import { addBorrowSchema } from "@/schemas/add-borrow-schema";
import { BorrowedStatus } from "@prisma/client";

export const GET = async (req: Request, res: NextApiResponse) => {
  const url = new URL(req.url);
  const search = url.searchParams.get("search");
  const page = url.searchParams.get("page");

  const requestedBooks = await prisma.borrowedBook.findMany({
    where: {
      status: BorrowedStatus.REQUESTED,
    },
    include: {
      book: {
        include: {
          book: true,
        },
      },
    },
  });

  const borrowedBooks = await prisma.borrowedBook.findMany({
    where: {
      status: BorrowedStatus.BORROWED,
    },
    include: {
      book: {
        include: {
          book: true,
        },
      },
    },
  });

  return NextResponse.json({
    data: {
      requestedBooks,
      borrowedBooks,
    },
  });
};

// POST api/books
export const POST = async (req: Request, res: NextApiResponse) => {
  try {
    const body = await req.json();

    const { id } = addBorrowSchema.parse(body);

    const session = await getAuthSession();

    if (!session || !session.user.id)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const copy = await prisma.bookCopy.findFirst({
      where: { bookId: id, status: BorrowedStatus.RETURNED },
    });

    if (!copy)
      return NextResponse.json(
        { message: "No copies available" },
        { status: 400 }
      );

    const requested = await prisma.bookCopy.update({
      where: { id: copy.id },
      data: {
        status: BorrowedStatus.REQUESTED,
        book: {
          update: { timesBorrowed: { increment: 1 }, stock: { decrement: 1 } },
        },
        BorrowedBook: { create: { userId: session.user.id } },
      },
    });

    return NextResponse.json(
      { message: "Successful", data: requested },
      { status: 201 }
    );
  } catch (e: any) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }

    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
