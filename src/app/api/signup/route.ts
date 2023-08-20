import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json(body.error);

  const { username, password } = body.data;

  if (await prisma.user.findUnique({ where: { username } })) {
    return NextResponse.json(
      {
        error: "Username already exists",
      },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: {
      username,
      password,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
