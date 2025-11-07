import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const team = await prisma.teamMember.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(team);
}

