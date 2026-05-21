import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const operationId = searchParams.get("operationId");

  try {
    const documents = await prisma.document.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(operationId ? { operationId } : {}),
      },
      include: {
        operation: { select: { id: true, supplier: { select: { shortName: true } } } },
        extractedFields: true,
        validationChecks: true,
      },
      orderBy: { uploadedAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Docs fetch error:", error);
    return NextResponse.json({ documents: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { operationId, type, filename } = body;

    const doc = await prisma.document.create({
      data: {
        operationId,
        type: type ?? "invoice",
        filename: filename ?? "document.pdf",
        status: "uploaded",
        confidence: 0,
        source: "upload",
      },
    });

    return NextResponse.json({ document: doc });
  } catch (error) {
    console.error("Doc create error:", error);
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
