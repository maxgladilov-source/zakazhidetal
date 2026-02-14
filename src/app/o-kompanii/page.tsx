import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ABOUT, ADVANTAGES, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "О компании — ЗакажиДеталь",
  description:
    "ЗакажиДеталь — российское представительство глобальной платформы Everypart. Производство деталей в Китае и ЮВА для российских заказчиков.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-foreground py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold tracking-widest text-blue-300 uppercase backdrop-blur-sm">
                {ABOUT.sectionLabel}
              </p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                О компании {SITE.name}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-gray-300">
                Российское представительство глобальной платформы Everypart.
                Помогаем российским компаниям заказывать производство деталей
                у проверенных заводов в Азии.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
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

              <div className="space-y-8">
                {/* Everypart connection */}
                <div className="rounded-xl border border-border bg-surface p-8 lg:p-10">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    Связь с Everypart
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted">
                    ЗакажиДеталь является официальным российским
                    представительством платформы Everypart — международной
                    платформы, соединяющей заказчиков с проверенными
                    производителями в Китае и Юго-Восточной Азии.
                  </p>
                  <a
                    href={SITE.epLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                  >
                    Перейти на everypart.pro
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </a>
                </div>

                {/* Why us */}
                <div className="rounded-xl border border-border bg-surface p-8 lg:p-10">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {ABOUT.whyTitle}
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {ABOUT.whyItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg
                          className="mt-1 h-5 w-5 shrink-0 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
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

        {/* Advantages */}
        <section className="bg-surface py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {ADVANTAGES.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                {ADVANTAGES.description}
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ADVANTAGES.items.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-white p-6"
                >
                  <h3 className="text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-foreground py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Готовы к сотрудничеству?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-300">
              Свяжитесь с нами — обсудим вашу задачу и подготовим предложение.
            </p>
            <div className="mt-8">
              <Link
                href="/kontakty"
                className="inline-block rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-blue-500 hover:shadow-xl"
              >
                Связаться с нами
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
