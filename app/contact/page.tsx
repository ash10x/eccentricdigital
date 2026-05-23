export const dynamic = "force-dynamic";

import { db } from "@/db";
import { packages } from "@/db/schema";
import { asc } from "drizzle-orm";
import ContactPageClient from "./ContactPageClient";

export default async function ContactPage() {
  const packagesData = await db
    .select({
      title: packages.title,
      serviceKeys: packages.serviceKeys,
    })
    .from(packages)
    .orderBy(asc(packages.displayOrder));

  const packageOptions: Record<string, string[]> = {};
  for (const pkg of packagesData) {
    for (const key of pkg.serviceKeys) {
      if (!packageOptions[key]) packageOptions[key] = [];
      packageOptions[key].push(pkg.title);
    }
  }

  return <ContactPageClient packageOptions={packageOptions} />;
}
