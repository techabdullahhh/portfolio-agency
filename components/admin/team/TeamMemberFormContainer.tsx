"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TeamMember } from "@prisma/client";
import { TeamMemberForm } from "@/components/forms/TeamMemberForm";
import { TeamMemberInput } from "@/lib/validators/team";

type TeamMemberFormContainerProps = {
  member?: TeamMember;
};

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

export function TeamMemberFormContainer({ member }: TeamMemberFormContainerProps) {
  const router = useRouter();

  const handleSubmit = async (values: TeamMemberInput) => {
    const method = member ? "PUT" : "POST";
    const url = member ? `/api/team/${member.id}` : "/api/team";

    const promise = fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).then((response) => {
      if (!response.ok) throw new Error("Request failed");
      router.push("/admin/team");
      router.refresh();
    });

    await toast.promise(promise, {
      loading: member ? "Updating team member..." : "Creating team member...",
      success: member ? "Team member updated" : "Team member created",
      error: "Something went wrong",
    });
  };

  return (
    <TeamMemberForm
      defaultValues={
        member
          ? {
              name: member.name,
              role: member.role,
              bio: member.bio,
              skills: toArray(member.skills),
              avatarUrl: member.avatarUrl ?? undefined,
              linkedinUrl: member.linkedinUrl ?? undefined,
              githubUrl: member.githubUrl ?? undefined,
            }
          : undefined
      }
      submitLabel={member ? "Update Member" : "Create Member"}
      onSubmit={handleSubmit}
    />
  );
}

