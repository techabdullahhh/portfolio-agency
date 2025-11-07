import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceFormContainer } from "@/components/admin/services/ServiceFormContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="pl-0">
        <Link href="/admin/services">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create Service</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceFormContainer />
        </CardContent>
      </Card>
    </div>
  );
}

