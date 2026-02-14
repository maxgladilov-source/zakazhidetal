import Link from "next/link";
import { WORK_PROCESS } from "@/lib/constants";

const stepNumbers = ["01", "02", "03"];

const stepIcons = [
  <svg key="0" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>,
  <svg key="1" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
  </svg>,
  <svg key="2" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
  </svg>,
];

export default function WorkProcess() {
  return (
    <section className="relative overflow-hidden bg-foreground py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground via-foreground/80 to-foreground/60" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-blue-300 uppercase">
            {WORK_PROCESS.sectionLabel}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {WORK_PROCESS.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-300">
            {WORK_PROCESS.description}
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {WORK_PROCESS.steps.map((step, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:p-8"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-blue-300">
                  {stepIcons[i]}
                </div>
                <span className="text-3xl font-bold text-white/10">
                  {stepNumbers[i]}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Готовы начать?
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-300">
            Расскажите нам о вашей задаче — мы подготовим предложение и подберём подходящих производителей.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/kontakty"
              className="w-full rounded-lg bg-primary px-8 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-blue-500 hover:shadow-xl sm:w-auto"
            >
              Оставить заявку
            </Link>
            <a
              href="mailto:info@zakazhidetal.ru"
              className="w-full rounded-lg border border-white/20 bg-white/10 px-8 py-3.5 text-center text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto"
            >
              Написать на почту
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
