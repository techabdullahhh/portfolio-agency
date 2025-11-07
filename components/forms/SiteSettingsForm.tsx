"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiteSettingsInput, siteSettingsSchema } from "@/lib/validators/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ImageUploader } from "@/components/dashboard/ImageUploader";

type SiteSettingsFormProps = {
  defaultValues?: Partial<SiteSettingsInput>;
  onSubmit: (data: SiteSettingsInput) => Promise<void> | void;
};

type SiteSettingsFormValues = z.input<typeof siteSettingsSchema>;

export function SiteSettingsForm({ defaultValues, onSubmit }: SiteSettingsFormProps) {
  const form = useForm<SiteSettingsFormValues, undefined, SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteTitle: defaultValues?.siteTitle ?? "Portfolio Agency",
      tagline: defaultValues?.tagline ?? "",
      contactEmail: defaultValues?.contactEmail ?? "",
      socialLinks: {
        twitter: defaultValues?.socialLinks?.twitter ?? "",
        linkedin: defaultValues?.socialLinks?.linkedin ?? "",
        github: defaultValues?.socialLinks?.github ?? "",
        dribbble: defaultValues?.socialLinks?.dribbble ?? "",
        instagram: defaultValues?.socialLinks?.instagram ?? "",
      },
      logoUrl: defaultValues?.logoUrl ?? "",
      faviconUrl: defaultValues?.faviconUrl ?? "",
      footerText: defaultValues?.footerText ?? "",
      theme: defaultValues?.theme ?? "light",
    } satisfies SiteSettingsFormValues,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const watchedLogo = watch("logoUrl");
  const watchedFavicon = watch("faviconUrl");

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="siteTitle">Site Title</Label>
          <Input id="siteTitle" {...register("siteTitle")} />
          {errors.siteTitle && <p className="text-xs text-destructive">{errors.siteTitle.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input id="contactEmail" type="email" placeholder="hello@agency.com" {...register("contactEmail")} />
          {errors.contactEmail && <p className="text-xs text-destructive">{errors.contactEmail.message}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Textarea id="tagline" rows={2} placeholder="Short positioning statement." {...register("tagline")} />
          {errors.tagline && <p className="text-xs text-destructive">{errors.tagline.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter</Label>
          <Input id="twitter" placeholder="https://x.com/" {...register("socialLinks.twitter")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" placeholder="https://linkedin.com/company/" {...register("socialLinks.linkedin")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input id="github" placeholder="https://github.com/" {...register("socialLinks.github")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dribbble">Dribbble</Label>
          <Input id="dribbble" placeholder="https://dribbble.com/" {...register("socialLinks.dribbble")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input id="instagram" placeholder="https://instagram.com/" {...register("socialLinks.instagram")} />
        </div>
      </div>

      <ImageUploader
        label="Logo"
        description="Appears in the site header."
        value={watchedLogo ?? undefined}
        onUploaded={(url) => setValue("logoUrl", url, { shouldValidate: true })}
      />
      {errors.logoUrl && <p className="text-xs text-destructive">{errors.logoUrl.message}</p>}

      <ImageUploader
        label="Favicon"
        description="Used as browser tab icon."
        value={watchedFavicon ?? undefined}
        onUploaded={(url) => setValue("faviconUrl", url, { shouldValidate: true })}
      />
      {errors.faviconUrl && <p className="text-xs text-destructive">{errors.faviconUrl.message}</p>}

      <div className="space-y-2">
        <Label htmlFor="footerText">Footer Text</Label>
        <Textarea id="footerText" rows={3} placeholder="© {new Date().getFullYear()} Agency." {...register("footerText")} />
        {errors.footerText && <p className="text-xs text-destructive">{errors.footerText.message}</p>}
      </div>

      <div className="space-y-2 max-w-xs">
        <Label htmlFor="theme">Theme</Label>
        <Select id="theme" {...register("theme")}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </Select>
        {errors.theme && <p className="text-xs text-destructive">{errors.theme.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}

