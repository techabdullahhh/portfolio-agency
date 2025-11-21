import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Use DIRECT_DATABASE_URL for seeding to avoid connection pool issues
const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL or DIRECT_DATABASE_URL environment variable is required");
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    console.warn("Skipping admin seed: ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD missing");
    return;
  }

  try {
    console.log(`Starting seed for admin: ${email}`);
    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await prisma.adminUser.upsert({
      where: { email: email.toLowerCase() },
      update: { passwordHash, name: "Administrator" },
      create: {
        email: email.toLowerCase(),
        passwordHash,
        name: "Administrator",
        role: "admin",
      },
    });

    console.log(`✅ Admin user seeded successfully: ${admin.email}`);

    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        socialLinks: { twitter: "", linkedin: "", github: "" },
      },
    });

    console.log("✅ Site settings initialized");
  } catch (error) {
    console.error("❌ Seed error:", error);
    // Don't fail the build if seed fails (might already exist)
    if (process.env.NODE_ENV !== "production") {
      throw error;
    }
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    // Exit with 0 in production to not fail the build
    process.exit(process.env.NODE_ENV === "production" ? 0 : 1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

