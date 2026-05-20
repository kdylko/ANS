import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description:
    "Analysts Network State is an independent research firm publishing institutional-grade work on global markets and capital allocation.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About · ${siteConfig.name}`,
    description:
      "Analysts Network State is an independent research firm publishing institutional-grade work on global markets and capital allocation.",
    url: `${siteConfig.url}/about`,
  },
};

const team = [
  {
    name: "Henry Caldwell, CFA",
    title: "Co-Founder & Chief Strategist",
    bio: "Fifteen years on the buy side, most recently as Head of Macro at a multi-strategy fund. CFA charterholder.",
  },
  {
    name: "Sofia Reinhardt",
    title: "Senior Analyst · Technology",
    bio: "Previously sell-side semiconductors at a bulge-bracket bank. Covers AI infrastructure, semis, and platform economics.",
  },
  {
    name: "Marcus Ashworth",
    title: "Head of Credit Research",
    bio: "Twelve years in distressed debt and private credit. Built and ran the credit research desk at a global asset manager.",
  },
  {
    name: "Daniel Okoye",
    title: "Senior Strategist · Commodities",
    bio: "Energy economist turned trader. Previously at a global commodity merchant covering crude, products, and natural gas.",
  },
  {
    name: "Priya Venkataraman",
    title: "Senior Analyst · Digital Assets",
    bio: "Early researcher on the institutionalization of crypto. Covers digital assets, market structure, and tokenized finance.",
  },
  {
    name: "Anika Sharma",
    title: "Senior Strategist · Emerging Markets",
    bio: "Former IMF economist with a focus on Asia-Pacific. Covers EM equities, sovereign debt, and currency dynamics.",
  },
];

export default function AboutPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} id="about-breadcrumb-jsonld" />

      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            About
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            An independent research firm for serious capital.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {siteConfig.name} was founded in 2024 by a group of buy-side and
            sell-side veterans frustrated with the state of investment research
            available to independent allocators. Our work is opinionated,
            rigorous, and intentionally narrow — we publish only what we have a
            distinctive edge in.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Our mandate
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
                Independent
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                We do not take banking, advisory, or sponsorship fees. Our only
                revenue stream is the membership subscription.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                What we publish
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
                Narrow &amp; deep
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Six analysts cover six areas of the market. We would rather be
                the best in the world at a few things than mediocre at many.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Who we serve
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
                Allocators
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Family offices, portfolio managers, and independent investors
                deploying their own capital with a multi-year horizon.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="methodology" className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Methodology
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight">
            How we work
          </h2>
          <div className="mt-8 space-y-6 text-base leading-relaxed text-muted">
            <p>
              Every published note has been reviewed by at least two senior
              analysts and is required to take an explicit position on the
              question it addresses. We do not publish &ldquo;balanced&rdquo;
              research with no view. If we are uncertain, we say so — but we
              say why.
            </p>
            <p>
              We track our published calls in a public ledger updated quarterly.
              Members can review our hit rate, our average holding period, and
              the calls we got wrong. Accountability is not optional.
            </p>
            <p>
              We do not use AI to generate finished research. We use it
              extensively for data processing, charting, and first-draft
              scaffolding. The final analysis and the views are human.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            The team
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight">
            Who is writing this
          </h2>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div key={member.name}>
                <p className="font-serif text-lg font-semibold">
                  {member.name}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {member.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Contact
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight">
            Talk to us
          </h2>
          <p className="mt-4 text-muted">
            Editorial and member inquiries:{" "}
            <a
              href="mailto:editorial@analystsnetworkstate.com"
              className="text-accent underline underline-offset-4"
            >
              editorial@analystsnetworkstate.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
