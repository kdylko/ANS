import Link from "next/link";
import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { PRICING } from "@/lib/billing";
import { absoluteUrl, breadcrumbJsonLd, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Membership in ${siteConfig.name} is $${PRICING.monthly.amount}/month. Daily briefings, weekly deep dives, members' chat, and live analyst calls.`,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: `Pricing · ${siteConfig.name}`,
    description: `Membership is $${PRICING.monthly.amount}/month. Cancel anytime.`,
    url: `${siteConfig.url}/pricing`,
  },
};

const featuresIncluded = [
  "Daily morning macro briefing (5-minute read)",
  "Two long-form deep dives per week",
  "Weekly live analyst call with replay & transcript",
  "Members' chat with allocators and PMs",
  "Full archive of past research",
  "Quarterly published-call ledger",
  "Priority email support",
  "Cancel anytime — no questions asked",
];

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes. Every new member gets full access to the platform for 7 days, with no credit card required. If we are not delivering, just walk away.",
  },
  {
    q: "How is this different from a free Substack?",
    a: "We employ six full-time senior analysts. We publish twice the volume of any independent research outlet we are aware of, and our work is reviewed by at least two senior analysts before it ships. We also maintain a public ledger of our calls — something most Substacks do not.",
  },
  {
    q: "Can I expense this through my employer?",
    a: "Yes. We provide an invoice on request that maps cleanly to most expense systems. Many of our members are reimbursed by their funds, family offices, or employers.",
  },
  {
    q: "Do you provide investment advice?",
    a: "No. Our research is published for informational and educational purposes only. We are not a registered investment adviser. We share what we think; you decide what to do.",
  },
  {
    q: "Will the price change?",
    a: "We honor your price as long as your subscription remains active. New members may eventually pay more, but you will not.",
  },
];

export default function PricingPage() {
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${siteConfig.name} Pro Membership`,
    description: `${siteConfig.name} membership — institutional-grade research on global markets, macro, and capital allocation.`,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: [
      {
        "@type": "Offer",
        url: absoluteUrl("/signup"),
        priceCurrency: PRICING.monthly.currency,
        price: PRICING.monthly.amount,
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: PRICING.monthly.amount,
          priceCurrency: PRICING.monthly.currency,
          billingDuration: "P1M",
          unitText: "month",
        },
      },
      {
        "@type": "Offer",
        url: absoluteUrl("/signup"),
        priceCurrency: PRICING.annual.currency,
        price: PRICING.annual.amount,
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: PRICING.annual.amount,
          priceCurrency: PRICING.annual.currency,
          billingDuration: "P1Y",
          unitText: "year",
        },
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Pricing", href: "/pricing" },
  ]);

  return (
    <>
      <JsonLd data={productJsonLd} id="pricing-product-jsonld" />
      <JsonLd data={faqJsonLd} id="pricing-faq-jsonld" />
      <JsonLd data={breadcrumb} id="pricing-breadcrumb-jsonld" />

      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Pricing
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            One plan. Built for serious capital.
          </h1>
          <p className="mt-4 text-lg text-muted">
            ${PRICING.monthly.amount} per month. Less than the time you would
            otherwise spend reading the wrong research.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-lg border border-border bg-background p-8 shadow-sm sm:p-12">
            <div className="flex flex-col gap-1 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Pro Membership
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
                  {siteConfig.name}
                </h2>
              </div>
              <div className="text-right">
                <p className="font-serif text-5xl font-semibold tabular-nums">
                  ${PRICING.monthly.amount}
                </p>
                <p className="text-sm text-muted-foreground">
                  per month, billed monthly
                </p>
              </div>
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {featuresIncluded.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                >
                  <CheckIcon />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted">
                Annual plan available at ${PRICING.annual.amount}/year
                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                  {PRICING.annual.savingsLabel}
                </span>
              </div>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
              >
                Start 7-day free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Frequently asked questions
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight">
            Common questions
          </h2>

          <dl className="mt-10 divide-y divide-border border-y border-border">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-6">
                <dt className="font-serif text-lg font-semibold">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">
                  {faq.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0 text-accent"
      aria-hidden
    >
      <path
        d="M5 10.5L8.5 14L15 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
