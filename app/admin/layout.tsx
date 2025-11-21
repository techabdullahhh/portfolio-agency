import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { getAuthSession } from "@/lib/session";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background/80">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-1/4 h-72 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-72 rounded-full bg-gradient-to-br from-accent/15 via-secondary/20 to-transparent blur-[120px]" />
        <Header />
        <main className="relative flex-1 overflow-y-auto px-4 pb-10 pt-2 lg:px-10">
          <div className="space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

