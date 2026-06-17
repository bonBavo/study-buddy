import { NextResponse } from "next/server";
import { performanceSchema } from "@/types";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret'
);

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch (e) {
    return null;
  }
}

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const performances = await prisma.performance.findMany({
      where: { studentId: userId },
      include: { subject: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(performances);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch performances" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const result = performanceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const performance = await prisma.performance.create({
      data: {
        ...result.data,
        studentId: userId,
      },
      include: { subject: true }
    });

    return NextResponse.json(performance, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to record performance" }, { status: 500 });
  }
}
