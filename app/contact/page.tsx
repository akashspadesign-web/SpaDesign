import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import ContactForm from "@/components/forms/ContactForm";
import { contact, offices } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to SPA Design Consultants. Head office in Noida, branch in Daltonganj. Phone, email, address and a contact form that reaches a studio principal directly.",
};

const MAP_SRC =
  "https://maps.google.com/maps?q=E-33%2C%20Sector-3%2C%20Noida%2C%20201301%2C%20India&t=&z=15&ie=UTF8&iwloc=&output=embed";

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pb-section pt-[calc(var(--nav-h)+5rem)]">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-accent">Get in touch</p>
            <h1 className="mx-auto mt-6 max-w-[15ch] text-display font-light leading-[0.95] tracking-tightish text-balance">
              Let&apos;s build something together
            </h1>
            <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-ink-soft text-pretty">
              Tell us about your project, your site, or your timeline. A studio
              principal reads every message and replies within one to two
              working days.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact details + map */}
      <section className="border-y border-line bg-bg-alt py-section">
        <Container>
          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Left: contact details */}
            <div className="space-y-10">
              <Detail label="Head Office">
                <address className="not-italic text-base leading-relaxed text-ink">
                  {offices.head.line1}
                  <br />
                  {offices.head.city}
                  <br />
                  {offices.head.country}
                </address>
              </Detail>
              <Detail label="Branch Office">
                <address className="not-italic text-base leading-relaxed text-ink">
                  {offices.branch.line1}
                  <br />
                  {offices.branch.city}
                  <br />
                  {offices.branch.country}
                </address>
              </Detail>
              <Detail label="Call Us">
                <ul className="space-y-1.5 text-base text-ink">
                  {contact.phones.map((p) => (
                    <li key={p}>
                      <a
                        href={`tel:+91${p}`}
                        className="link-underline"
                      >
                        +91 {formatPhone(p)}
                      </a>
                    </li>
                  ))}
                </ul>
              </Detail>
              <Detail label="Email Us">
                <ul className="space-y-1.5 text-base text-ink">
                  {contact.emails.map((e) => (
                    <li key={e}>
                      <a
                        href={`mailto:${e}`}
                        className="link-underline break-all"
                      >
                        {e}
                      </a>
                    </li>
                  ))}
                </ul>
              </Detail>
            </div>

            {/* Right: Google Map */}
            <div className="border border-line bg-bg">
              <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[480px]">
                <iframe
                  title="SPA Design Consultants, Head Office, E-33, Sector-3, Noida"
                  src={MAP_SRC}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Form */}
      <section className="py-section">
        <Container>
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <header>
              <SectionLabel>Send a Message</SectionLabel>
              <h2 className="mt-6 max-w-[14ch] text-h1 font-light leading-[1.05] tracking-tightish text-balance">
                Drop us a note
              </h2>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-ink-soft text-pretty">
                For project briefs, collaborations, press, or careers, write
                to us here and we&apos;ll route you to the right person.
              </p>
            </header>
            <div className="lg:pt-2">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
        {label}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/** Pretty-print 9811402204 → "98114 02204" while keeping tel: numeric. */
function formatPhone(p: string): string {
  return p.length === 10 ? `${p.slice(0, 5)} ${p.slice(5)}` : p;
}
