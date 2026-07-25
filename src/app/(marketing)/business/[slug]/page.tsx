import { redirect } from "next/navigation";

/** Legacy URL — the canonical startup page now lives at /startup/[slug]. */
export default async function BusinessRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/startup/${slug}`);
}
