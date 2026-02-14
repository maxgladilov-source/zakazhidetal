import { GEOGRAPHY } from "@/lib/constants";

export default function Geography() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            {GEOGRAPHY.sectionLabel}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {GEOGRAPHY.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {GEOGRAPHY.description}
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {GEOGRAPHY.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-surface p-8 text-center"
            >
              <p className="text-4xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
