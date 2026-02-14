"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HERO } from "@/lib/constants";

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO.rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-foreground pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/50" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold tracking-widest text-blue-300 uppercase backdrop-blur-sm">
            {HERO.badge}
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {HERO.title}
            <br />
            <span className="relative inline-block h-[1.15em] overflow-hidden text-blue-400">
              <span
                key={currentIndex}
                className="animate-word-rotate inline-block"
              >
                {HERO.rotatingWords[currentIndex]}
              </span>
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-300 lg:text-xl">
            {HERO.description}
          </p>

          {/* Bullet points */}
          <ul className="mx-auto mt-8 max-w-lg space-y-3 text-left">
            {HERO.bullets.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 shrink-0 text-blue-400"
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
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/kontakty"
              className="w-full rounded-lg bg-primary px-8 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-blue-500 hover:shadow-xl sm:w-auto"
            >
              {HERO.ctaPrimary}
            </Link>
            <Link
              href="/kontakty"
              className="w-full rounded-lg border border-white/20 bg-white/10 px-8 py-3.5 text-center text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto"
            >
              {HERO.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
