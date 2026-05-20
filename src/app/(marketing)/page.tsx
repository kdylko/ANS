import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { articles } from "@/content/articles";
import { JsonLd } from "@/components/json-ld";
import { PRICING } from "@/lib/billing";
import { absoluteUrl, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Institutional-grade market research for independent investors",
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} — Institutional-grade market research`,
    description: siteConfig.description,
    url: siteConfig.url,
  },
};

const valueProps = [
  {
    title: "Daily macro briefings",
    body: "A 5-minute morning read covering the overnight tape, the data that moved it, and what to watch into the US open.",
  },
  {
    title: "Member-only deep dives",
    body: "Two long-form research notes per week — the kind of work that used to live behind an institutional research subscription.",
  },
  {
    title: "Weekly analyst calls",
    body: "Live, off-the-record discussions with our strategists. Replays and transcripts available to all members.",
  },
  {
    title: "Members' chat",
    body: "A curated network of allocators, PMs, and operators. Half the value is the rolodex; half is the conversation.",
  },
];

const testimonials = [
  {
    quote:
      "The morning brief is the only research email I open before my Bloomberg terminal.",
    author: "PM, $1.2bn long/short fund",
  },
  {
    quote:
      "Deep dives that consistently land 3–6 months ahead of the consensus on the sell-side.",
    author: "CIO, single-family office",
  },
  {
    quote: "Calibrated, opinionated, and never wastes my time.",
    author: "Head of strategy, hedge fund seeder",
  },
];

export default function HomePage() {
  const featured = articles.slice(0, 3);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Investment research subscription",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: "Worldwide",
    offers: {
      "@type": "Offer",
      price: PRICING.monthly.amount,
      priceCurrency: PRICING.monthly.currency,
      url: absoluteUrl("/pricing"),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} id="service-jsonld" />

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Institutional research · Now public
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            Research that used to live behind a six-figure terminal.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {siteConfig.name} publishes daily briefings, weekly deep dives, and
            live analyst calls covering global markets, macro policy, and
            capital allocation — written by sell-side and buy-side veterans for
            an independent audience.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              Start membership · ${PRICING.monthly.amount}/month
            </Link>
            <Link
              href="/insights"
              className="inline-flex items-center justify-center rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-stone-100"
            >
              Read latest research
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Cancel anytime · No credit card required for a 7-day trial
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            What you get
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            One subscription. The complete research stack.
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((prop) => (
              <div key={prop.title}>
                <p className="font-serif text-lg font-semibold">
                  {prop.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {prop.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Latest research
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                Recent insights
              </h2>
            </div>
            <Link
              href="/insights"
              className="hidden text-sm font-medium text-accent underline-offset-4 hover:underline sm:inline-flex"
            >
              All insights →
            </Link>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {featured.map((article) => (
              <Link
                key={article.slug}
                href={`/insights/${article.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-stone-100">
                  <Image
                    src={article.heroImage.src}
                    alt={article.heroImage.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  {article.category}
                </p>
                <h3 className="mt-2 font-serif text-xl font-semibold leading-snug">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-[#0f1417]">
        <div className="mx-auto max-w-6xl px-6 py-20 text-stone-200">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
            From the members
          </p>
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.author}>
                <p className="font-serif text-xl leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-4 text-xs uppercase tracking-[0.15em] text-stone-500">
                  — {t.author}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Become a member.
          </h2>
          <p className="mt-4 text-muted">
            ${PRICING.monthly.amount} per month, billed monthly. Annual plan
            available at ${PRICING.annual.amount}/year ({PRICING.annual.savingsLabel}).
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
          >
            Start membership
          </Link>
        </div>
      </section>
    </>
  );
}
