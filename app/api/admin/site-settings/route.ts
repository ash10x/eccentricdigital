import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminAPI } from "@/lib/auth";

export async function GET() {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const rows = await db.select().from(siteSettings);
  return NextResponse.json(rows);
}

export async function PATCH(request: Request) {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const { key, value } = await request.json();
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  const [updated] = await db
    .update(siteSettings)
    .set({ value })
    .where(eq(siteSettings.key, key))
    .returning();

  return NextResponse.json(updated);
}
