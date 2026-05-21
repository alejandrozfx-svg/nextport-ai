import { NextResponse } from "next/server";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    // Dynamic import to avoid build-time issues
    const { execSync } = await import("child_process");
    execSync("npx tsx prisma/seed.ts", { stdio: "pipe" });
    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed — run npm run db:seed manually" }, { status: 500 });
  }
}
