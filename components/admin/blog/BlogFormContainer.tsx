"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BlogPost } from "@prisma/client";
import { BlogPostForm } from "@/components/forms/BlogPostForm";
import { BlogPostInput } from "@/lib/validators/blog";

type BlogFormContainerProps = {
  post?: BlogPost;
};

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

export function BlogFormContainer({ post }: BlogFormContainerProps) {
  const router = useRouter();

  const handleSubmit = async (values: BlogPostInput) => {
    const method = post ? "PUT" : "POST";
    const url = post ? `/api/blog/${post.id}` : "/api/blog";

    const payload: BlogPostInput = {
      ...values,
      publishedAt: values.publishedAt || undefined,
    };

    const promise = fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((response) => {
      if (!response.ok) throw new Error("Request failed");
      router.push("/admin/blog");
      router.refresh();
    });

    await toast.promise(promise, {
      loading: post ? "Updating post..." : "Publishing post...",
      success: post ? "Post updated" : "Post created",
      error: "Something went wrong",
    });
  };

  return (
    <BlogPostForm
      defaultValues={
        post
          ? {
              title: post.title,
              excerpt: post.excerpt ?? undefined,
              content: post.content,
              tags: toArray(post.tags),
              featuredImage: post.featuredImage ?? undefined,
              publishedAt: post.publishedAt ? post.publishedAt.toISOString() : undefined,
              status: post.status,
              seoTitle: post.seoTitle ?? undefined,
              seoDescription: post.seoDescription ?? undefined,
            }
          : undefined
      }
      submitLabel={post ? "Update Post" : "Create Post"}
      onSubmit={handleSubmit}
    />
  );
}

