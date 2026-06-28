import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "@/components/admin/LogoutButton";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  // Login page renders without the admin chrome.
  return (
    <div className="min-h-screen bg-bg-alt">
      {session && (
        <header className="border-b border-line bg-bg">
          <div className="mx-auto flex max-w-content items-center justify-between px-gutter py-4">
            <div className="flex items-baseline gap-6">
              <Link
                href="/admin/leads"
                className="font-serif text-xl tracking-tightish text-ink"
              >
                SPA<span className="text-accent">.</span>{" "}
                <span className="font-mono text-[0.66rem] uppercase tracking-wide text-ink-soft">
                  Admin
                </span>
              </Link>
              <nav className="hidden gap-5 md:flex">
                <Link
                  href="/admin/leads"
                  className="font-mono text-[0.72rem] uppercase tracking-wide text-ink-soft hover:text-ink"
                >
                  Leads
                </Link>
                <Link
                  href="/admin/projects"
                  className="font-mono text-[0.72rem] uppercase tracking-wide text-ink-soft hover:text-ink"
                >
                  Projects
                </Link>
                <Link
                  href="/admin/site"
                  className="font-mono text-[0.72rem] uppercase tracking-wide text-ink-soft hover:text-ink"
                >
                  Site
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden font-mono text-[0.66rem] uppercase tracking-wide text-ink-soft sm:inline">
                {session.sub}
              </span>
              <LogoutButton />
            </div>
          </div>
        </header>
      )}
      <div className="mx-auto max-w-content px-gutter py-10">{children}</div>
    </div>
  );
}
