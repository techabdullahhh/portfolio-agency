import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BlogFormContainer } from "@/components/admin/blog/BlogFormContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BlogEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BlogEditPage({ params }: BlogEditPageProps) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="pl-0">
        <Link href="/admin/blog">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Posts
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogFormContainer post={post} />
        </CardContent>
      </Card>
    </div>
  );
}

