import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Calendar, FolderOpen, ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { blogPosts, getBlogPostBySlug } from "@/lib/blog-data";
import { BlogDetailActions, NewsletterForm } from "./blog-detail-actions";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold">Blog not found</h2>
        <Link href="/resources/blog" className="text-primary hover:underline">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-border bg-black">
        <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:py-20">
          <div>
            <nav className="flex items-center gap-2 text-sm text-white/60" aria-label="Breadcrumb">
              <Link href="/" className="transition-colors hover:text-white">Home</Link>
              <ChevronRight className="size-3" />
              <Link href="/resources/blog" className="transition-colors hover:text-white">Blogs</Link>
              <ChevronRight className="size-3" />
              <span>{post.category}</span>
            </nav>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <p className="mt-4 text-lg text-white/70">{post.excerpt}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <FolderOpen className="size-3.5" />
                {post.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {post.readTime}
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl">
            <img
              src={post.image}
              alt={post.title}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Container>
      </section>

      {/* Author Card Top */}
      <div className="border-b border-border py-8">
        <Container>
          <div className="mx-auto flex max-w-[740px] items-center gap-5 rounded-md border border-border bg-card p-6">
            <img
              src={`https://picsum.photos/seed/${post.author.name}/200/200`}
              alt={post.author.name}
              className="size-20 rounded-md object-cover"
            />
            <div>
              <h3 className="font-bold text-card-foreground">{post.author.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {post.author.role}. Sharing insights, strategies, and ideas for founders building with clarity.
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Article Content */}
      <section className="py-12 sm:py-16">
        <Container>
          <article className="mx-auto max-w-[760px] text-card-foreground">
            {/* Intro */}
            <p className="text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>

            <p className="mt-5 leading-relaxed text-muted-foreground">
              {post.content.split("\n\n")[0]}
            </p>

            {/* Table of Contents */}
            <div className="my-8 rounded-xl border border-border bg-muted/30 p-5">
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-card-foreground">In this article</h4>
              <div className="flex flex-col gap-2">
                <a href="#section-1" className="text-sm text-primary hover:underline">Why it matters</a>
                <a href="#section-2" className="text-sm text-primary hover:underline">Conclusion</a>
              </div>
            </div>

            {/* Content paragraphs */}
            {post.content.split("\n\n").slice(1, 4).map((paragraph, i) => (
              <p key={i} className="mt-5 leading-relaxed text-muted-foreground">
                {paragraph.replace(/^## |^### /, "")}
              </p>
            ))}

            {/* Screenshot */}
            <div className="my-10">
              <div className="overflow-hidden rounded-xl border border-border">
                <img
                  src="https://picsum.photos/seed/dashboard/1200/630"
                  alt="WeCos Dashboard Screenshot"
                  className="w-full object-cover"
                />
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Fig 1. — WeCos validation dashboard showing real-time startup metrics
              </p>
            </div>

            {/* More content */}
            {post.content.split("\n\n").slice(4, 8).map((paragraph, i) => (
              <p key={i} className="mt-5 leading-relaxed text-muted-foreground">
                {paragraph.replace(/^## |^### |^- /, "")}
              </p>
            ))}

            {/* Blockquote */}
            <blockquote className="my-10 border-l-4 border-primary py-2 pl-6 text-lg italic text-muted-foreground">
              &ldquo;A good product does not rush you. It gives you space to think, pause, and grow.&rdquo;
            </blockquote>

            {/* More content */}
            {post.content.split("\n\n").slice(8, 12).map((paragraph, i) => (
              <p key={i} className="mt-5 leading-relaxed text-muted-foreground">
                {paragraph.replace(/^## |^### |^- /, "")}
              </p>
            ))}

            {/* Code Snippet */}
            <div className="my-10">
              <h3 className="mb-3 text-lg font-bold text-card-foreground">Quick Start</h3>
              <div className="overflow-x-auto rounded-xl border border-border bg-[#0d1117] p-5">
                <pre className="text-sm leading-relaxed text-gray-300">
                  <code>{`# Install the CLI
npm install -g @wecos/cli

# Initialize your project
wecos init --name "my-startup"

# Run validation
wecos validate --idea "AI-powered task manager"

# Output:
# [PASS] Problem clarity: 8/10
# [PASS] Market size: 7/10
# [WARN]  Unfair advantage: 5/10
# [SCORE] Overall Score: 6.7/10`}</code>
                </pre>
              </div>
            </div>

            {/* More content */}
            {post.content.split("\n\n").slice(12).map((paragraph, i) => (
              <p key={i} className="mt-5 leading-relaxed text-muted-foreground">
                {paragraph.replace(/^## |^### |^- /, "")}
              </p>
            ))}

            {/* Table */}
            <div className="my-10 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border">
                    <th className="bg-muted/50 px-4 py-3 text-left font-semibold text-card-foreground">Resource</th>
                    <td className="px-4 py-3 text-muted-foreground">Startup Growth Blueprint</td>
                  </tr>
                  <tr className="border-b border-border">
                    <th className="bg-muted/50 px-4 py-3 text-left font-semibold text-card-foreground">Category</th>
                    <td className="px-4 py-3 text-muted-foreground">Startup Growth</td>
                  </tr>
                  <tr className="border-b border-border">
                    <th className="bg-muted/50 px-4 py-3 text-left font-semibold text-card-foreground">Format</th>
                    <td className="px-4 py-3 text-muted-foreground">PDF Guide</td>
                  </tr>
                  <tr className="border-b border-border">
                    <th className="bg-muted/50 px-4 py-3 text-left font-semibold text-card-foreground">Pages</th>
                    <td className="px-4 py-3 text-muted-foreground">42 Pages</td>
                  </tr>
                  <tr className="border-b border-border">
                    <th className="bg-muted/50 px-4 py-3 text-left font-semibold text-card-foreground">Access</th>
                    <td className="px-4 py-3 text-muted-foreground">Free Download</td>
                  </tr>
                  <tr>
                    <th className="bg-muted/50 px-4 py-3 text-left font-semibold text-card-foreground">Valid Till</th>
                    <td className="px-4 py-3 text-muted-foreground">31 January 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 1 */}
            <h2 id="section-1" className="mt-14 text-2xl font-bold tracking-tight">Why It Matters</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Modern search engines understand intent, context, and meaning. They reward content that explains clearly, structures information logically, and genuinely helps the user move forward. This is why growth today looks less like guesswork and more like problem solving.
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Teams that adapt to this shift win quietly. They focus on clarity, structure, and usefulness instead of shortcuts. The winners are those who treat growth as a communication discipline, not a technical loophole.
            </p>

            {/* Info Card */}
            <div className="my-10 rounded-xl border border-primary/20 bg-primary/5 p-6">
              <h3 className="font-bold text-card-foreground">Quick Thought</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Even 20 minutes of focused work every day can help build better habits and stronger thinking over time.
              </p>
            </div>

            {/* Section 2 */}
            <h2 id="section-2" className="mt-14 text-2xl font-bold tracking-tight">Conclusion</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Building a startup is not only about speed. It is also about slowing down, reflecting, and reconnecting with your purpose. The founders who balance execution with reflection are the ones who build companies that last.
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Start with clarity. Stay consistent. Let the compound effect do the rest.
            </p>
          </article>
        </Container>
      </section>

      {/* Author Card Bottom */}
      <div className="border-t border-border py-8">
        <Container>
          <div className="mx-auto flex max-w-[740px] items-center gap-5 rounded-md border border-border bg-card p-6">
            <img
              src={`https://picsum.photos/seed/${post.author.name}/200/200`}
              alt={post.author.name}
              className="size-20 rounded-md object-cover"
            />
            <div>
              <h3 className="font-bold text-card-foreground">{post.author.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {post.author.role}. Sharing insights, strategies, and ideas for founders building with clarity.
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Tags & Share */}
      <section className="border-t border-border py-8">
        <Container>
          <div className="mx-auto flex max-w-[760px] flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <a href="#" className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80">#{post.category.replace(/\s/g, "")}</a>
              <a href="#" className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80">#Startups</a>
              <a href="#" className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80">#Growth</a>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Share:</span>
              <a href="#" className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Share on Facebook">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Share on X">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Share on LinkedIn">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <button className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Copy link">
                <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border bg-muted/30 py-16">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-card-foreground">
              Join the WeCos reading list
            </h2>
            <p className="mt-2 text-muted-foreground">
              Get startup insights and community updates in your inbox.
            </p>
            <NewsletterForm />
          </div>
        </Container>
      </section>

      {/* Back to Top */}
      <BlogDetailActions />
    </main>
  );
}
