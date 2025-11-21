import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesTable } from "@/components/admin/services/ServicesTable";

export const metadata: Metadata = {
  title: "Services",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-sm text-muted-foreground">Curate the offerings your agency highlights across the site.</p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">New Service</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Catalog</CardTitle>
          <CardDescription>Document capabilities, packages, and differentiators.</CardDescription>
        </CardHeader>
        <CardContent>
          <ServicesTable services={services} />
        </CardContent>
      </Card>
    </div>
  );
}

