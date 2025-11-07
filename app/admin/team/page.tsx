import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamTable } from "@/components/admin/team/TeamTable";

export const metadata: Metadata = {
  title: "Team",
};

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Team</h1>
          <p className="text-sm text-muted-foreground">Highlight the experts and collaborators behind your delivery.</p>
        </div>
        <Button asChild>
          <Link href="/admin/team/new">Add Team Member</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roster</CardTitle>
          <CardDescription>Manage bios, skills, and social links for your team.</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamTable members={members} />
        </CardContent>
      </Card>
    </div>
  );
}

