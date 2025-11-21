import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessagesTable } from "@/components/admin/messages/MessagesTable";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Contact Messages</h1>
        <p className="text-sm text-muted-foreground">Respond quickly to inbound leads and inquiries.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Mark messages as read once handled, or archive them as needed.</CardDescription>
        </CardHeader>
        <CardContent>
          <MessagesTable
            messages={messages.map((message) => ({
              ...message,
              createdAt: message.createdAt,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}

