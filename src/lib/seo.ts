export const siteConfig = {
  name: "Analysts Network State",
  shortName: "ANS",
  description:
    "Institutional-grade research on global markets, macro policy, and capital allocation — written by analysts, for analysts.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://analystsnetworkstate.com",
  twitter: "@analystsnetwork",
  socials: [
    "https://twitter.com/analystsnetwork",
    "https://www.linkedin.com/company/analysts-network-state",
  ],
} as const;

export const navConfig = {
  main: [
    { label: "Insights", href: "/insights" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ],
  footer: [
    {
      heading: "Research",
      links: [
        { label: "Insights", href: "/insights" },
        { label: "Methodology", href: "/about#methodology" },
      ],
    },
    {
      heading: "Membership",
      links: [
        { label: "Pricing", href: "/pricing" },
        { label: "Sign in", href: "/login" },
        { label: "Create account", href: "/signup" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/about#contact" },
      ],
    },
  ],
} as const;

export function absoluteUrl(path: string): string {
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${trimmed}`;
}

export function breadcrumbJsonLd(
  items: { name: string; href: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}
