import { NextResponse } from "next/server";
import { db } from "@/db";
import { maintenanceSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminAPI } from "@/lib/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const { id } = await params;
  await db.delete(maintenanceSubscriptions).where(eq(maintenanceSubscriptions.id, Number(id)));
  return NextResponse.json({ success: true });
}
