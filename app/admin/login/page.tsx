import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="-mx-gutter -mt-10 min-h-[calc(100vh-0px)] bg-bg-alt">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-gutter py-16">
        <Link
          href="/"
          className="mb-12 inline-flex items-baseline gap-2 self-start"
        >
          <span className="font-serif text-2xl leading-none tracking-tightish text-ink">
            SPA<span className="text-accent">.</span>
          </span>
          <span className="font-mono text-[0.62rem] uppercase leading-none tracking-wide text-ink-soft">
            Admin
          </span>
        </Link>

        <h1 className="font-serif text-4xl leading-tight tracking-tightish text-ink">
          Sign in
        </h1>
        <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
          Internal access only
        </p>

        <div className="mt-10">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
