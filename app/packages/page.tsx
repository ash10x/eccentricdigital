export const dynamic = "force-dynamic";

import { db } from "@/db";
import { packages } from "@/db/schema";
import { asc } from "drizzle-orm";
import PackagesPageClient from "./PackagesPageClient";

export default async function PackagesPage() {
  const packagesData = await db
    .select({
      id: packages.id,
      title: packages.title,
      description: packages.description,
      imageUrl: packages.imageUrl,
      price: packages.price,
      features: packages.features,
      paymentType: packages.paymentType,
      isFeatured: packages.isFeatured,
    })
    .from(packages)
    .orderBy(asc(packages.displayOrder));

  return <PackagesPageClient packages={packagesData} />;
}
