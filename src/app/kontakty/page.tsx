import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactInfo from "@/components/ContactInfo";

export const metadata: Metadata = {
  title: "Контакты — ЗакажиДеталь",
  description:
    "Свяжитесь с ЗакажиДеталь — мы ответим на ваши вопросы и подготовим предложение по производству деталей.",
};

export default function KontaktyPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-foreground py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold tracking-widest text-blue-300 uppercase backdrop-blur-sm">
                Контакты
              </p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                Свяжитесь с нами
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-gray-300">
                Расскажите о вашей задаче — мы ответим в течение одного рабочего дня
                и подготовим предложение.
              </p>
            </div>
          </div>
        </section>

        <ContactInfo />
      </main>
      <Footer />
    </>
  );
}
