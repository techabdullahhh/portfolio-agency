import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validators/message";
import { logError } from "@/lib/logger";

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(messages);
  } catch (error) {
    logError("Failed to fetch messages", error);
    return NextResponse.json({ message: "Unable to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = contactMessageSchema.parse(data);
    const message = await prisma.contactMessage.create({ data: validated });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    logError("Failed to create contact message", error);
    if ((error as { name?: string }).name === "ZodError") {
      return NextResponse.json({ message: "Invalid message payload" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to create contact message" }, { status: 500 });
  }
}

