// app/vue-ensemble/page.tsx
"use client";

import { useEffect, useState, useMemo, useState as useReactState } from "react";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/utils/slugify";

type RawBlock =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "callout"; text: string }
  | { type: string; [k: string]: any };

type SectionCard = {
  title: string;
  slug: string;
  description?: string;
  label: string;
};

const STANDARD_IMAGES = [
  { src: "https://qksurgwkyrszihrrjkpz.supabase.co/storage/v1/object/sign/illustrations/login.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNjMyZGZlZC1kNThhLTQyNGItOTcwOC02MWVkMzVjY2Q3ZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbGx1c3RyYXRpb25zL2xvZ2luLnN2ZyIsImlhdCI6MTc1NTg3MDQ4MiwiZXhwIjoxNzg3NDA2NDgyfQ.96O9A1Tx9V7DaK1t42NlrILr7Bjz_zQiwt95qZSiL60", alt: "Illustration 1" },
  { src: "https://qksurgwkyrszihrrjkpz.supabase.co/storage/v1/object/sign/illustrations/logout.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNjMyZGZlZC1kNThhLTQyNGItOTcwOC02MWVkMzVjY2Q3ZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbGx1c3RyYXRpb25zL2xvZ291dC5zdmciLCJpYXQiOjE3NTU4NzA2MDMsImV4cCI6MTc4NzQwNjYwM30.OCy6dMLJ28xtWRF5bgdLuY9gC1TJuOmgvyIbbrSvP7o", alt: "Illustration 2" },
  { src: "https://qksurgwkyrszihrrjkpz.supabase.co/storage/v1/object/sign/illustrations/password.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNjMyZGZlZC1kNThhLTQyNGItOTcwOC02MWVkMzVjY2Q3ZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbGx1c3RyYXRpb25zL3Bhc3N3b3JkLnN2ZyIsImlhdCI6MTc1NTg3MDYyOSwiZXhwIjoxNzg3NDA2NjI5fQ.d5vNKe64KDmum5YPUYwBddz0w9EqDquRR6pMzsShkaM", alt: "Illustration 3" },
];

// Simple gradient fallbacks (no images required)
const FALLBACK_CLASSES = [
  "bg-gradient-to-tr from-purple-200 to-pink-400 dark:from-zinc-800 dark:to-zinc-700",
  "bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700",
  "bg-gradient-to-tr from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700",
];

function CardCover({ idx }: { idx: number }) {
  const [errored, setErrored] = useReactState(false);
  const img = STANDARD_IMAGES[idx % STANDARD_IMAGES.length];
  const fallback = FALLBACK_CLASSES[idx % FALLBACK_CLASSES.length];

  if (!errored) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden ">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          // Avoid native optimization to sidestep sharp issues locally
          unoptimized
          onError={() => setErrored(true)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
      </div>
    );
  }

  // Fallback block (no network, no sharp)
  return (
    <div
      className={`aspect-[16/9] overflow-hidden  ${fallback}`}
      aria-hidden="true"
    />
  );
}

export default function VueEnsembleIndex() {
  const [data, setData] = useState<RawBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/content/sections/overview.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load JSON");
        const json: RawBlock[] = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sections: SectionCard[] = useMemo(() => {
    const out: SectionCard[] = [];
    const indices = data
      .map((b, i) => ({ b, i }))
      .filter(({ b }) => b.type === "h2") as { b: Extract<RawBlock, { type: "h2" }>; i: number }[];

    for (let k = 0; k < indices.length; k++) {
      const { b, i } = indices[k];
      const nextIndex = k + 1 < indices.length ? indices[k + 1].i : data.length;

      let description: string | undefined;
      for (let j = i + 1; j < nextIndex; j++) {
        const blk = data[j];
        if (blk.type === "paragraph" && typeof (blk as any).text === "string") {
          description = (blk as any).text;
          break;
        }
      }

      const title = b.text.trim();
      const label = `Section ${String.fromCharCode(65 + k)}`; // A, B, C...
      out.push({ title, slug: slugify(title), description, label });
    }
    return out;
  }, [data]);

  if (loading) {
    return (
      <main className="py-10 px-6">
        <p className="text-muted-foreground">Chargement…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen  mx-auto bg-background">
      <div className=" w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-center">Vue d’ensemble</h1>
          <p className="mt-2 text-center text-muted-foreground">
            Parcourez les sections clés de l’application. Chaque carte utilise une illustration standard (ou un dégradé) et un court résumé.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s, idx) => (
            <Link
              key={s.slug}
              href={`/overview/${s.slug}`}
              className="group overflow-hidden  gap-2 bg-card transition-colors  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
             
              <div className="space-y-4">
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
                <CardCover idx={idx} />
                <h2 className="mt-1 text-sm font-medium leading-tight">{s.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {s.description ?? "Consulter la section →"}
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
