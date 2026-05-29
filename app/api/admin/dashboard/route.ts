import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissions, projects, services, packages, teamMembers, stats, socialLinks } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { requireAdminAPI } from "@/lib/auth";

export async function GET() {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const [
    totalSubs,
    unpaidSubs,
    depositSubs,
    paidSubs,
    projectCount,
    serviceCount,
    packageCount,
    teamCount,
    statCount,
    socialCount,
    recentSubs,
  ] = await Promise.all([
    db.select({ count: count() }).from(contactSubmissions),
    db.select({ count: count() }).from(contactSubmissions).where(eq(contactSubmissions.paymentStatus, "unpaid")),
    db.select({ count: count() }).from(contactSubmissions).where(eq(contactSubmissions.paymentStatus, "deposit_paid")),
    db.select({ count: count() }).from(contactSubmissions).where(eq(contactSubmissions.paymentStatus, "fully_paid")),
    db.select({ count: count() }).from(projects),
    db.select({ count: count() }).from(services),
    db.select({ count: count() }).from(packages),
    db.select({ count: count() }).from(teamMembers),
    db.select({ count: count() }).from(stats),
    db.select({ count: count() }).from(socialLinks),
    db.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt).limit(5),
  ]);

  return NextResponse.json({
    submissions: {
      total: totalSubs[0].count,
      unpaid: unpaidSubs[0].count,
      depositPaid: depositSubs[0].count,
      fullyPaid: paidSubs[0].count,
    },
    counts: {
      projects: projectCount[0].count,
      services: serviceCount[0].count,
      packages: packageCount[0].count,
      team: teamCount[0].count,
      stats: statCount[0].count,
      socialLinks: socialCount[0].count,
    },
    recentSubmissions: recentSubs,
  });
}
