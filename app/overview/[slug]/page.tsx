// app/vue-ensemble/[slug]/page.tsx
import ClientSection from "./section-client";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ClientSection slug={slug} />;
}
