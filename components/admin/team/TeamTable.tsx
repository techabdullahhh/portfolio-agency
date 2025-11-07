"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type TeamMember = {
  id: string;
  name: string;
  role: string;
};

type TeamTableProps = {
  members: TeamMember[];
};

export function TeamTable({ members }: TeamTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this team member?")) return;
    const promise = fetch(`/api/team/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete team member");
        router.refresh();
      });

    await toast.promise(promise, {
      loading: "Removing member...",
      success: "Team member removed",
      error: "Failed to remove member",
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                No team members yet.
              </TableCell>
            </TableRow>
          )}
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.name}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/team/${member.id}`}>Edit</Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id)}>
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

