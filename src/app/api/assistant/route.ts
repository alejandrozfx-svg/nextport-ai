import { NextRequest, NextResponse } from "next/server";
import { getMockResponse } from "@/lib/mock-ai";
import { AssistantMessageSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { chat } from "@/lib/ai/provider";

/* D-007: route now delegates to the AI provider abstraction.
 * - AI_PROVIDER=groq (recommended for Tutor) -> calls Groq.
 * - AI_PROVIDER=gemini -> calls Gemini chat.
 * - AI_PROVIDER=mock or any failure -> keyword-matched canned responses.
 *
 * Persistence to Prisma stays best-effort (kept from before). The route also
 * preserves the original `relatedLessons` / `suggestedAction` shape from the
 * legacy mock-ai so the UI doesn't have to change. */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AssistantMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { message, context, conversationId } = parsed.data;

    /* Real provider path. Falls back to legacy mock-ai if the provider
     * abstraction returns nothing useful — kept for the lesson-recommendation
     * + suggestedAction extras the old path emitted. */
    const ai = await chat({
      messages: [
        {
          role: "system",
          content:
            "Eres Nextport Tutor, un asistente especializado en cumplimiento de importación México. Respuestas breves (1-2 párrafos), accionables, en el idioma del usuario. No inventes datos.",
        },
        { role: "user", content: message },
      ],
      context,
    });

    const legacyMock = getMockResponse(message);
    const mockResp = {
      response: ai.text || legacyMock.response,
      relatedLessons: legacyMock.relatedLessons,
      suggestedAction: legacyMock.suggestedAction,
    };

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
