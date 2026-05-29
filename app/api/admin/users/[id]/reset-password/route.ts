import { NextResponse } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminAPI, hashPassword } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const { id } = await params;
  const { password } = await request.json();

  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  const [updated] = await db
    .update(adminUsers)
    .set({ passwordHash })
    .where(eq(adminUsers.id, Number(id)))
    .returning({ id: adminUsers.id });

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
