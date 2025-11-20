import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Security: Only allow seeding in production if SECRET_KEY matches
const SECRET_KEY = process.env.SEED_SECRET_KEY || "CHANGE_THIS_SECRET";

export async function POST(request: Request) {
  try {
    const { secret, email, password } = await request.json();

    // Verify secret key
    if (secret !== SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Use DIRECT_DATABASE_URL for seeding
    const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json(
        { error: "Database connection not configured" },
        { status: 500 }
      );
    }

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

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

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: "Admin user seeded successfully",
      email: admin.email,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        error: "Failed to seed admin user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

