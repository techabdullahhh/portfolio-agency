import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { siteSettingsSchema } from "@/lib/validators/settings";
import { logError } from "@/lib/logger";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } });
    return NextResponse.json(settings);
  } catch (error) {
    logError("Failed to fetch settings", error);
    return NextResponse.json({ message: "Unable to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const validated = siteSettingsSchema.parse(data);
    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: { ...validated, socialLinks: validated.socialLinks },
      create: { id: 1, ...validated, socialLinks: validated.socialLinks },
    });
    return NextResponse.json(settings);
  } catch (error) {
    logError("Failed to update settings", error);
    if ((error as { name?: string }).name === "ZodError") {
      return NextResponse.json({ message: "Invalid settings payload" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to update settings" }, { status: 500 });
  }
}

