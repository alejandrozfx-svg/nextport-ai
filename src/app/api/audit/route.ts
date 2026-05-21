import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "25");
  const skip = (page - 1) * limit;

  try {
    const [events, total] = await Promise.all([
      prisma.auditEvent.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: { select: { name: true, initials: true } },
          operation: { select: { id: true } },
        },
      }),
      prisma.auditEvent.count(),
    ]);

    return NextResponse.json({ events, total, page, limit });
  } catch (error) {
    console.error("Audit fetch error:", error);
    return NextResponse.json({ events: [], total: 0 });
  }
}
