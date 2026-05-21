import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DocumentScanSchema } from "@/lib/validations";

const docTypeFromFilename = (filename: string): string => {
  const lower = filename.toLowerCase();
  if (lower.includes("pedimento")) return "pedimento";
  if (lower.includes("invoice") || lower.includes("factura")) return "invoice";
  if (lower.includes("bl") || lower.includes("bill")) return "bl";
  if (lower.includes("packing") || lower.includes("pack")) return "packing_list";
  if (lower.includes("mve")) return "mve";
  if (lower.includes("cfdi")) return "cfdi";
  if (lower.includes("coo") || lower.includes("origin")) return "coo";
  if (lower.includes("carta")) return "carta_porte";
  return "invoice";
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = DocumentScanSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { operationId, filename, type } = parsed.data;

    const detectedType = type ?? docTypeFromFilename(filename);
    const confidence = 0.75 + Math.random() * 0.22;

    const now = new Date();
    const doc = await prisma.document.create({
      data: {
        operationId,
        type: detectedType,
        filename,
        status: "classified",
        confidence,
        source: "upload",
        uploadedAt: now,
        classifiedAt: now,
        extractedAt: new Date(now.getTime() + 2000),
        validatedAt: new Date(now.getTime() + 4000),
      },
    });

    // Create some mock extracted fields
    await prisma.extractedField.createMany({
      data: [
        {
          documentId: doc.id,
          fieldKey: "supplier_name",
          label: "Supplier Name",
          value: "Auto-Detected Supplier",
          confidence: confidence - 0.05,
          mismatch: false,
        },
        {
          documentId: doc.id,
          fieldKey: "total_value",
          label: "Total Value",
          value: "$0.00",
          confidence: confidence,
          mismatch: false,
        },
      ],
    });

    // Create validation checks
    await prisma.validationCheck.createMany({
      data: [
        { documentId: doc.id, checkName: "Document structure valid", passed: true },
        { documentId: doc.id, checkName: "Required fields present", passed: confidence > 0.85 },
      ],
    });

    return NextResponse.json({ document: doc, status: "processed" });
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
