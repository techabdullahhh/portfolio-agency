import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateMessageSchema } from "@/lib/validators/message";
import { logError } from "@/lib/logger";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(message);
  } catch (error) {
    logError("Failed to fetch message", error);
    return NextResponse.json({ message: "Unable to fetch message" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const data = await request.json();
    const validated = updateMessageSchema.parse(data);
    const message = await prisma.contactMessage.update({ where: { id: (await context.params).id }, data: validated });
    return NextResponse.json(message);
  } catch (error) {
    logError("Failed to update message", error);
    if ((error as { name?: string }).name === "ZodError") {
      return NextResponse.json({ message: "Invalid message payload" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to update message" }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError("Failed to delete message", error);
    return NextResponse.json({ message: "Unable to delete message" }, { status: 500 });
  }
}

