import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const integrations = await prisma.integration.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ integrations });
  } catch (error) {
    console.error("Integrations fetch error:", error);
    return NextResponse.json({ integrations: [] });
  }
}
