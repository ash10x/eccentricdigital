import { NextResponse } from "next/server";
import { getAdminFromToken, requireAdminAPI } from "@/lib/auth";

export async function GET() {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const admin = await getAdminFromToken();
  return NextResponse.json(admin ?? { userId: 0, username: "admin" });
}
