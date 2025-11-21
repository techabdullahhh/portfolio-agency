import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { TeamMemberFormContainer } from "@/components/admin/team/TeamMemberFormContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TeamMemberEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TeamMemberEditPage({ params }: TeamMemberEditPageProps) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="pl-0">
        <Link href="/admin/team">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Team Member</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMemberFormContainer member={member} />
        </CardContent>
      </Card>
    </div>
  );
}

