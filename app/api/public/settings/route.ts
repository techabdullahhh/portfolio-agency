import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } });
  return NextResponse.json(settings);
}

