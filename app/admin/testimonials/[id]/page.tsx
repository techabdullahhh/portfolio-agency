import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { TestimonialFormContainer } from "@/components/admin/testimonials/TestimonialFormContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TestimonialEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TestimonialEditPage({ params }: TestimonialEditPageProps) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="pl-0">
        <Link href="/admin/testimonials">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Testimonials
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <TestimonialFormContainer testimonial={testimonial} />
        </CardContent>
      </Card>
    </div>
  );
}

