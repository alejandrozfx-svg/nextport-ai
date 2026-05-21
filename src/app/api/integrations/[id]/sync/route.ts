import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const integration = await prisma.integration.findUnique({ where: { id } });
    if (!integration) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Simulate sync
    const success = Math.random() > 0.15; // 85% success rate
    const updated = await prisma.integration.update({
      where: { id },
      data: {
        status: success ? "connected" : "error",
        lastSyncAt: new Date(),
        syncHealth: success ? "healthy" : "degraded",
        errorMessage: success ? null : "Connection timeout — retry scheduled",
      },
    });

    return NextResponse.json({ integration: updated, synced: success });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
