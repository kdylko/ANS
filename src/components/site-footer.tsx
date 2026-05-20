import Link from "next/link";

import { navConfig, siteConfig } from "@/lib/seo";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-[#0f1417] text-stone-300">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_3fr]">
          <div>
            <p className="font-serif text-xl font-semibold text-white">
              {siteConfig.name}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-400">
              {siteConfig.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {navConfig.footer.map((section) => (
              <div key={section.heading}>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
                  {section.heading}
                </p>
                <ul className="mt-4 space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-stone-300 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-stone-800 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-stone-600">
            Research published is for informational purposes only and does not
            constitute investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
