import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdminAPI } from "@/lib/auth";

export async function GET() {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const rows = await db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt));

  return NextResponse.json(rows);
}

export async function PATCH(request: Request) {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const { id, paymentStatus } = await request.json();
  if (!id || !paymentStatus) {
    return NextResponse.json({ error: "id and paymentStatus required" }, { status: 400 });
  }

  const valid = ["unpaid", "deposit_paid", "fully_paid"];
  if (!valid.includes(paymentStatus)) {
    return NextResponse.json({ error: "Invalid paymentStatus" }, { status: 400 });
  }

  const [updated] = await db
    .update(contactSubmissions)
    .set({ paymentStatus })
    .where(eq(contactSubmissions.id, id))
    .returning();

  return NextResponse.json(updated);
}
