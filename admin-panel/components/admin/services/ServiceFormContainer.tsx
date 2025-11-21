"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Service } from "@prisma/client";
import { ServiceForm } from "@/components/forms/ServiceForm";
import { ServiceInput } from "@/lib/validators/service";

type ServiceFormContainerProps = {
  service?: Service;
};

export function ServiceFormContainer({ service }: ServiceFormContainerProps) {
  const router = useRouter();

  const handleSubmit = async (values: ServiceInput) => {
    const method = service ? "PUT" : "POST";
    const url = service ? `/api/services/${service.id}` : "/api/services";

    const promise = fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).then((response) => {
      if (!response.ok) throw new Error("Request failed");
      router.push("/admin/services");
      router.refresh();
    });

    await toast.promise(promise, {
      loading: service ? "Updating service..." : "Creating service...",
      success: service ? "Service updated" : "Service created",
      error: "Something went wrong",
    });
  };

  return (
    <ServiceForm
      defaultValues={
        service
          ? {
              title: service.title,
              description: service.description,
              icon: service.icon ?? undefined,
              category: service.category ?? undefined,
            }
          : undefined
      }
      submitLabel={service ? "Update Service" : "Create Service"}
      onSubmit={handleSubmit}
    />
  );
}

