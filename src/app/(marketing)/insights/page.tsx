import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { articles } from "@/content/articles";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Daily briefings and weekly deep dives from the Analysts Network State research desk.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: `Insights · ${siteConfig.name}`,
    description:
      "Daily briefings and weekly deep dives from the Analysts Network State research desk.",
    url: `${siteConfig.url}/insights`,
  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function InsightsPage() {
  const [hero, ...rest] = articles;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Insights", href: "/insights" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} id="insights-breadcrumb-jsonld" />

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Insights
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            The research desk.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Daily briefings, weekly deep dives, and unscheduled notes when the
            tape demands it.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <Link
          href={`/insights/${hero.slug}`}
          className="group block bg-card transition-colors hover:bg-stone-100"
        >
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-2 md:items-center md:py-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-stone-100 md:order-2">
              <Image
                src={hero.heroImage.src}
                alt={hero.heroImage.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {hero.category} · Featured
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {hero.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {hero.excerpt}
              </p>
              <p className="mt-6 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {hero.author.name} · {formatDate(hero.publishedAt)} ·{" "}
                {hero.readingMinutes} min read
              </p>
            </div>
          </div>
        </Link>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
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
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
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
                <p className="mt-4 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {article.author.name} · {formatDate(article.publishedAt)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
