import { redirect } from "next/navigation";
import { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { getAuthSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage() {
  const session = await getAuthSession();
  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Sign in to your dashboard</h1>
          <p className="text-sm text-muted-foreground">Use your admin credentials to access content management tools.</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Forgot your password? Update it in the database seed or contact the site maintainer.
        </p>
      </div>
    </main>
  );
}

