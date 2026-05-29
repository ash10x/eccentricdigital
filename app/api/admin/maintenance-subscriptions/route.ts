import { NextResponse } from "next/server";
import { db } from "@/db";
import { maintenanceSubscriptions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdminAPI } from "@/lib/auth";

export async function GET() {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const now = new Date();
  const rows = await db
    .select()
    .from(maintenanceSubscriptions)
    .orderBy(desc(maintenanceSubscriptions.createdAt));

  // Compute live status
  const enriched = rows.map((r) => ({
    ...r,
    computedStatus: new Date(r.subscriptionEnd) <= now
      ? "expired"
      : r.status,
    daysRemaining: Math.ceil((new Date(r.subscriptionEnd).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  }));

  return NextResponse.json(enriched);
}

export async function PATCH(request: Request) {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const body = await request.json();
  const { id, paymentStatus, status } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const [updated] = await db
    .update(maintenanceSubscriptions)
    .set({
      ...(paymentStatus !== undefined && { paymentStatus }),
      ...(status !== undefined && { status }),
    })
    .where(eq(maintenanceSubscriptions.id, id))
    .returning();

  return NextResponse.json(updated);
}
