import { SignJWT, jwtVerify } from "jose";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const COOKIE_NAME = "admin_token";

const getJwtSecret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET ?? "fallback-dev-secret-change-in-prod"
  );

export async function signAdminToken(userId: number = 0, username: string = "admin"): Promise<string> {
  return new SignJWT({ role: "admin", userId, username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

export async function getAdminFromToken(): Promise<{ userId: number; username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      userId: (payload.userId as number) ?? 0,
      username: (payload.username as string) ?? "admin",
    };
  } catch {
    return null;
  }
}

function safeCompare(a: string, b: string): boolean {
  const key = Buffer.from(process.env.JWT_SECRET ?? "compare-key");
  const hmacA = createHmac("sha256", key).update(a).digest();
  const hmacB = createHmac("sha256", key).update(b).digest();
  return timingSafeEqual(hmacA, hmacB);
}

export async function validateCredentials(
  username: string,
  password: string
): Promise<{ id: number; username: string } | null> {
  // Try DB first
  try {
    const dbUser = await db
      .select()
      .from(adminUsers)
      .where(and(eq(adminUsers.username, username), eq(adminUsers.isActive, true)))
      .limit(1);

    if (dbUser.length > 0) {
      const user = dbUser[0];
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return null;
      // Update last login time
      await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, user.id));
      return { id: user.id, username: user.username };
    }
  } catch {
    // DB unavailable — fall through to env-var check
  }

  // Fallback: env-var credentials (used before any DB users are created)
  const adminUser = process.env.ADMIN_USERNAME ?? "admin";
  const adminPass = process.env.ADMIN_PASSWORD ?? "";
  if (adminPass && safeCompare(username, adminUser) && safeCompare(password, adminPass)) {
    return { id: 0, username };
  }

  return null;
}

export async function requireAdminAPI(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const valid = await verifyAdminToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
