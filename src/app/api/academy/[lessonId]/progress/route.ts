import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AcademyProgressSchema } from "@/lib/validations";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;

  try {
    const body = await req.json();
    const parsed = AcademyProgressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { email: "demo@nextport.ai" } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const lesson = await prisma.academyLesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    const { completed } = parsed.data;

    const progress = await prisma.academyProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      create: {
        userId: user.id,
        lessonId,
        completed,
        doneAt: completed ? new Date() : null,
      },
      update: {
        completed,
        doneAt: completed ? new Date() : null,
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Progress error:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
