"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Service = {
  id: string;
  title: string;
  category: string | null;
  createdAt: string | Date;
};

type ServicesTableProps = {
  services: Service[];
};

export function ServicesTable({ services }: ServicesTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this service?")) return;

    const promise = fetch(`/api/services/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete service");
        router.refresh();
      });

    await toast.promise(promise, {
      loading: "Deleting service...",
      success: "Service deleted",
      error: "Failed to delete service",
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                No services yet.
              </TableCell>
            </TableRow>
          )}
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.title}</TableCell>
              <TableCell>{service.category ?? "—"}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/services/${service.id}`}>Edit</Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>
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

