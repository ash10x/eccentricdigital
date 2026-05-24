import { config } from "dotenv";
config({ path: ".env.local" });

async function seed() {
  const { db } = await import("./index");
  const { projects, teamMembers, stats, services, packages, siteSettings, socialLinks } = await import(
    "./schema"
  );

  console.log("🌱 Seeding database...");

  await db.delete(packages);
  await db.delete(services);
  await db.delete(stats);
  await db.delete(teamMembers);
  await db.delete(projects);
  await db.delete(socialLinks);
  await db.delete(siteSettings);

  await db.insert(projects).values([
    {
      title: "The Aroma Circle",
      imageUrl: "/portfolio/the-aroma-circle.png",
      siteUrl: "https://thearomacircle.shop",
      displayOrder: 0,
    },
    {
      title: "ShantyMac Pleasures",
      imageUrl: "/portfolio/shantymacpleasures.png",
      siteUrl: "https://shantymacpleasures.com",
      displayOrder: 1,
    },
    {
      title: "Beadles Ready Cash",
      imageUrl: "/portfolio/beadlesreadycash.png",
      siteUrl: "https://beadlesreadycash.com",
      displayOrder: 2,
    },
  ]);

  await db.insert(teamMembers).values([
    {
      name: "Rodique",
      role: "Founder / Creative Director",
      imageUrl: "/team/creativedirector.jpeg",
      displayOrder: 0,
    },
  ]);

  await db.insert(stats).values([
    {
      value: "+120%",
      label: "Conversion Increase",
      page: "home",
      displayOrder: 0,
    },
    {
      value: "98%",
      label: "Client Retention",
      page: "home",
      displayOrder: 1,
    },
    {
      value: "1.2s",
      label: "Load Speed",
      page: "home",
      displayOrder: 2,
    },
    {
      value: "50+",
      label: "Projects Delivered",
      page: "about",
      displayOrder: 0,
    },
    {
      value: "5+",
      label: "Years Experience",
      page: "about",
      displayOrder: 1,
    },
    {
      value: "98%",
      label: "Client Satisfaction",
      page: "about",
      displayOrder: 2,
    },
    {
      value: "24/7",
      label: "Support & Maintenance",
      page: "about",
      displayOrder: 3,
    },
    {
      value: "+120%",
      label: "Average Conversion Lift",
      page: "services",
      displayOrder: 0,
    },
    {
      value: "98%",
      label: "Client Retention",
      page: "services",
      displayOrder: 1,
    },
    {
      value: "1.2s",
      label: "Optimized Load Speeds",
      page: "services",
      displayOrder: 2,
    },
  ]);

  await db.insert(services).values([
    {
      title: "Custom Web Design",
      description:
        "Cinematic digital experiences engineered to position you as the authority.",
      imageUrl: "/images/customwebsites.jpg",
      route: "/services/custom-web-design",
      tags: ["Design", "UX", "Conversion"],
      displayOrder: 0,
    },
    {
      title: "Website Remodeling",
      description:
        "We rebuild outdated websites into modern revenue-generating platforms.",
      imageUrl: "/images/websiteremodeling.jpg",
      route: "/services/website-remodeling",
      tags: ["Redesign", "Performance", "SEO"],
      displayOrder: 1,
    },
    {
      title: "Website Maintenance",
      description:
        "Elite-level performance monitoring and proactive optimization.",
      imageUrl: "/images/websitemaintenance.jpg",
      route: "/services/website-maintenance",
      tags: ["Security", "Optimization", "Support"],
      displayOrder: 2,
    },
    {
      title: "Quick Start Websites",
      description: "Premium launch-ready websites built for serious startups.",
      imageUrl: "/images/quicksite.jpg",
      route: "/services/quick-start-websites",
      tags: ["Launch", "Fast", "Professional"],
      displayOrder: 3,
    },
  ]);

  await db.insert(packages).values([
    {
      title: "Business Professional",
      description:
        "Perfect for founders who need authority fast. Clean. Strategic. Conversion-ready.",
      imageUrl: "/images/businesspro.jpg",
      price: "$25,000",
      features: [
        "Custom Website Design",
        "SEO Optimization",
        "1 Domain Name",
        "1 Business Email",
        "1 Month Free Hosting",
        "1-3 Day Delivery",
        "Human Support (No Bots)",
      ],
      paymentType: "One-time investment",
      isFeatured: false,
      serviceKeys: ["custom-design"],
      displayOrder: 0,
    },
    {
      title: "E-commerce & Engagement",
      description:
        "Our most chosen tier. Built to sell, scale, and automate revenue.",
      imageUrl: "/images/ecommerce.jpg",
      price: "$50,000",
      features: [
        "Custom Website Design",
        "SEO Optimization",
        "Sales-Optimized Store",
        "1 Domain Name",
        "3 Months Free Hosting",
        "3-7 Day Delivery",
        "Priority Support",
      ],
      paymentType: "One-time investment",
      isFeatured: true,
      serviceKeys: ["ecommerce"],
      displayOrder: 1,
    },
    {
      title: "Legacy Impact",
      description:
        "For brands that refuse to blend in. Strategy-first. Animation-rich. Category-defining.",
      imageUrl: "/images/legacyimpact.jpg",
      price: "$80,000",
      features: [
        "Advanced Custom Website Design",
        "Conversion Strategy",
        "Unlimited Domains",
        "Unlimited Emails",
        "Advanced Animations",
        "Brand Strategy Session",
        "Priority VIP Support",
      ],
      paymentType: "One-time investment",
      isFeatured: false,
      serviceKeys: ["custom-design", "ecommerce"],
      displayOrder: 2,
    },
    {
      title: "Website Maintenance",
      description:
        "Keep your site fresh, fast, and secure with our ongoing maintenance plan.",
      imageUrl: "/images/maintenancepkg.jpg",
      price: "$15,000",
      features: [
        "Monthly Content Updates",
        "SEO Audits & Optimization",
        "Performance Monitoring",
        "Security Updates",
        "Regular Backups",
        "Uptime Monitoring",
        "Priority Support",
      ],
      paymentType: "Monthly subscription",
      isFeatured: false,
      serviceKeys: ["maintenance"],
      displayOrder: 3,
    },
    {
      title: "Website Redesign",
      description:
        "Give your existing site a powerful facelift with our redesign package. Perfect for businesses looking to refresh their online presence without starting from scratch.",
      imageUrl: "/images/redesignpkg.jpeg",
      price: "$50,000",
      features: [
        "Conversion Strategy",
        "Custom Redesign",
        "SEO Optimization",
        "Performance Optimization",
        "Brand Strategy Session",
        "Priority VIP Support",
      ],
      paymentType: "One-time investment",
      isFeatured: false,
      serviceKeys: ["remodeling"],
      displayOrder: 4,
    },
    {
      title: "Quick Start Website",
      description:
        "A fast-track option for startups and small businesses that need a sleek, conversion-ready site without the wait.",
      imageUrl: "/images/quickstartwebsites.jpg",
      price: "$20,000",
      features: [
        "Conversion Strategy",
        "Custom Design Template",
        "SEO Optimization",
        "Performance Optimization",
        "Brand Strategy Session",
        "Priority VIP Support",
      ],
      paymentType: "One-time investment",
      isFeatured: false,
      serviceKeys: [],
      displayOrder: 5,
    },
  ]);

  await db.insert(siteSettings).values([
    { key: "contact_email", value: "support@eccentricdigital.com" },
    { key: "contact_phone_display", value: "+1 (876) 844-9466" },
    { key: "contact_phone_raw", value: "+18768449466" },
  ]);

  await db.insert(socialLinks).values([
    { platform: "instagram", url: "https://instagram.com", displayOrder: 0 },
    { platform: "twitter", url: "https://twitter.com", displayOrder: 1 },
    { platform: "linkedin", url: "https://linkedin.com", displayOrder: 2 },
  ]);

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
