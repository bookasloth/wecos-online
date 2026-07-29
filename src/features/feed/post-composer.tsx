"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store/app-store";
import { useCan } from "@/lib/authz/use-can";
import { Upgrade } from "@/components/authz/upgrade";
import { authorFromProfile, nid } from "./feed-utils";
import { postTypes, postTypeOrder } from "./post-types";
import type { PostContent, PostType } from "./schema";

const QUICK: PostType[] = ["photo", "ytVideo", "poll", "quote", "achievement"];

/** Rich post kinds gated behind `post.richKinds` (Network+). See docs/FEATURES.md. */
const RICH_KINDS: PostType[] = ["poll", "quiz", "video", "ytVideo"];

function isComplete(c: PostContent): boolean {
  switch (c.kind) {
    case "text": return c.body.trim().length > 0;
    case "photo": return c.images.filter(Boolean).length > 0 || (c.body ?? "").trim().length > 0;
    case "ytVideo": return c.url.trim().length > 0;
    case "video": return c.src.trim().length > 0;
    case "poll": return c.question.trim().length > 0 && c.options.filter((o) => o.label.trim()).length >= 2;
    case "quote": return c.quote.trim().length > 0;
    case "question": return c.body.trim().length > 0;
    case "quiz": return c.question.trim().length > 0 && c.options.filter((o) => o.label.trim()).length >= 2;
    case "achievement": return c.title.trim().length > 0;
  }
}

export function PostComposer() {
  const profile = useAppStore((s) => s.profile);
  const addPost = useAppStore((s) => s.addPost);
  const author = authorFromProfile(profile);
  const canRich = useCan("post.richKinds");
  const isLocked = (k: PostType) => !canRich && RICH_KINDS.includes(k);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<PostContent>(postTypes.text.blank());
  const locked = isLocked(draft.kind);

  const launch = (kind: PostType) => {
    setDraft(postTypes[kind].blank());
    setOpen(true);
  };

  const submit = () => {
    if (!isComplete(draft)) return;
    addPost(draft);
    setOpen(false);
    setDraft(postTypes.text.blank());
  };

  const firstName = (profile?.fullName ?? "there").split(" ")[0];

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            {author.avatarUrl ? <AvatarImage src={author.avatarUrl} alt={author.name} /> : null}
            <AvatarFallback>{author.avatarText}</AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => launch("text")}
            className="flex-1 rounded-full bg-muted px-4 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/70"
          >
            Share something, {firstName}…
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1 border-t border-border pt-2">
          {QUICK.map((k) => {
            const Icon = postTypes[k].icon;
            return (
              <Button key={k} variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => launch(k)}>
                {isLocked(k) ? <Lock className="size-3.5" /> : <Icon className="size-4" />}
                {postTypes[k].label}
              </Button>
            );
          })}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create post</DialogTitle>
          </DialogHeader>

          <div className="flex flex-wrap gap-1">
            {postTypeOrder.map((k) => {
              const Icon = postTypes[k].icon;
              const active = draft.kind === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setDraft(postTypes[k].blank())}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                    active ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isLocked(k) ? <Lock className="size-3.5" /> : <Icon className="size-3.5" />}
                  {postTypes[k].label}
                </button>
              );
            })}
          </div>

          {locked ? (
            <Upgrade capability="post.richKinds">
              Polls, quizzes and video posts are a paid feature. Text, questions
              and wins are always free.
            </Upgrade>
          ) : (
            <>
              <div className="space-y-3 overflow-y-auto">
                <ComposerFields draft={draft} setDraft={setDraft} />
              </div>

              <div className="flex justify-end">
                <Button onClick={submit} disabled={!isComplete(draft)}>Post</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ComposerFields({ draft, setDraft }: { draft: PostContent; setDraft: (c: PostContent) => void }) {
  switch (draft.kind) {
    case "text":
      return <Textarea autoFocus rows={4} placeholder="What's on your mind?" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />;
    case "question":
      return <Textarea autoFocus rows={3} placeholder="Ask the community a question…" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />;
    case "photo":
      return (
        <>
          <Textarea rows={2} placeholder="Say something about this photo…" value={draft.body ?? ""} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          <Input autoFocus placeholder="Image URL" value={draft.images[0] ?? ""} onChange={(e) => setDraft({ ...draft, images: e.target.value ? [e.target.value] : [] })} />
        </>
      );
    case "ytVideo":
      return (
        <>
          <Textarea rows={2} placeholder="Add a comment…" value={draft.body ?? ""} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          <Input autoFocus placeholder="YouTube URL" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} />
        </>
      );
    case "video":
      return (
        <>
          <Textarea rows={2} placeholder="Add a comment…" value={draft.body ?? ""} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          <Input autoFocus placeholder="Video file URL (.mp4)" value={draft.src} onChange={(e) => setDraft({ ...draft, src: e.target.value })} />
        </>
      );
    case "quote":
      return (
        <>
          <Textarea autoFocus rows={3} placeholder="The quote…" value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} />
          <Input placeholder="Attribution / source" value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} />
        </>
      );
    case "achievement":
      return (
        <>
          <Input autoFocus placeholder="What did you achieve?" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <Input placeholder="Metric (optional, e.g. ₹4,000 Cr)" value={draft.metric ?? ""} onChange={(e) => setDraft({ ...draft, metric: e.target.value })} />
          <Textarea rows={2} placeholder="Details (optional)" value={draft.detail ?? ""} onChange={(e) => setDraft({ ...draft, detail: e.target.value })} />
        </>
      );
    case "poll":
      return (
        <>
          <Input autoFocus placeholder="Poll question" value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
          {draft.options.map((o, i) => (
            <Input
              key={o.id}
              placeholder={`Option ${i + 1}`}
              value={o.label}
              onChange={(e) =>
                setDraft({ ...draft, options: draft.options.map((x) => (x.id === o.id ? { ...x, label: e.target.value } : x)) })
              }
            />
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setDraft({ ...draft, options: [...draft.options, { id: nid(), label: "", votes: 0 }] })}
          >
            + Add option
          </Button>
        </>
      );
    case "quiz":
      return (
        <>
          <Input autoFocus placeholder="Quiz question" value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
          {draft.options.map((o, i) => (
            <div key={o.id} className="flex items-center gap-2">
              <Input
                placeholder={`Answer ${i + 1}`}
                value={o.label}
                onChange={(e) =>
                  setDraft({ ...draft, options: draft.options.map((x) => (x.id === o.id ? { ...x, label: e.target.value } : x)) })
                }
              />
              <label className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <input
                  type="radio"
                  name="quiz-correct"
                  checked={o.correct}
                  onChange={() => setDraft({ ...draft, options: draft.options.map((x) => ({ ...x, correct: x.id === o.id })) })}
                />
                Correct
              </label>
            </div>
          ))}
          <Textarea rows={2} placeholder="Explanation (shown after answering)" value={draft.explanation ?? ""} onChange={(e) => setDraft({ ...draft, explanation: e.target.value })} />
        </>
      );
  }
}
