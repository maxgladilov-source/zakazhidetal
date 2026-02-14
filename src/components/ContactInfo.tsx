import { CONTACT_INFO } from "@/lib/constants";

export default function ContactInfo() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            {CONTACT_INFO.sectionLabel}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {CONTACT_INFO.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {CONTACT_INFO.description}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl gap-6">
          {CONTACT_INFO.items.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <h3 className="text-sm font-semibold text-foreground">
                {item.title}
              </h3>
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="mt-1 block text-lg font-medium text-primary transition-colors hover:text-primary-dark"
              >
                {item.value}
              </a>
            </div>
          ))}
        </div>

        {/* Placeholder for future contact form */}
        <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-border bg-surface p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-muted/40"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
          <p className="mt-4 text-sm text-muted">
            Форма обратной связи будет добавлена в ближайшее время. Пока вы можете связаться с нами по электронной почте.
          </p>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Написать на {CONTACT_INFO.email}
          </a>
        </div>
      </div>
    </section>
  );
}
