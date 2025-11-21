import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validators/blog";
import { buildSlug } from "@/lib/utils";
import { logError } from "@/lib/logger";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    logError("Failed to fetch post", error);
    return NextResponse.json({ message: "Unable to fetch post" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const data = await request.json();
    const validated = blogPostSchema.parse(data);
    const post = await prisma.blogPost.update({
      where: { id: (await context.params).id },
      data: {
        ...validated,
        slug: buildSlug(validated.title),
        tags: validated.tags,
        publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : null,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    logError("Failed to update post", error);
    if ((error as { name?: string }).name === "ZodError") {
      return NextResponse.json({ message: "Invalid post payload" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to update post" }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError("Failed to delete post", error);
    return NextResponse.json({ message: "Unable to delete post" }, { status: 500 });
  }
}

