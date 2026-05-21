import { NextRequest, NextResponse } from "next/server";
import { getMockResponse } from "@/lib/mock-ai";
import { AssistantMessageSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AssistantMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { message, context, conversationId } = parsed.data;
    const mockResp = getMockResponse(message);

    // Try to persist to DB (non-fatal if DB not connected)
    try {
      const user = await prisma.user.findFirst({ where: { email: "demo@nextport.ai" } });
      if (user) {
        let convId = conversationId;

        if (!convId) {
          const conv = await prisma.assistantConversation.create({
            data: { userId: user.id, context: context ?? null },
          });
          convId = conv.id;
        }

        await prisma.assistantMessage.createMany({
          data: [
            {
              conversationId: convId,
              role: "user",
              content: message,
              relatedLessons: [],
            },
            {
              conversationId: convId,
              role: "assistant",
              content: mockResp.response,
              relatedLessons: mockResp.relatedLessons,
              suggestedAction: mockResp.suggestedAction ?? null,
            },
          ],
        });
      }
    } catch {
      // DB not connected — still return response
    }

    return NextResponse.json({
      response: mockResp.response,
      relatedLessons: mockResp.relatedLessons,
      suggestedAction: mockResp.suggestedAction ?? null,
    });
  } catch (error) {
    console.error("Assistant error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
