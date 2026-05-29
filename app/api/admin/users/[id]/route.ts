import { NextResponse } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq, and, ne, count } from "drizzle-orm";
import { requireAdminAPI, getAdminFromToken } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const { name, username, email, role, isActive } = body;

  const [updated] = await db
    .update(adminUsers)
    .set({
      ...(name !== undefined && { name }),
      ...(username !== undefined && { username }),
      ...(email !== undefined && { email }),
      ...(role !== undefined && { role }),
      ...(isActive !== undefined && { isActive }),
    })
    .where(eq(adminUsers.id, Number(id)))
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

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const { id } = await params;
  const numericId = Number(id);

  // Prevent self-deletion
  const currentAdmin = await getAdminFromToken();
  if (currentAdmin?.userId === numericId) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 403 });
  }

  // Prevent deleting the last super_admin
  const [target] = await db.select({ role: adminUsers.role }).from(adminUsers).where(eq(adminUsers.id, numericId));
  if (target?.role === "super_admin") {
    const [{ count: superAdminCount }] = await db
      .select({ count: count() })
      .from(adminUsers)
      .where(and(eq(adminUsers.role, "super_admin"), eq(adminUsers.isActive, true), ne(adminUsers.id, numericId)));

    if (Number(superAdminCount) === 0) {
      return NextResponse.json({ error: "Cannot delete the last super admin" }, { status: 403 });
    }
  }

  await db.delete(adminUsers).where(eq(adminUsers.id, numericId));
  return NextResponse.json({ success: true });
}
