"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeamMemberInput, teamMemberSchema } from "@/lib/validators/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { parseCsvToArray, arrayToCsv } from "@/lib/utils";

type TeamMemberFormProps = {
  defaultValues?: Partial<TeamMemberInput>;
  onSubmit: (data: TeamMemberInput) => Promise<void> | void;
  submitLabel?: string;
};

type TeamMemberFormValues = z.input<typeof teamMemberSchema>;

export function TeamMemberForm({ defaultValues, onSubmit, submitLabel = "Save Team Member" }: TeamMemberFormProps) {
  const form = useForm<TeamMemberFormValues, undefined, TeamMemberInput>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      role: defaultValues?.role ?? "",
      bio: defaultValues?.bio ?? "",
      skills: defaultValues?.skills ?? [],
      avatarUrl: defaultValues?.avatarUrl ?? "",
      linkedinUrl: defaultValues?.linkedinUrl ?? "",
      githubUrl: defaultValues?.githubUrl ?? "",
    } satisfies TeamMemberFormValues,
  });

  const { register, handleSubmit, setValue, watch, formState } = form;
  const { errors, isSubmitting } = formState;
  const [skillsText, setSkillsText] = useState(arrayToCsv(defaultValues?.skills ?? []));

  useEffect(() => {
    setValue("skills", parseCsvToArray(skillsText), { shouldValidate: true });
  }, [skillsText, setValue]);

  const watchedAvatar = watch("avatarUrl");

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Ethan Wilson" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" placeholder="Lead Engineer" {...register("role")} />
          {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" rows={4} placeholder="Short bio highlighting expertise." {...register("bio")} />
        {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="skills">Skills</Label>
          <Input id="skills" placeholder="Next.js, Product Strategy" value={skillsText} onChange={(event) => setSkillsText(event.target.value)} />
          <p className="text-xs text-muted-foreground">Comma-separated list.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input id="linkedinUrl" placeholder="https://linkedin.com/in/" {...register("linkedinUrl")} />
          {errors.linkedinUrl && <p className="text-xs text-destructive">{errors.linkedinUrl.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input id="githubUrl" placeholder="https://github.com/" {...register("githubUrl")} />
          {errors.githubUrl && <p className="text-xs text-destructive">{errors.githubUrl.message}</p>}
        </div>
      </div>

      <ImageUploader
        label="Profile Photo"
        description="Square images work best."
        value={watchedAvatar ?? undefined}
        onUploaded={(url) => setValue("avatarUrl", url, { shouldValidate: true })}
      />
      {errors.avatarUrl && <p className="text-xs text-destructive">{errors.avatarUrl.message}</p>}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

