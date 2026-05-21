import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ApprovalSchema } from "@/lib/validations";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = ApprovalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { action, note } = parsed.data;

    // Get demo user
    const user = await prisma.user.findFirst({ where: { email: "demo@nextport.ai" } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Check operation exists
    const op = await prisma.operation.findUnique({ where: { id } });
    if (!op) return NextResponse.json({ error: "Operation not found" }, { status: 404 });

    // Create approval
    const approval = await prisma.approval.create({
      data: {
        operationId: id,
        userId: user.id,
        action,
        note: note ?? null,
      },
    });

    // Update operation status if approved or held
    if (action === "approved") {
      await prisma.operation.update({ where: { id }, data: { status: "ready" } });
    } else if (action === "held") {
      await prisma.operation.update({ where: { id }, data: { status: "review" } });
    }

    // Create audit event
    await prisma.auditEvent.create({
      data: {
        operationId: id,
        userId: user.id,
        actor: user.name,
        event: action,
        detail: note ?? `Operation ${action}`,
        entityType: "Operation",
        entityId: id,
      },
    });

    return NextResponse.json({ approval, success: true });
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json({ error: "Failed to record approval" }, { status: 500 });
  }
}
