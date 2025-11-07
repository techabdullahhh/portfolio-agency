import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validators/project";
import { buildSlug } from "@/lib/utils";
import { logError } from "@/lib/logger";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    logError("Failed to fetch project", error);
    return NextResponse.json({ message: "Unable to fetch project" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const data = await request.json();
    const validated = projectSchema.parse(data);

    const project = await prisma.project.update({
      where: { id: (await context.params).id },
      data: {
        ...validated,
        slug: buildSlug(validated.title),
        techStack: validated.techStack,
        tags: validated.tags,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    logError("Failed to update project", error);
    if ((error as { name?: string }).name === "ZodError") {
      return NextResponse.json({ message: "Invalid project payload" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to update project" }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError("Failed to delete project", error);
    return NextResponse.json({ message: "Unable to delete project" }, { status: 500 });
  }
}

