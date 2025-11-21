"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServiceInput, serviceSchema } from "@/lib/validators/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type ServiceFormProps = {
  defaultValues?: Partial<ServiceInput>;
  onSubmit: (data: ServiceInput) => Promise<void> | void;
  submitLabel?: string;
};

type ServiceFormValues = z.input<typeof serviceSchema>;

export function ServiceForm({ defaultValues, onSubmit, submitLabel = "Save Service" }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues, undefined, ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      icon: defaultValues?.icon ?? "",
      category: defaultValues?.category ?? "",
    } satisfies ServiceFormValues,
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Growth Engineering" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} placeholder="Describe the service value proposition." {...register("description")} />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon URL</Label>
          <Input id="icon" placeholder="https://" {...register("icon")} />
          {errors.icon && <p className="text-xs text-destructive">{errors.icon.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" placeholder="Strategy" {...register("category")} />
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

