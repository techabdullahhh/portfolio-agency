"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
};

type MessagesTableProps = {
  messages: Message[];
};

export function MessagesTable({ messages }: MessagesTableProps) {
  const router = useRouter();

  const updateRead = async (id: string, isRead: boolean) => {
    const promise = fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    }).then((response) => {
      if (!response.ok) throw new Error("Failed to update message");
      router.refresh();
    });

    await toast.promise(promise, {
      loading: "Updating message...",
      success: isRead ? "Marked as read" : "Marked as unread",
      error: "Failed to update message",
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this message?")) return;
    const promise = fetch(`/api/messages/${id}`, { method: "DELETE" }).then((response) => {
      if (!response.ok) throw new Error("Failed to delete message");
      router.refresh();
    });

    await toast.promise(promise, {
      loading: "Deleting message...",
      success: "Message deleted",
      error: "Failed to delete message",
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Received</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                Inbox is clear.
              </TableCell>
            </TableRow>
          )}
          {messages.map((message) => (
            <TableRow key={message.id} className={!message.isRead ? "bg-primary/5" : undefined}>
              <TableCell className="font-medium">{message.name}</TableCell>
              <TableCell>{message.email}</TableCell>
              <TableCell className="max-w-sm truncate" title={message.message}>
                {message.message}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{format(new Date(message.createdAt), "MMM d, p")}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => updateRead(message.id, !message.isRead)}>
                  {message.isRead ? "Mark Unread" : "Mark Read"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(message.id)}>
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

