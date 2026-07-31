import { redirect } from "next/navigation";

// The feed isn't live yet — individual post links route back to the coming-soon.
export default function FeedPostPage() {
  redirect("/feed");
}
