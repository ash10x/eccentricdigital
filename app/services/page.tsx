export const dynamic = "force-dynamic";

import { db } from "@/db";
import { services, stats } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import ServicesPageClient from "./ServicesPageClient";

export default async function ServicesPage() {
  const [servicesData, statsData] = await Promise.all([
    db
      .select({
        id: services.id,
        title: services.title,
        description: services.description,
        imageUrl: services.imageUrl,
        route: services.route,
        tags: services.tags,
      })
      .from(services)
      .orderBy(asc(services.displayOrder)),
    db
      .select({
        id: stats.id,
        value: stats.value,
        label: stats.label,
      })
      .from(stats)
      .where(eq(stats.page, "services"))
      .orderBy(asc(stats.displayOrder)),
  ]);

  return <ServicesPageClient services={servicesData} stats={statsData} />;
}
