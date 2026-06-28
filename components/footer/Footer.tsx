import Link from "next/link";
import Container from "@/components/ui/Container";
import { site, offices, contact, socials, navLinks } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-bg">
      <Container className="py-section">
        {/* Top: tagline + offices */}
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-wide text-bg/50">
              {site.disciplines}
            </p>
            <p className="mt-5 max-w-md font-serif text-3xl leading-tight tracking-tightish sm:text-4xl">
              {site.tagline}.
            </p>
            <Link
              href="/start-project"
              className="link-underline mt-6 inline-block font-mono text-xs uppercase tracking-wide text-accent-soft"
            >
              Start a project →
            </Link>
          </div>

          <div className="space-y-8">
            <FooterOffice
              label={offices.head.label}
              lines={[
                offices.head.line1,
                offices.head.city,
                offices.head.country,
              ]}
            />
            <FooterOffice
              label={offices.branch.label}
              lines={[
                offices.branch.line1,
                offices.branch.city,
                offices.branch.country,
              ]}
            />
          </div>

          <div className="space-y-8">
            <div>
              <p className="font-mono text-[0.7rem] uppercase tracking-wide text-bg/50">
                Phone
              </p>
              <ul className="mt-3 space-y-1.5">
                {contact.phones.map((p) => (
                  <li key={p}>
                    <a
                      href={`tel:${p}`}
                      className="link-underline text-sm text-bg/90"
                    >
                      +91 {p}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[0.7rem] uppercase tracking-wide text-bg/50">
                Email
              </p>
              <ul className="mt-3 space-y-1.5">
                {contact.emails.map((e) => (
                  <li key={e}>
                    <a
                      href={`mailto:${e}`}
                      className="link-underline break-all text-sm text-bg/90"
                    >
                      {e}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Middle: sitemap + socials */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-10 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-mono text-[0.72rem] uppercase tracking-wide text-bg/70 transition-colors hover:text-accent-soft"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex gap-5">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="font-mono text-[0.72rem] uppercase tracking-wide text-bg/70 transition-colors hover:text-accent-soft"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: legal */}
        <div className="flex flex-col gap-2 pt-8 text-bg/50 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.7rem] uppercase tracking-wide">
            © {year} {site.legalName}
          </p>
          <p className="font-mono text-[0.7rem] uppercase tracking-wide">
            Architecture · Engineering · Interiors · Since {site.foundedYear}
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterOffice({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div>
      <p className="font-mono text-[0.7rem] uppercase tracking-wide text-bg/50">
        {label}
      </p>
      <address className="mt-3 space-y-0.5 text-sm not-italic text-bg/90">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>
    </div>
  );
}
