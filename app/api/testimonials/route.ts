import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validators/testimonial";
import { logError } from "@/lib/logger";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(testimonials);
  } catch (error) {
    logError("Failed to fetch testimonials", error);
    return NextResponse.json({ message: "Unable to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = testimonialSchema.parse(data);
    const testimonial = await prisma.testimonial.create({ data: validated });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    logError("Failed to create testimonial", error);
    if ((error as { name?: string }).name === "ZodError") {
      return NextResponse.json({ message: "Invalid testimonial payload" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to create testimonial" }, { status: 500 });
  }
}

