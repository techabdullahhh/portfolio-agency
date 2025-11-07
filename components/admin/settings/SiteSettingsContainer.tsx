"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SiteSettings } from "@prisma/client";
import { SiteSettingsForm } from "@/components/forms/SiteSettingsForm";
import { SiteSettingsInput } from "@/lib/validators/settings";

type SiteSettingsContainerProps = {
  settings: SiteSettings | null;
};

export function SiteSettingsContainer({ settings }: SiteSettingsContainerProps) {
  const router = useRouter();

  const handleSubmit = async (values: SiteSettingsInput) => {
    const promise = fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).then((response) => {
      if (!response.ok) throw new Error("Failed to update settings");
      router.refresh();
    });

    await toast.promise(promise, {
      loading: "Updating settings...",
      success: "Settings updated",
      error: "Failed to update settings",
    });
  };

  return (
    <SiteSettingsForm
      defaultValues={
        settings
          ? {
              siteTitle: settings.siteTitle,
              tagline: settings.tagline ?? undefined,
              contactEmail: settings.contactEmail ?? undefined,
              socialLinks: (settings.socialLinks as Record<string, string | undefined>) ?? {},
              logoUrl: settings.logoUrl ?? undefined,
              faviconUrl: settings.faviconUrl ?? undefined,
              footerText: settings.footerText ?? undefined,
              theme: settings.theme as "light" | "dark" | "system",
            }
          : undefined
      }
      onSubmit={handleSubmit}
    />
  );
}

