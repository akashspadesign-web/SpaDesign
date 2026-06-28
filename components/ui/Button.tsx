import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap text-small uppercase tracking-wide font-medium transition-colors duration-300 ease-editorial focus-visible:outline-2 disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-bg px-6 py-3.5 hover:bg-accent",
  outline:
    "border border-ink/30 text-ink px-6 py-3.5 hover:border-ink hover:bg-ink hover:text-bg",
  ghost: "text-ink px-1 py-1 hover:text-accent",
};

function Arrow() {
  return (
    <span
      aria-hidden
      className="transition-transform duration-300 ease-editorial group-hover:translate-x-1"
    >
      →
    </span>
  );
}

type ButtonAsLink = {
  href: string;
  variant?: Variant;
  withArrow?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function ButtonLink({
  href,
  variant = "primary",
  withArrow = false,
  children,
  className,
  ...rest
}: ButtonAsLink) {
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  if (external) {
    return (
      <a href={href} className={cn(base, variants[variant], className)}>
        {children}
        {withArrow && <Arrow />}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...rest}>
      {children}
      {withArrow && <Arrow />}
    </Link>
  );
}

type ButtonProps = {
  variant?: Variant;
  withArrow?: boolean;
  children: ReactNode;
  className?: string;
} & ComponentProps<"button">;

export function Button({
  variant = "primary",
  withArrow = false,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
      {withArrow && <Arrow />}
    </button>
  );
}
