export type ArticleCategory =
  | "Macro"
  | "Equities"
  | "Commodities"
  | "Digital Assets"
  | "Private Markets"
  | "Emerging Markets";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  author: {
    name: string;
    title: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  heroImage: {
    src: string;
    alt: string;
    credit: string;
  };
  tags: string[];
  body: string;
};

export const articles: Article[] = [
  {
    slug: "fed-holds-rates-steady-markets-brace-for-pivot",
    title:
      "Fed Holds Rates Steady as Markets Brace for the September Pivot",
    excerpt:
      "Powell signaled that the bar for cutting is lower than the bar for hiking. We map the curve, the dot plot, and what a 25 bp cut implies for risk assets.",
    category: "Macro",
    author: {
      name: "Henry Caldwell, CFA",
      title: "Chief Strategist",
    },
    publishedAt: "2026-05-12",
    readingMinutes: 7,
    heroImage: {
      src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&auto=format&fit=crop&q=80",
      alt: "Financial charts on a trading floor monitor",
      credit: "Photo: Unsplash",
    },
    tags: ["FOMC", "Rates", "Yield Curve", "Powell"],
    body: `
The June FOMC delivered no surprises on the policy rate, but the press conference was anything but uneventful. Chair Powell sharpened the asymmetry he first introduced in March: the bar for resuming hikes is meaningfully higher than the bar for the first cut. That sentence alone moved two-year yields ten basis points lower into the close.

## What the dot plot actually said

The median dot now projects two 25 bp cuts before year-end, down from three in the March SEP. Importantly, the dispersion narrowed. Of nineteen participants, fifteen now cluster within a 50 bp band — a level of consensus we have not seen since 2022.

That matters because the market has spent the past nine months trading on the *tails* of the distribution rather than the median. With the tails compressing, term premia have room to drift lower even before the first cut is delivered.

## The curve is doing the Fed's work

Real rates across the belly of the curve have already fallen 40 bp from the April peak. Financial conditions, measured by the Bloomberg index, are looser today than they were in November 2023 — a fact the Committee acknowledged in the statement.

> The Committee judges that current financial conditions remain consistent with restoring price stability over time.

In plain English: the Fed is comfortable letting the market price in cuts, because the market is doing the easing for them. This is the dovish nuance that mattered most on the day.

## What we are doing in portfolios

We are extending duration in the belly (5–7y) where roll-down economics are most attractive, while keeping a small short in the long end as a hedge against a fiscal-driven steepener. In equities, we continue to favor quality compounders over deep cyclicals; the cuts will be insurance cuts, not recession cuts, and the multiple expansion has largely been pulled forward.

The next test is the August non-farm payrolls print. A sub-100k headline would force the Committee's hand into September; anything above 150k pushes the first cut into Q4 and likely costs the S&P 500 two to three percent before it finds support.
    `.trim(),
  },
  {
    slug: "ai-capex-boom-hype-or-productivity-era",
    title: "AI's $1 Trillion Capex Boom: Hype or a New Productivity Era?",
    excerpt:
      "Hyperscaler spending now rivals the dot-com infrastructure build. We compare the unit economics, the depreciation cycle, and the return-on-invested-capital math.",
    category: "Equities",
    author: {
      name: "Sofia Reinhardt",
      title: "Senior Analyst, Technology",
    },
    publishedAt: "2026-05-08",
    readingMinutes: 9,
    heroImage: {
      src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&auto=format&fit=crop&q=80",
      alt: "Abstract visualization of artificial intelligence",
      credit: "Photo: Unsplash",
    },
    tags: ["AI", "Capex", "Hyperscalers", "Semiconductors"],
    body: `
Combined 2026 capital expenditures across the four US hyperscalers will cross $310 billion. Add the Chinese majors and the sovereign builds in the Gulf and India, and global AI infrastructure spend trips through one trillion dollars before the decade is half over. The bull case calls this the foundation of the next productivity wave. The bear case calls it the largest mis-allocation of capital since the railways. Neither, in our view, is quite right.

## The depreciation problem nobody is pricing

GPU useful life is the single most consequential accounting assumption in the entire complex. The hyperscalers currently depreciate Nvidia H100s over six years. The hardware refresh cycle, however, is closer to eighteen months once you include the Blackwell, then Rubin, then Vera generations already announced.

If real economic life is closer to four years, return on invested capital across the cluster falls by roughly 350 basis points. That does not break the thesis, but it does compress the gap between hyperscaler ROIC and their cost of capital from a comfortable 600 bp to something closer to 250 bp.

## Inference is where the money actually is

Training gets the headlines. Inference is the cash machine. Our work suggests that for every dollar spent on training a frontier model, the lifetime inference revenue runs between $4 and $12, depending on the application. The unit economics improve roughly 35% per year as token throughput climbs and model distillation reduces compute per query.

That is the bullish anchor: the productivity gains *are* showing up in the inference cohort, even as the training cohort still looks speculative.

## What we own, what we avoid

We continue to own the **picks and shovels** — the merchant-silicon designer, the leading foundry, the optical interconnect specialist, and the two power-equipment compounders that benefit from data-center electrification. We are underweight the application-layer software names that have re-rated above 18x forward sales without clear evidence of revenue acceleration.

The risk is not that AI fails to deliver productivity. The risk is that productivity gains accrue to *users* rather than *vendors*. History suggests that is exactly what happens once any infrastructure stack commoditizes — and we are perhaps two years away from that point in compute.
    `.trim(),
  },
  {
    slug: "private-credit-eating-wall-street",
    title: "Why Private Credit Is Eating Wall Street",
    excerpt:
      "Direct lending has grown from $400bn to over $2.3 trillion in less than a decade. We unpack the spread compression, the covenant erosion, and the next default cycle.",
    category: "Private Markets",
    author: {
      name: "Marcus Ashworth",
      title: "Head of Credit Research",
    },
    publishedAt: "2026-05-04",
    readingMinutes: 8,
    heroImage: {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80",
      alt: "Skyscrapers in a financial district at dusk",
      credit: "Photo: Unsplash",
    },
    tags: ["Private Credit", "Direct Lending", "BDCs", "Default Cycle"],
    body: `
A decade ago, private credit was a niche asset class with roughly $400 billion in assets. Today it sits at $2.3 trillion and is, by some measures, larger than the entire US high yield bond market. The growth has been justified by attractive headline yields and the regulatory pullback from bank balance sheets. Both forces are real. Neither, however, explains why the asset class has continued to grow at a 28% CAGR even as base rates fell.

## The spread story has changed

When direct lending generated SOFR + 700 in 2022, the all-in yield was eye-watering and the relative-value case versus syndicated loans was clear. Today the spread has compressed to SOFR + 475 to + 525 for sponsored deals, and unitranche structures regularly clear inside of broadly syndicated equivalents — a remarkable inversion that suggests the marginal LP is no longer pricing illiquidity or covenant risk appropriately.

## Covenant erosion is the real story

The most important development of the past 24 months has not been the spread. It has been the structure. EBITDA add-back generosity is now within touching distance of the 2007 vintage. Maintenance covenants — the historical edge of private credit over public — have been weakened in over 60% of 2025 sponsor-backed transactions we reviewed.

When the next default cycle arrives, recoveries will be the differentiating factor. Our base case calls for senior-secured recoveries between 55 and 65 cents on the dollar — comfortably below the 70+ that the industry has marketed for the past decade.

## Where the opportunities still exist

We are constructive on **non-sponsor direct lending**, where pricing power remains intact and relationship banking still earns a premium. We are also constructive on the senior tranches of CLOs backed by older vintages, where the structural protections were materially better than the 2024–2026 cohort.

We are negative on the rapidly growing retail BDC channel. Daily NAV reporting on illiquid assets has worked well in good times. It will become its own crisis vector when the cycle turns.
    `.trim(),
  },
  {
    slug: "oil-curve-above-90-what-it-means",
    title: "Oil's Quiet Climb Above $90: What the Curve Is Telling Us",
    excerpt:
      "Brent has held above $90 for six consecutive sessions while spec positioning remains light. The structure is the signal — and it is telling us something different.",
    category: "Commodities",
    author: {
      name: "Daniel Okoye",
      title: "Senior Strategist, Commodities",
    },
    publishedAt: "2026-04-28",
    readingMinutes: 6,
    heroImage: {
      src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1600&auto=format&fit=crop&q=80",
      alt: "Oil refinery silhouette at sunset",
      credit: "Photo: Unsplash",
    },
    tags: ["Brent", "OPEC+", "Backwardation", "Refining"],
    body: `
The interesting move in oil is not the front month. It is the prompt timespread. Brent backwardation has steepened to $1.40 per barrel from $0.60 at the start of the month — a move that historically precedes a multi-week rally in flat price by roughly six weeks.

## Inventories tell the same story

OECD commercial inventories are now 65 million barrels below the five-year average and falling at a pace that, extrapolated, takes them to the lowest level since the 2022 SPR draws by August. Refining margins, particularly for middle distillates, have widened to levels last seen in mid-2023.

The combination of tight physical, steep backwardation, and *light* spec positioning is unusual. The market is grinding higher on real-economy demand, not on momentum flows. That is, historically, the most durable kind of rally.

## OPEC+ optionality is underpriced

The cartel has roughly 4.5 million barrels per day of spare capacity, concentrated in Saudi Arabia and the UAE. Markets are pricing this spare capacity as if it will be returned aggressively into the back half. We disagree. The fiscal break-evens for Riyadh have moved sharply higher with Vision 2030 spending, and the marginal barrel is currently *more* valuable held than sold.

## How we are positioning

We are long Brent Dec26 calls struck $105, financed by selling Dec26 puts struck $75. The skew is offering us this structure essentially for free — a function of the market's complacency about left-tail risk. We are also overweight the integrateds with the best downstream margins and underweight the US shale independents whose unit economics deteriorate sharply above $95.
    `.trim(),
  },
  {
    slug: "bitcoin-etfs-cross-50-billion-asset-class-maturing",
    title: "Bitcoin ETFs Cross $50 Billion: A New Asset Class Maturing",
    excerpt:
      "Cumulative inflows into spot Bitcoin ETFs have crossed $50 billion. We examine the holder composition, the volatility regime change, and what it means for portfolio construction.",
    category: "Digital Assets",
    author: {
      name: "Priya Venkataraman",
      title: "Senior Analyst, Digital Assets",
    },
    publishedAt: "2026-04-22",
    readingMinutes: 7,
    heroImage: {
      src: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1600&auto=format&fit=crop&q=80",
      alt: "Stacked Bitcoin coins on a dark surface",
      credit: "Photo: Unsplash",
    },
    tags: ["Bitcoin", "ETF", "Volatility", "Allocation"],
    body: `
Sixteen months after launch, cumulative net inflows into spot Bitcoin ETFs have crossed $50 billion. To put that in context, that is more capital raised in less time than any commodity ETF complex in history — gold included. The headline is impressive. The composition is more important.

## Who is actually buying

RIA channel data suggests that roughly 60% of the cumulative flow has come from independent advisors deploying client portfolios, with a median allocation of 1.8%. Wirehouse adoption — the holy grail for the asset class — has been slower. Morgan Stanley opened the door in mid-2024, with Merrill and Wells Fargo following on a research-only basis. Full advisory permission across all major wirehouses is, in our view, an 18-month process from here.

The takeaway: the asset class is being *institutionalized*, but the institutionalization is happening at the periphery first. This is exactly the pattern that gold followed in the early 2000s.

## The volatility regime is changing

Realized 90-day volatility on bitcoin has compressed to 38%, the lowest since 2019. The structural reason is the changing holder composition: ETFs do not panic-sell into the weekend, and the cohort of long-term holders has grown to roughly 75% of supply by the on-chain definition.

The implication for portfolio construction is meaningful. A 2% bitcoin allocation in a 60/40 portfolio added 41 basis points of annualized return over the past three years, with a 9 basis point increase in portfolio volatility. The Sharpe contribution is now positive — something that was not true as recently as 2022.

## Where the asset class still has to mature

The derivatives complex around the ETFs is still nascent. Listed options on the major ETFs went live in late 2024, but the open interest is roughly one-tenth of what one would expect for a $50 billion AUM complex. As the options market deepens, implied volatility will compress further, structured products will proliferate, and the asset class will move closer to the trading patterns of equity indices than of speculative tech stocks.

We continue to recommend a 1–3% strategic allocation for risk-tolerant portfolios, rebalanced quarterly. We are *not* recommending overweighting on tactical signals — the asset class has not yet earned the right to be treated as a tactical position.
    `.trim(),
  },
  {
    slug: "emerging-markets-inflows-dollar-strength",
    title: "Emerging Markets See Inflows as Dollar Strength Wanes",
    excerpt:
      "A weaker dollar, peaking US real yields, and a stable Chinese economy have combined to drive the first sustained EM equity inflows since 2021. We screen the survivors.",
    category: "Emerging Markets",
    author: {
      name: "Anika Sharma",
      title: "Senior Strategist, EM",
    },
    publishedAt: "2026-04-18",
    readingMinutes: 6,
    heroImage: {
      src: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1600&auto=format&fit=crop&q=80",
      alt: "Trading data on a wall display",
      credit: "Photo: Unsplash",
    },
    tags: ["Emerging Markets", "Dollar", "India", "Latam"],
    body: `
For the first time since 2021, emerging market equity funds have seen four consecutive weeks of net inflows. The drivers are textbook: the dollar has weakened by 5% from its January peak, US ten-year real yields have rolled over, and Chinese growth, while uninspiring, has stabilized at levels that no longer threaten the rest of the bloc.

## The dispersion within EM is the opportunity

Treating EM as a monolith has always been a mistake; in 2026, it is malpractice. The performance gap between the best and worst EM equity market this year is already 38 percentage points — wider than at any point in the past decade.

The pattern within the dispersion is what matters:

- **India** continues to compound at a high-teens earnings growth rate, but valuations of 22x forward earnings demand it.
- **Latin America** offers single-digit multiples and improving fiscal discipline in Brazil and Mexico, but currency volatility remains a tax on returns.
- **ASEAN** is the underappreciated story — Indonesia, the Philippines, and Vietnam all benefit from the China-plus-one supply chain rebalancing.
- **CEE** is the cyclical exposure that works if European growth surprises to the upside.

## What we own

We have rotated out of broad EM index exposure into a more concentrated structure: overweight ASEAN, market weight India, overweight Mexico, underweight South Africa. We have also added a small position in long-end Brazilian local currency debt, where real yields above 6% remain attractive on a risk-adjusted basis even after accounting for fiscal uncertainty.

The biggest risk to the thesis is a return of dollar strength driven by a renewed US growth surprise. We hedge that risk by maintaining a tactical long in DXY against a basket of low-yielders, which behaves as portfolio insurance without giving up the carry on the underlying EM positions.
    `.trim(),
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticleBySlug(slug);
  if (!current) return articles.slice(0, limit);

  return articles
    .filter((article) => article.slug !== slug)
    .sort((a, b) => {
      const aMatch = a.category === current.category ? 1 : 0;
      const bMatch = b.category === current.category ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, limit);
}
