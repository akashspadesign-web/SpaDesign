"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await fetch("/api/admin/logout", { method: "POST" });
          router.replace("/admin/login");
          router.refresh();
        } finally {
          setBusy(false);
        }
      }}
      className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft transition-colors hover:text-accent disabled:opacity-50"
    >
      {busy ? "Logging out…" : "Logout"}
    </button>
  );
}
