import { NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAdminAPI } from "@/lib/auth";

export async function GET() {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const rows = await db.select().from(services).orderBy(asc(services.displayOrder));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const body = await request.json();
  const [created] = await db.insert(services).values({
    title: body.title,
    description: body.description,
    imageUrl: body.imageUrl,
    route: body.route,
    tags: body.tags ?? [],
    displayOrder: body.displayOrder ?? 0,
  }).returning();

  return NextResponse.json(created);
}
