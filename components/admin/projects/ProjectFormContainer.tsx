"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Project } from "@prisma/client";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { ProjectInput } from "@/lib/validators/project";

type ProjectFormContainerProps = {
  project?: Project;
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

export function ProjectFormContainer({ project }: ProjectFormContainerProps) {
  const router = useRouter();

  const handleSubmit = async (values: ProjectInput) => {
    const method = project ? "PUT" : "POST";
    const url = project ? `/api/projects/${project.id}` : "/api/projects";

    const promise = fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        router.push("/admin/projects");
        router.refresh();
      });

    await toast.promise(promise, {
      loading: project ? "Updating project..." : "Creating project...",
      success: project ? "Project updated" : "Project created",
      error: "Something went wrong",
    });
  };

  return (
    <ProjectForm
      defaultValues={
        project
          ? {
              title: project.title,
              shortDescription: project.shortDescription,
              content: project.content,
              techStack: toArray(project.techStack),
              tags: toArray(project.tags),
              thumbnailUrl: project.thumbnailUrl ?? undefined,
              bannerUrl: project.bannerUrl ?? undefined,
              githubUrl: project.githubUrl ?? undefined,
              liveUrl: project.liveUrl ?? undefined,
              category: project.category,
              status: project.status,
              isFeatured: project.isFeatured,
            }
          : undefined
      }
      submitLabel={project ? "Update Project" : "Create Project"}
      onSubmit={handleSubmit}
    />
  );
}

