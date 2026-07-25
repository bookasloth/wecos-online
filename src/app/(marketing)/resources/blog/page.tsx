import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { Container } from "@/components/layout/container";
import {blogPosts} from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Founder stories, startup insights, and practical advice from the WeCos community.",
};

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <>
      {/* Hero */}
      <section className="bg-black py-10 sm:py-14">
        <Container>
          <div className="text-center">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">
              Blog
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Founder stories & insights
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-white/70">
              Practical advice, founder journeys, and startup wisdom from the
              WeCos community.
            </p>
          </div>
        </Container>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 sm:py-16">
          <Container>
            <Link
              href={`/resources/blog/${featuredPost.slug}`}
              className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="grid gap-0 lg:grid-cols-2">
                <div className="relative overflow-hidden bg-muted">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105 lg:h-[380px] lg:object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    Featured
                  </span>
                </div>

                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
                    {featuredPost.title}
                  </h2>

                  <p className="mt-4 text-muted-foreground">
                    {featuredPost.excerpt}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
                    <span className="text-sm text-muted-foreground">
                      By {featuredPost.author.name}
                    </span>
                    <span className="text-sm font-semibold text-primary transition-colors group-hover:text-primary/80">
                      Read Article →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Container>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/resources/blog/${post.slug}`}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative overflow-hidden bg-muted">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold tracking-tight text-card-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-muted-foreground">
                      By {post.author.name}
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="rounded-xl bg-black px-8 py-16 text-center sm:px-12">
            <h2 className="mx-auto max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Want to share your founder story?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/70">
              We&apos;re always looking for authentic founder experiences to share
              with the community.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full border-2 border-primary bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Get in Touch
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
