import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Security: Allow seeding if no admin exists OR if SECRET_KEY matches
const SECRET_KEY = process.env.SEED_SECRET_KEY || "seed-admin-2024";

export async function POST(request: Request) {
  try {
    const { secret, email, password } = await request.json();

    // Allow seeding if:
    // 1. Secret key matches, OR
    // 2. No admin users exist (first-time setup)
    const existingAdmin = await prisma.adminUser.findFirst();
    const isFirstTime = !existingAdmin;
    
    if (secret !== SECRET_KEY && !isFirstTime) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

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

