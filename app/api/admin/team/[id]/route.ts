import { NextResponse } from "next/server";
import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminAPI } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();

  const [updated] = await db
    .update(teamMembers)
    .set({
      name: body.name,
      role: body.role,
      imageUrl: body.imageUrl,
      displayOrder: body.displayOrder,
    })
    .where(eq(teamMembers.id, Number(id)))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const { id } = await params;
  await db.delete(teamMembers).where(eq(teamMembers.id, Number(id)));
  return NextResponse.json({ success: true });
}
