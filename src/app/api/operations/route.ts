import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  try {
    const operations = await prisma.operation.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(search
          ? {
              OR: [
                { id: { contains: search, mode: "insensitive" } },
                { supplier: { name: { contains: search, mode: "insensitive" } } },
                { pedimento: { contains: search, mode: "insensitive" } },
                { origin: { contains: search, mode: "insensitive" } },
                { destination: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        supplier: { select: { name: true, shortName: true } },
        broker: { select: { name: true } },
        owner: { select: { name: true, initials: true } },
        documents: { select: { id: true, type: true, status: true } },
        exceptions: { where: { resolved: false }, select: { id: true } },
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });

    const serialized = operations.map((op) => ({
      id: op.id,
      supplier: op.supplier,
      broker: op.broker,
      origin: op.origin,
      destination: op.destination,
      mode: op.mode,
      incoterm: op.incoterm,
      eta: op.eta.toISOString(),
      etaDelta: op.etaDelta,
      value: op.value,
      currency: op.currency,
      status: op.status,
      owner: op.owner,
      pedimento: op.pedimento,
      hsBucket: op.hsBucket,
      docCount: op.documents.length,
      docsExpected: 6,
      exceptionCount: op.exceptions.length,
    }));

    return NextResponse.json({ operations: serialized });
  } catch (error) {
    console.error("Failed to fetch operations:", error);
    return NextResponse.json({ operations: [] });
  }
}
