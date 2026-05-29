import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissions, maintenanceSubscriptions } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { isBookingRef, isMaintenanceRef } from "@/lib/generateMaintenanceRef";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref")?.trim().toUpperCase();

  if (!ref) {
    return NextResponse.json({ valid: false, error: "Reference required" }, { status: 400 });
  }

  if (isBookingRef(ref)) {
    const rows = await db
      .select({ name: contactSubmissions.name, email: contactSubmissions.email })
      .from(contactSubmissions)
      .where(eq(contactSubmissions.referenceNumber, ref))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ valid: false, error: "Reference not found" });
    }
    return NextResponse.json({ valid: true, name: rows[0].name, refType: "booking" });
  }

  if (isMaintenanceRef(ref)) {
    const rows = await db
      .select({ name: maintenanceSubscriptions.name })
      .from(maintenanceSubscriptions)
      .where(eq(maintenanceSubscriptions.maintenanceRef, ref))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ valid: false, error: "Maintenance reference not found" });
    }
    return NextResponse.json({ valid: true, name: rows[0].name, refType: "maintenance" });
  }

  return NextResponse.json({ valid: false, error: "Invalid reference format" });
}
