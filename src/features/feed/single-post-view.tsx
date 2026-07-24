"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { PostCard } from "./post-card";
import { CommentThread } from "./comment-thread";

export function SinglePostView({ id }: { id: string }) {
  const post = useAppStore((s) => s.posts.find((p) => p.id === id));

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Link href="/feed" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to feed
        </Link>
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">This post doesn&apos;t exist or was removed.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* The post itself carries the visible title, so this heading exists only
          to give the page a level-1 entry in the screen-reader heading tree. */}
      <h1 className="sr-only">Post by {post.author.name}</h1>
      <Link href="/feed" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to feed
      </Link>
      <PostCard post={post} />
      <CommentThread post={post} />
    </div>
  );
}
