export const dynamic = "force-dynamic";

import { db } from "@/db";
import { teamMembers, stats } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import AboutPageClient from "./AboutPageClient";

export default async function AboutPage() {
  const [teamData, statsData] = await Promise.all([
    db
      .select({
        id: teamMembers.id,
        name: teamMembers.name,
        role: teamMembers.role,
        imageUrl: teamMembers.imageUrl,
      })
      .from(teamMembers)
      .orderBy(asc(teamMembers.displayOrder)),
    db
      .select({
        id: stats.id,
        value: stats.value,
        label: stats.label,
      })
      .from(stats)
      .where(eq(stats.page, "about"))
      .orderBy(asc(stats.displayOrder)),
  ]);

  return <AboutPageClient teamMembers={teamData} stats={statsData} />;
}
