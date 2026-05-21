import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const op = await prisma.operation.findUnique({
      where: { id },
      include: {
        supplier: true,
        broker: true,
        owner: true,
        documents: {
          include: {
            extractedFields: true,
            validationChecks: true,
          },
        },
        exceptions: { orderBy: { createdAt: "asc" } },
        approvals: {
          include: { user: { select: { name: true, initials: true } } },
          orderBy: { createdAt: "desc" },
        },
        auditEvents: { orderBy: { createdAt: "desc" }, take: 20 },
        aiSummaryRec: true,
      },
    });

    if (!op) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const result = {
      id: op.id,
      supplier: {
        name: op.supplier.name,
        shortName: op.supplier.shortName,
        country: op.supplier.country,
        city: op.supplier.city,
      },
      broker: { name: op.broker.name, patent: op.broker.patent },
      origin: op.origin,
      destination: op.destination,
      mode: op.mode,
      incoterm: op.incoterm,
      eta: op.eta,
      etaDelta: op.etaDelta,
      value: op.value,
      currency: op.currency,
      pedimento: op.pedimento,
      hsBucket: op.hsBucket,
      status: op.status,
      owner: { name: op.owner.name, initials: op.owner.initials, role: op.owner.role },
      aiSummary: op.aiSummaryRec?.summary ?? op.aiSummary ?? null,
      documents: op.documents.map((d) => ({
        id: d.id,
        type: d.type,
        filename: d.filename,
        status: d.status,
        confidence: d.confidence,
        source: d.source,
        uploadedAt: d.uploadedAt,
        extractedFields: d.extractedFields,
        validationChecks: d.validationChecks,
      })),
      exceptions: op.exceptions.map((ex) => ({
        id: ex.id,
        kind: ex.kind,
        title: ex.title,
        detail: ex.detail,
        refs: ex.refs,
        fields: ex.fields,
        docs: ex.docs,
        resolved: ex.resolved,
      })),
      approvals: op.approvals.map((ap) => ({
        id: ap.id,
        action: ap.action,
        note: ap.note,
        createdAt: ap.createdAt,
        user: ap.user,
      })),
      auditEvents: op.auditEvents,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch operation:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
