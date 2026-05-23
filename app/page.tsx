export const dynamic = "force-dynamic";

import { db } from "@/db";
import { projects, stats } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import LandingPageClient from "./LandingPageClient";

export default async function LandingPage() {
  const [projectsData, statsData] = await Promise.all([
    db
      .select({
        id: projects.id,
        title: projects.title,
        imageUrl: projects.imageUrl,
        siteUrl: projects.siteUrl,
      })
      .from(projects)
      .orderBy(asc(projects.displayOrder)),
    db
      .select({
        id: stats.id,
        value: stats.value,
        label: stats.label,
      })
      .from(stats)
      .where(eq(stats.page, "home"))
      .orderBy(asc(stats.displayOrder)),
  ]);

  return <LandingPageClient projects={projectsData} stats={statsData} />;
}
