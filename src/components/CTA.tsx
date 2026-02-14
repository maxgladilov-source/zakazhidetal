import Link from "next/link";
import { CTA_SECTION, SITE } from "@/lib/constants";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-foreground py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground via-foreground/80 to-foreground/60" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {CTA_SECTION.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-300">
            {CTA_SECTION.description}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/kontakty"
              className="w-full rounded-lg bg-primary px-8 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-blue-500 hover:shadow-xl sm:w-auto"
            >
              {CTA_SECTION.ctaPrimary}
            </Link>
            <a
              href={`mailto:${SITE.email}`}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-8 py-3.5 text-center text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto"
            >
              {CTA_SECTION.ctaSecondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
