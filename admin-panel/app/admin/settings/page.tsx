import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteSettingsContainer } from "@/components/admin/settings/SiteSettingsContainer";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Site Settings</h1>
        <p className="text-sm text-muted-foreground">Control branding, contact details, and global configuration.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Update brand identity, social links, and metadata.</CardDescription>
        </CardHeader>
        <CardContent>
          <SiteSettingsContainer settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}

