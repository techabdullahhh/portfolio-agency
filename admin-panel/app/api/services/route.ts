import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validators/service";
import { logError } from "@/lib/logger";

export async function GET() {
  try {
    const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(services);
  } catch (error) {
    logError("Failed to fetch services", error);
    return NextResponse.json({ message: "Unable to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = serviceSchema.parse(data);
    const service = await prisma.service.create({ data: validated });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    logError("Failed to create service", error);
    if ((error as { name?: string }).name === "ZodError") {
      return NextResponse.json({ message: "Invalid service payload" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to create service" }, { status: 500 });
  }
}

