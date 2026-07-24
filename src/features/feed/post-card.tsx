"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { postTypes } from "./post-types";
import { PostActions } from "./post-actions";
import type { FeedPost } from "./schema";

export function PostCard({ post, className }: { post: FeedPost; className?: string }) {
  const meta = postTypes[post.content.kind];
  const Body = meta.Body;
  const Icon = meta.icon;

  return (
    <article className={cn("rounded-2xl border border-border bg-card p-4 sm:p-5", className)}>
      <header className="flex items-center gap-3">
        <Link href={`/${post.author.handle}`}>
          <Avatar className="size-10">
            {post.author.avatarUrl ? <AvatarImage src={post.author.avatarUrl} alt={post.author.name} /> : null}
            <AvatarFallback>{post.author.avatarText}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <Link href={`/${post.author.handle}`} className="truncate font-medium text-foreground hover:underline">
              {post.author.name}
            </Link>
            {post.author.verified ? <BadgeCheck className="size-4 shrink-0 text-primary" /> : null}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            @{post.author.handle} · {formatDistanceToNowStrict(new Date(post.createdAt))} ago
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Icon className="size-3" />
          {meta.label}
        </Badge>
      </header>

      <div className="mt-3">
        <Body post={post} />
      </div>

      <div className="mt-3 border-t border-border pt-2">
        <PostActions post={post} />
      </div>
    </article>
  );
}
