import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAdminAPI } from "@/lib/auth";

export async function GET() {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const rows = await db.select().from(projects).orderBy(asc(projects.displayOrder));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const body = await request.json();
  const [created] = await db.insert(projects).values({
    title: body.title,
    imageUrl: body.imageUrl,
    siteUrl: body.siteUrl,
    displayOrder: body.displayOrder ?? 0,
  }).returning();

  return NextResponse.json(created);
}
