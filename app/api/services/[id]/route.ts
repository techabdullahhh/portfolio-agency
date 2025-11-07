import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validators/service";
import { logError } from "@/lib/logger";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    logError("Failed to fetch service", error);
    return NextResponse.json({ message: "Unable to fetch service" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const data = await request.json();
    const validated = serviceSchema.parse(data);
    const service = await prisma.service.update({ where: { id: (await context.params).id }, data: validated });
    return NextResponse.json(service);
  } catch (error) {
    logError("Failed to update service", error);
    if ((error as { name?: string }).name === "ZodError") {
      return NextResponse.json({ message: "Invalid service payload" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to update service" }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError("Failed to delete service", error);
    return NextResponse.json({ message: "Unable to delete service" }, { status: 500 });
  }
}

