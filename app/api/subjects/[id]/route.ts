import { NextResponse } from "next/server";
import { subjectSchema } from "@/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const { id } = await params;
    const body = await request.json();
    const result = subjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json(subject);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const { id } = await params;
    await prisma.subject.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Subject deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete subject" }, { status: 500 });
  }
}
