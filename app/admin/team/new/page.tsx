import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TeamMemberFormContainer } from "@/components/admin/team/TeamMemberFormContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="pl-0">
        <Link href="/admin/team">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add Team Member</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMemberFormContainer />
        </CardContent>
      </Card>
    </div>
  );
}

