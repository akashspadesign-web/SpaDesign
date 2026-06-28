"use client";

import { usePathname } from "next/navigation";
import { Fragment, type ReactNode } from "react";

/**
 * Hides the public Nav/Footer on /admin/** so the admin panel feels like an
 * internal tool, not a marketing page. Public routes get the full chrome.
 */
export default function ChromeGate({
  nav,
  footer,
  children,
}: {
  nav: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <Fragment>
      {!isAdmin && nav}
      {children}
      {!isAdmin && footer}
    </Fragment>
  );
}
