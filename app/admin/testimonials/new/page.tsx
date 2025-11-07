import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TestimonialFormContainer } from "@/components/admin/testimonials/TestimonialFormContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="pl-0">
        <Link href="/admin/testimonials">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Testimonials
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <TestimonialFormContainer />
        </CardContent>
      </Card>
    </div>
  );
}

