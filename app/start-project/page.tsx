import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import StartProjectForm from "@/components/forms/StartProjectForm";
import { contact, offices } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Brief us on your project. Architecture, interiors, master planning or structural. A studio principal replies within 1 to 2 working days.",
};

export default function StartProjectPage() {
  return (
    <section className="pb-section pt-[calc(var(--nav-h)+5rem)]">
      <Container>
        <div className="grid gap-x-12 gap-y-16 lg:grid-cols-[1.1fr_0.9fr]">
          <header>
            <SectionLabel>Start a Project</SectionLabel>
            <h1 className="mt-6 max-w-[14ch] text-display font-light leading-[0.95] tracking-tightish text-balance">
              Tell us about your project
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft text-pretty">
              The more we know about the site, the brief and the timeline, the
              sharper our first response will be. No template replies. Every
              inquiry is read by a principal.
            </p>

            <dl className="mt-14 grid grid-cols-1 gap-8 border-t border-line pt-10 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft/70">
                  {offices.head.label}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-ink">
                  {offices.head.line1}
                  <br />
                  {offices.head.city}
                  <br />
                  {offices.head.country}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft/70">
                  Direct
                </dt>
                <dd className="mt-3 space-y-1.5 text-sm text-ink">
                  {contact.phones.map((p) => (
                    <a
                      key={p}
                      href={`tel:${p}`}
                      className="link-underline block"
                    >
                      +91 {p}
                    </a>
                  ))}
                  {contact.emails.map((e) => (
                    <a
                      key={e}
                      href={`mailto:${e}`}
                      className="link-underline block break-all"
                    >
                      {e}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </header>

          <div className="lg:pt-12">
            <StartProjectForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
