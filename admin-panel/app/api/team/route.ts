import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { teamMemberSchema } from "@/lib/validators/team";
import { logError } from "@/lib/logger";

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(team);
  } catch (error) {
    logError("Failed to fetch team members", error);
    return NextResponse.json({ message: "Unable to fetch team members" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = teamMemberSchema.parse(data);
    const member = await prisma.teamMember.create({ data: validated });
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    logError("Failed to create team member", error);
    if ((error as { name?: string }).name === "ZodError") {
      return NextResponse.json({ message: "Invalid team member payload" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to create team member" }, { status: 500 });
  }
}

