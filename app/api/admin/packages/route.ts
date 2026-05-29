import { NextResponse } from "next/server";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAdminAPI } from "@/lib/auth";

export async function GET() {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const rows = await db.select().from(packages).orderBy(asc(packages.displayOrder));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const body = await request.json();
  const [created] = await db.insert(packages).values({
    title: body.title,
    description: body.description,
    imageUrl: body.imageUrl ?? "",
    price: body.price,
    features: body.features ?? [],
    paymentType: body.paymentType,
    isFeatured: body.isFeatured ?? false,
    serviceKeys: body.serviceKeys ?? [],
    displayOrder: body.displayOrder ?? 0,
  }).returning();

  return NextResponse.json(created);
}
