import Container from "@/components/ui/Container";
import CountUp from "@/components/ui/CountUp";
import { stats } from "@/lib/site";

export default function StatsStrip() {
  return (
    <section className="bg-ink py-section text-bg">
      <Container>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-t border-white/15 pt-6">
              <dd className="font-serif text-5xl font-light leading-none tracking-tightish sm:text-6xl lg:text-7xl">
                <CountUp to={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-4 max-w-[18ch] font-mono text-[0.72rem] uppercase leading-relaxed tracking-wide text-bg/60">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
