import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getAuthSession();

  if (!session || !session.user.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const borrowedBooks = await prisma.borrowedBook.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      book: {
        include: {
          book: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json({ data: borrowedBooks });
}
