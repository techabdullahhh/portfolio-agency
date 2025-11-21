import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TestimonialsTable } from "@/components/admin/testimonials/TestimonialsTable";

export const metadata: Metadata = {
  title: "Testimonials",
};

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Testimonials</h1>
          <p className="text-sm text-muted-foreground">Publish client feedback and social proof for prospects.</p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new">New Testimonial</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Stories</CardTitle>
          <CardDescription>Capture quotes, ratings, and headshots from your happiest customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <TestimonialsTable testimonials={testimonials} />
        </CardContent>
      </Card>
    </div>
  );
}

