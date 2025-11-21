"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Testimonial } from "@prisma/client";
import { TestimonialForm } from "@/components/forms/TestimonialForm";
import { TestimonialInput } from "@/lib/validators/testimonial";

type TestimonialFormContainerProps = {
  testimonial?: Testimonial;
};

export function TestimonialFormContainer({ testimonial }: TestimonialFormContainerProps) {
  const router = useRouter();

  const handleSubmit = async (values: TestimonialInput) => {
    const method = testimonial ? "PUT" : "POST";
    const url = testimonial ? `/api/testimonials/${testimonial.id}` : "/api/testimonials";

    const promise = fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).then((response) => {
      if (!response.ok) throw new Error("Request failed");
      router.push("/admin/testimonials");
      router.refresh();
    });

    await toast.promise(promise, {
      loading: testimonial ? "Updating testimonial..." : "Creating testimonial...",
      success: testimonial ? "Testimonial updated" : "Testimonial created",
      error: "Something went wrong",
    });
  };

  return (
    <TestimonialForm
      defaultValues={
        testimonial
          ? {
              client: testimonial.client,
              company: testimonial.company ?? undefined,
              role: testimonial.role ?? undefined,
              quote: testimonial.quote,
              rating: testimonial.rating ?? undefined,
              avatarUrl: testimonial.avatarUrl ?? undefined,
            }
          : undefined
      }
      submitLabel={testimonial ? "Update Testimonial" : "Create Testimonial"}
      onSubmit={handleSubmit}
    />
  );
}

