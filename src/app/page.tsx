import { redirect } from "next/navigation";

// There's no public marketing site yet -- this project currently starts as
// the internal admin tool. Once there's a public-facing site (club/player
// landing pages, submission forms, etc.) this should become that homepage
// instead of a redirect.
export default function Home() {
  redirect("/admin");
}
