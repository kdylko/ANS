import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  articles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/content/articles";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, breadcrumbJsonLd, siteConfig } from "@/lib/seo";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const canonical = `/insights/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical },
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    openGraph: {
      type: "article",
      url: `${siteConfig.url}${canonical}`,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
      images: [
        {
          url: article.heroImage.src,
          alt: article.heroImage.alt,
          width: 1600,
          height: 1067,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.heroImage.src],
    },
  };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function renderBody(body: string) {
  const blocks = body
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block, idx) => {
    if (block.startsWith("## ")) {
      return <h2 key={idx}>{block.slice(3)}</h2>;
    }
    if (block.startsWith("### ")) {
      return <h3 key={idx}>{block.slice(4)}</h3>;
    }
    if (block.startsWith("> ")) {
      return (
        <blockquote key={idx}>
          {block
            .split("\n")
            .map((line) => line.replace(/^> ?/, ""))
            .join(" ")}
        </blockquote>
      );
    }
    if (block.startsWith("- ")) {
      const items = block
        .split("\n")
        .filter((line) => line.startsWith("- "))
        .map((line) => line.slice(2));
      return (
        <ul key={idx}>
          {items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
          ))}
        </ul>
      );
    }
    return (
      <p key={idx} dangerouslySetInnerHTML={{ __html: renderInline(block) }} />
    );
  });
}

function renderInline(text: string): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const escaped = escape(text);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(slug, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [article.heroImage.src],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: [
      {
        "@type": "Person",
        name: article.author.name,
        jobTitle: article.author.title,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/insights/${article.slug}`),
    },
    keywords: article.tags.join(", "),
    articleSection: article.category,
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Insights", href: "/insights" },
    { name: article.title, href: `/insights/${article.slug}` },
  ]);

  return (
    <>
      <JsonLd data={articleJsonLd} id="article-jsonld" />
      <JsonLd data={breadcrumb} id="article-breadcrumb-jsonld" />

      <article>
        <header className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
            <Link
              href="/insights"
              className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
            >
              ← All insights
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {article.category}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {article.excerpt}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <span>{article.author.name}</span>
              <span className="text-stone-300">·</span>
              <span>{article.author.title}</span>
              <span className="text-stone-300">·</span>
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
              <span className="text-stone-300">·</span>
              <span>{article.readingMinutes} min read</span>
            </div>
          </div>
        </header>

        <div className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-10">
            <figure className="relative aspect-[16/9] overflow-hidden rounded-md bg-stone-100">
              <Image
                src={article.heroImage.src}
                alt={article.heroImage.alt}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                priority
                className="object-cover"
              />
            </figure>
            <figcaption className="mt-2 text-xs text-muted-foreground">
              {article.heroImage.credit}
            </figcaption>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="prose-editorial">{renderBody(article.body)}</div>

          <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Continue reading
          </p>
          <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
            Related insights
          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/insights/${item.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-stone-100">
                  <Image
                    src={item.heroImage.src}
                    alt={item.heroImage.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  {item.category}
                </p>
                <h3 className="mt-2 font-serif text-lg font-semibold leading-snug">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
