"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

type BlogPost = {
  id: string;
  title: string;
  status: string;
  publishedAt: string | Date | null;
  createdAt: string | Date;
};

type PostsTableProps = {
  posts: BlogPost[];
};

export function PostsTable({ posts }: PostsTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    const promise = fetch(`/api/blog/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete post");
        router.refresh();
      });

    await toast.promise(promise, {
      loading: "Deleting post...",
      success: "Post deleted",
      error: "Failed to delete post",
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                No posts yet.
              </TableCell>
            </TableRow>
          )}
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>
                <Badge variant={post.status === "PUBLISHED" ? "default" : post.status === "DRAFT" ? "secondary" : "muted"}>
                  {post.status}
                </Badge>
              </TableCell>
              <TableCell>
                {post.publishedAt ? format(new Date(post.publishedAt), "MMM d, yyyy") : <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/blog/${post.id}`}>Edit</Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

