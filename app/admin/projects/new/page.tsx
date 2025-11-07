import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectFormContainer } from "@/components/admin/projects/ProjectFormContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Create Project",
};

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="pl-0">
        <Link href="/admin/projects">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectFormContainer />
        </CardContent>
      </Card>
    </div>
  );
}

