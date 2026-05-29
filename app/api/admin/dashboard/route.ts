import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissions, projects, services, packages, teamMembers, stats, socialLinks, maintenanceSubscriptions } from "@/db/schema";
import { eq, count, lte, gt } from "drizzle-orm";
import { requireAdminAPI } from "@/lib/auth";

export async function GET() {
  const authError = await requireAdminAPI();
  if (authError) return authError;

  const now = new Date();

  const [
    totalSubs, unpaidSubs, depositSubs, paidSubs,
    projectCount, serviceCount, packageCount, teamCount, statCount, socialCount,
    recentSubs,
    totalMaint, activeMaint, expiredMaint, pendingMaint,
    recentMaint,
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
    db.select({ count: count() }).from(maintenanceSubscriptions),
    db.select({ count: count() }).from(maintenanceSubscriptions).where(gt(maintenanceSubscriptions.subscriptionEnd, now)),
    db.select({ count: count() }).from(maintenanceSubscriptions).where(lte(maintenanceSubscriptions.subscriptionEnd, now)),
    db.select({ count: count() }).from(maintenanceSubscriptions).where(eq(maintenanceSubscriptions.status, "pending")),
    db.select({
      id: maintenanceSubscriptions.id,
      maintenanceRef: maintenanceSubscriptions.maintenanceRef,
      name: maintenanceSubscriptions.name,
      packageTitle: maintenanceSubscriptions.packageTitle,
      finalPrice: maintenanceSubscriptions.finalPrice,
      discountApplied: maintenanceSubscriptions.discountApplied,
      subscriptionEnd: maintenanceSubscriptions.subscriptionEnd,
      status: maintenanceSubscriptions.status,
      paymentStatus: maintenanceSubscriptions.paymentStatus,
      clientType: maintenanceSubscriptions.clientType,
    }).from(maintenanceSubscriptions).orderBy(maintenanceSubscriptions.createdAt).limit(5),
  ]);

  return NextResponse.json({
    submissions: {
      total: totalSubs[0].count,
      unpaid: unpaidSubs[0].count,
      depositPaid: depositSubs[0].count,
      fullyPaid: paidSubs[0].count,
    },
    maintenance: {
      total: totalMaint[0].count,
      active: activeMaint[0].count,
      expired: expiredMaint[0].count,
      pending: pendingMaint[0].count,
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
    recentMaintenance: recentMaint,
  });
}
