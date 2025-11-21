import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validators/project";
import { buildSlug } from "@/lib/utils";
import { logError } from "@/lib/logger";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    logError("Failed to fetch projects", error);
    return NextResponse.json({ message: "Unable to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = projectSchema.parse(data);

    const slug = buildSlug(validated.title);

    const project = await prisma.project.create({
      data: {
        ...validated,
        slug,
        techStack: validated.techStack,
        tags: validated.tags,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    logError("Failed to create project", error);
    if ((error as { name?: string }).name === "ZodError") {
      return NextResponse.json({ message: "Invalid project payload" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to create project" }, { status: 500 });
  }
}

