import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validators/blog";
import { buildSlug } from "@/lib/utils";
import { logError } from "@/lib/logger";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(posts);
  } catch (error) {
    logError("Failed to fetch posts", error);
    return NextResponse.json({ message: "Unable to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = blogPostSchema.parse(data);
    const slug = buildSlug(validated.title);
    const post = await prisma.blogPost.create({
      data: {
        ...validated,
        slug,
        tags: validated.tags,
        publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : null,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    logError("Failed to create post", error);
    if ((error as { name?: string }).name === "ZodError") {
      return NextResponse.json({ message: "Invalid post payload" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unable to create post" }, { status: 500 });
  }
}

