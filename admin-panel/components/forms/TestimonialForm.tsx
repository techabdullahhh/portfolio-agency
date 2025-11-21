"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TestimonialInput, testimonialSchema } from "@/lib/validators/testimonial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type TestimonialFormProps = {
  defaultValues?: Partial<TestimonialInput>;
  onSubmit: (data: TestimonialInput) => Promise<void> | void;
  submitLabel?: string;
};

type TestimonialFormValues = z.input<typeof testimonialSchema>;

export function TestimonialForm({ defaultValues, onSubmit, submitLabel = "Save Testimonial" }: TestimonialFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues, undefined, TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      client: defaultValues?.client ?? "",
      role: defaultValues?.role ?? "",
      company: defaultValues?.company ?? "",
      quote: defaultValues?.quote ?? "",
      rating: defaultValues?.rating ?? undefined,
      avatarUrl: defaultValues?.avatarUrl ?? "",
    } satisfies TestimonialFormValues,
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="client">Client Name</Label>
          <Input id="client" placeholder="Jane Cooper" {...register("client")} />
          {errors.client && <p className="text-xs text-destructive">{errors.client.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" placeholder="Acme Corp" {...register("company")} />
          {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" placeholder="CTO" {...register("role")} />
          {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input id="rating" type="number" min={1} max={5} step={1} {...register("rating", { valueAsNumber: true })} />
          {errors.rating && <p className="text-xs text-destructive">{errors.rating.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="quote">Testimonial</Label>
        <Textarea id="quote" rows={4} placeholder="Share the client's experience." {...register("quote")} />
        {errors.quote && <p className="text-xs text-destructive">{errors.quote.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatarUrl">Avatar URL</Label>
        <Input id="avatarUrl" placeholder="https://" {...register("avatarUrl")} />
        {errors.avatarUrl && <p className="text-xs text-destructive">{errors.avatarUrl.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

