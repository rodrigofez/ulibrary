import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

import { addBookSchema } from "@/schemas/add-book";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ZodError } from "zod";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { BorrowedStatus } from "@prisma/client";

const Bucket = process.env.AWS_BUCKET_NAME;
const prefix = "bookcovers";
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const GET = async (req: Request, res: NextApiResponse) => {
  const url = new URL(req.url);
  const search = url.searchParams.get("search");
  const page = url.searchParams.get("page");

  const books = await prisma.book.findMany({
    skip: page ? (parseInt(page as string) - 1) * 8 : 0,
    take: 8,
    where: {
      OR: [
        {
          title: {
            contains: search || "",
            mode: "insensitive",
          },
        },
        {
          author: {
            contains: search || "",
            mode: "insensitive",
          },
        },
        {
          genre: {
            contains: search || "",
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ data: books });
};

// POST api/books
export const POST = async (req: Request, res: NextApiResponse) => {
  try {
    let coverImage;
    let signedUrl;
    const body = await req.json();

    const { copies, fileKey, ...validatedBody } = addBookSchema.parse(body);

    const book = await prisma.book.create({
      data: { ...validatedBody, stock: copies, isbn: "fawef", copies: copies },
    });

    if (fileKey) {
      const fileType = fileKey.split(".")[1];
      const fileName = fileKey.split(".")[0].replace(" ", "_");
      const command = new PutObjectCommand({
        Bucket,
        Key: `${prefix}/${book.id}`,
        ContentType: fileType,
      });
      signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
      coverImage = `https://${Bucket}.s3.amazonaws.com/${prefix}/${book.id}`;

      await prisma.book.update({
        where: { id: book.id },
        data: { coverImage },
      });
    }

    await prisma.bookCopy.createMany({
      data: Array.from({ length: copies }).map(() => ({
        bookId: book.id,
      })),
    });

    return NextResponse.json({ data: { ...book, signedUrl } }, { status: 201 });
  } catch (e: any) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }

    console.log(e.message);

    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
