import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validators/testimonial";
import { logError } from "@/lib/logger";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(testimonial);
  } catch (error) {
    logError("Failed to fetch testimonial", error);
    return NextResponse.json({ message: "Unable to fetch testimonial" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const data = await request.json();
    const validated = testimonialSchema.parse(data);
    const testimonial = await prisma.testimonial.update({ where: { id: (await context.params).id }, data: validated });
    return NextResponse.json(testimonial);
  } catch (error) {
    logError("Failed to update testimonial", error);
    if ((error as { name?: string }).name === "ZodError") {
      return NextResponse.json({ message: "Invalid testimonial payload" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError("Failed to delete testimonial", error);
    return NextResponse.json({ message: "Unable to delete testimonial" }, { status: 500 });
  }
}

