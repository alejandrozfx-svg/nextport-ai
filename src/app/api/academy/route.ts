import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({ where: { email: "demo@nextport.ai" } });

    const lessons = await prisma.academyLesson.findMany({
      orderBy: [{ level: "asc" }, { sortOrder: "asc" }],
      include: user
        ? {
            progress: {
              where: { userId: user.id },
              select: { completed: true, startedAt: true, doneAt: true },
            },
          }
        : undefined,
    });

    const result = lessons.map((l) => ({
      id: l.id,
      moduleNum: l.moduleNum,
      title: l.title,
      level: l.level,
      durationMin: l.durationMin,
      tags: l.tags,
      intro: l.intro,
      lessons: l.lessons,
      levelName: l.levelName,
      levelTag: l.levelTag,
      sortOrder: l.sortOrder,
      progress: (l as { progress?: Array<{ completed: boolean; startedAt: Date; doneAt: Date | null }> }).progress?.[0] ?? null,
    }));

    return NextResponse.json({ lessons: result });
  } catch (error) {
    console.error("Academy fetch error:", error);
    return NextResponse.json({ lessons: [] });
  }
}
