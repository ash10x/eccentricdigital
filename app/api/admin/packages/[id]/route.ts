import { NextResponse } from "next/server";
import { db } from "@/db";
import { packages } from "@/db/schema";
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
    .update(packages)
    .set({
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
      price: body.price,
      features: body.features,
      paymentType: body.paymentType,
      isFeatured: body.isFeatured,
      serviceKeys: body.serviceKeys,
      displayOrder: body.displayOrder,
    })
    .where(eq(packages.id, Number(id)))
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
  await db.delete(packages).where(eq(packages.id, Number(id)));
  return NextResponse.json({ success: true });
}
