import Image from "next/image";
import Link from "next/link";
import { SITE, FOOTER } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="ЗакажиДеталь"
                width={280}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {FOOTER.tagline}
            </p>
          </div>

          {/* Navigation sections */}
          {FOOTER.sections.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold text-foreground">
                {section.title}
              </p>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold text-foreground">Связаться</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} {FOOTER.copyright}
        </div>
      </div>
    </footer>
  );
}
