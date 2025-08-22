// app/vue-ensemble/[slug]/page.tsx

import ClientSection from "./section-client";


export default function Page({ params }: { params: { slug: string } }) {
  return <ClientSection slug={params.slug} />;
}
