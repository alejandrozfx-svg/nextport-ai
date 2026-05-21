import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [
      totalDocs,
      totalFields,
      totalChecks,
      opsByStatus,
      recentDocs,
    ] = await Promise.all([
      prisma.document.count(),
      prisma.extractedField.count(),
      prisma.validationCheck.count(),
      prisma.operation.groupBy({ by: ["status"], _count: true }),
      prisma.document.findMany({
        orderBy: { uploadedAt: "desc" },
        take: 30,
        select: { uploadedAt: true, confidence: true, type: true },
      }),
    ]);

    const avgConfidence =
      recentDocs.length > 0
        ? recentDocs.reduce((s, d) => s + d.confidence, 0) / recentDocs.length
        : 0;

    const passedChecks = await prisma.validationCheck.count({ where: { passed: true } });

    // Group docs by day for chart
    const docsByDay: Record<string, number> = {};
    recentDocs.forEach((d) => {
      const day = d.uploadedAt.toISOString().slice(0, 10);
      docsByDay[day] = (docsByDay[day] ?? 0) + 1;
    });

    // Confidence distribution
    const confBuckets = { "90-100": 0, "75-89": 0, "60-74": 0, "0-59": 0 };
    recentDocs.forEach((d) => {
      const pct = d.confidence * 100;
      if (pct >= 90) confBuckets["90-100"]++;
      else if (pct >= 75) confBuckets["75-89"]++;
      else if (pct >= 60) confBuckets["60-74"]++;
      else confBuckets["0-59"]++;
    });

    return NextResponse.json({
      kpis: {
        documentsClassified: totalDocs,
        fieldsExtracted: totalFields,
        validationsRun: totalChecks,
        avgConfidence: Math.round(avgConfidence * 100),
        passRate: totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0,
      },
      operationsByStatus: opsByStatus.map((o) => ({
        status: o.status,
        count: o._count,
      })),
      docsByDay: Object.entries(docsByDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count })),
      confidenceDistribution: Object.entries(confBuckets).map(([range, count]) => ({
        range,
        count,
      })),
    });
  } catch (error) {
    console.error("Intelligence error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
