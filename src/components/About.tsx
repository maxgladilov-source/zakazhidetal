import Image from "next/image";
import { ABOUT } from "@/lib/constants";

const whyIcons = [
  "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
  "M11.42 15.17l-5.1-5.1a1.5 1.5 0 010-2.12l.88-.88a1.5 1.5 0 012.12 0L12 9.75l5.66-5.66a1.5 1.5 0 012.12 0l.88.88a1.5 1.5 0 010 2.12l-8.12 8.08a1.5 1.5 0 01-2.12 0z",
  "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
  "M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z",
];

export default function About() {
  return (
    <section id="about" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">
          {ABOUT.sectionLabel}
        </p>

        <div className="mt-10 grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left column */}
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {ABOUT.vision.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {ABOUT.vision.text}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {ABOUT.mission.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {ABOUT.mission.text}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {ABOUT.experience.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {ABOUT.experience.text}
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/about-engine.jpg"
                alt="Производство деталей"
                width={600}
                height={288}
                className="h-64 w-full object-cover lg:h-72"
                quality={85}
              />
            </div>

            <div className="rounded-xl border border-border bg-surface p-8 lg:p-10">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {ABOUT.whyTitle}
              </h3>
              <ul className="mt-6 space-y-4">
                {ABOUT.whyItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={whyIcons[i]}
                      />
                    </svg>
                    <span className="text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
