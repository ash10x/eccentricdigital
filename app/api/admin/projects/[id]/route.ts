import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
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
    .update(projects)
    .set({
      title: body.title,
      imageUrl: body.imageUrl,
      siteUrl: body.siteUrl,
      displayOrder: body.displayOrder,
    })
    .where(eq(projects.id, Number(id)))
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
  await db.delete(projects).where(eq(projects.id, Number(id)));
  return NextResponse.json({ success: true });
}
