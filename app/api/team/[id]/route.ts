import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { teamMemberSchema } from "@/lib/validators/team";
import { logError } from "@/lib/logger";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const member = await prisma.teamMember.findUnique({ where: { id } });
    if (!member) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(member);
  } catch (error) {
    logError("Failed to fetch team member", error);
    return NextResponse.json({ message: "Unable to fetch team member" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const data = await request.json();
    const validated = teamMemberSchema.parse(data);
    const member = await prisma.teamMember.update({ where: { id: (await context.params).id }, data: validated });
    return NextResponse.json(member);
  } catch (error) {
    logError("Failed to update team member", error);
    if ((error as { name?: string }).name === "ZodError") {
      return NextResponse.json({ message: "Invalid team member payload" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to update team member" }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError("Failed to delete team member", error);
    return NextResponse.json({ message: "Unable to delete team member" }, { status: 500 });
  }
}

