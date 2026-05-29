import { NextResponse } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAdminAPI, hashPassword } from "@/lib/auth";

export async function GET() {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const rows = await db
    .select({
      id: adminUsers.id,
      name: adminUsers.name,
      username: adminUsers.username,
      email: adminUsers.email,
      role: adminUsers.role,
      isActive: adminUsers.isActive,
      createdAt: adminUsers.createdAt,
      lastLoginAt: adminUsers.lastLoginAt,
    })
    .from(adminUsers)
    .orderBy(desc(adminUsers.createdAt));

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const body = await request.json();
  const { name, username, email, password, role } = body;

  if (!name || !username || !email || !password) {
    return NextResponse.json({ error: "name, username, email, and password are required" }, { status: 400 });
  }

  // Check for duplicates
  const existing = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const [created] = await db
    .insert(adminUsers)
    .values({ name, username, email, passwordHash, role: role ?? "admin" })
    .returning({
      id: adminUsers.id,
      name: adminUsers.name,
      username: adminUsers.username,
      email: adminUsers.email,
      role: adminUsers.role,
      isActive: adminUsers.isActive,
      createdAt: adminUsers.createdAt,
      lastLoginAt: adminUsers.lastLoginAt,
    });

  return NextResponse.json(created);
}
