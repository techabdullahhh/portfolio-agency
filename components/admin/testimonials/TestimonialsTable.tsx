"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Testimonial = {
  id: string;
  client: string;
  company: string | null;
  rating: number | null;
};

type TestimonialsTableProps = {
  testimonials: Testimonial[];
};

export function TestimonialsTable({ testimonials }: TestimonialsTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    const promise = fetch(`/api/testimonials/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete testimonial");
        router.refresh();
      });

    await toast.promise(promise, {
      loading: "Deleting testimonial...",
      success: "Testimonial deleted",
      error: "Failed to delete testimonial",
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                No testimonials yet.
              </TableCell>
            </TableRow>
          )}
          {testimonials.map((testimonial) => (
            <TableRow key={testimonial.id}>
              <TableCell className="font-medium">{testimonial.client}</TableCell>
              <TableCell>{testimonial.company ?? "—"}</TableCell>
              <TableCell>{testimonial.rating ?? "—"}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/testimonials/${testimonial.id}`}>Edit</Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(testimonial.id)}>
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

