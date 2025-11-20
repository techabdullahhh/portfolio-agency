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

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name: "Administrator" },
    create: {
      email,
      passwordHash,
      name: "Administrator",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      socialLinks: { twitter: "", linkedin: "", github: "" },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

