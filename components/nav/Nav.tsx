"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { navLinks } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import Logo from "./Logo";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll when the mobile menu is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-editorial",
        scrolled || open
          ? "border-b border-line bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-nav max-w-content items-center justify-between px-gutter"
      >
        <Logo />

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              ("children" in link &&
                link.children?.some((c) => pathname.startsWith(c.href)));
            const hasChildren = "children" in link && link.children;
            return (
              <li key={link.href} className="group relative">
                <Link
                  href={link.href}
                  className={cn(
                    "link-underline py-2 font-mono text-sm uppercase tracking-wide transition-colors",
                    active ? "text-accent" : "text-ink hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
                {hasChildren && (
                  <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition-all duration-300 ease-editorial group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <ul className="min-w-[200px] border border-line bg-bg p-2 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.4)]">
                      {link.children!
                        .filter((c) => c.label && c.href)
                        .map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-ink-soft transition-colors hover:bg-bg-alt hover:text-accent"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <ButtonLink href="/start-project" variant="primary">
            Start a Project
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-50 flex h-10 w-10 items-center justify-center lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="relative block h-4 w-6">
            <span
              className={cn(
                "absolute left-0 block h-px w-6 bg-ink transition-all duration-300 ease-editorial",
                open ? "top-1/2 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1/2 block h-px w-6 bg-ink transition-all duration-300 ease-editorial",
                open ? "opacity-0" : "opacity-100",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-px w-6 bg-ink transition-all duration-300 ease-editorial",
                open ? "top-1/2 -rotate-45" : "bottom-0",
              )}
            />
          </span>
        </button>
      </nav>

      {/* Mobile overlay menu */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 top-nav z-40 origin-top bg-white transition-[opacity,transform] duration-500 ease-editorial lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <ul className="flex flex-col gap-1 px-gutter py-8">
          {navLinks.map((link) => (
            <li key={link.href} className="border-b border-line">
              <Link
                href={link.href}
                className="block py-4 font-serif text-3xl tracking-tightish text-ink"
              >
                {link.label}
              </Link>
              {"children" in link && link.children && (
                <ul className="pb-4 pl-1">
                  {link.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="block py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft"
                      >
                        — {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className="pt-6">
            <ButtonLink href="/start-project" variant="primary" className="w-full">
              Start a Project
            </ButtonLink>
          </li>
        </ul>
      </div>
    </header>
  );
}
