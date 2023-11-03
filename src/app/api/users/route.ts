import { prisma } from "@/lib/db";
import { addUserSchema } from "@/schemas/add-user";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const GET = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    return NextResponse.json({ data: users });
  } catch (e: any) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }

    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();

    const { email, name, role } = addUserSchema.parse(body);

    const exist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (exist)
      return NextResponse.json(
        {
          message: "User already exists",
        },
        { status: 400 }
      );

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
      },
    });

    return NextResponse.json({ data: user });
  } catch (e: any) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }

    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
