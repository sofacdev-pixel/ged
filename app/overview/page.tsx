// app/vue-ensemble/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { slugify } from '@/utils/slugify';

/* ---------- Types ---------- */
type RawBlock =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'callout'; text: string }
  | { type: string; [k: string]: any };

type SectionCard = {
  title: string;
  slug: string;
  description?: string;
  label: string;
};

/* ---------- Assets & Fallbacks ---------- */
const STANDARD_IMAGES = [
  { src: 'https://qksurgwkyrszihrrjkpz.supabase.co/storage/v1/object/sign/illustrations/login.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNjMyZGZlZC1kNThhLTQyNGItOTcwOC02MWVkMzVjY2Q3ZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbGx1c3RyYXRpb25zL2xvZ2luLnN2ZyIsImlhdCI6MTc1NTk2MDgyOSwiZXhwIjoxNzg3NDk2ODI5fQ.tWDrCCaHdeVUmkL9PhBegpvtOJy63AFeCo-Ytw5grPg', alt: 'Illustration 1' },
  { src: 'https://qksurgwkyrszihrrjkpz.supabase.co/storage/v1/object/sign/illustrations/logout.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNjMyZGZlZC1kNThhLTQyNGItOTcwOC02MWVkMzVjY2Q3ZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbGx1c3RyYXRpb25zL2xvZ291dC5zdmciLCJpYXQiOjE3NTU5NjA4NDUsImV4cCI6MTc4NzQ5Njg0NX0.ZC3TGPv2U5AVOkr1bFhBvkM8mMdOwy38QHtDwulLM2k', alt: 'Illustration 2' },
  { src: 'https://qksurgwkyrszihrrjkpz.supabase.co/storage/v1/object/sign/illustrations/password.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNjMyZGZlZC1kNThhLTQyNGItOTcwOC02MWVkMzVjY2Q3ZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbGx1c3RyYXRpb25zL3Bhc3N3b3JkLnN2ZyIsImlhdCI6MTc1NTk2MDg2NCwiZXhwIjoxNzg3NDk2ODY0fQ.D5miI_ayJiu7EtfdfPGt4Kcxz2ZPOKWnPSAiaIhl70s', alt: 'Illustration 3' },
];

const FALLBACK_CLASSES = [
  'bg-gradient-to-tr from-purple-200 to-pink-400 dark:from-zinc-800 dark:to-zinc-700',
  'bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700',
  'bg-gradient-to-tr from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700',
];

/* ---------- UI Primitives ---------- */
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted/50 ${className}`} />;
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card p-3">
      <Skeleton className="h-4 w-20 mb-3" />
      <Skeleton className="aspect-[16/9] w-full mb-3" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

/* ---------- Card Cover with graceful fallback ---------- */
function CardCover({ idx }: { idx: number }) {
  const [errored, setErrored] = useState(false);
  const img = STANDARD_IMAGES[idx % STANDARD_IMAGES.length];
  const fallback = FALLBACK_CLASSES[idx % FALLBACK_CLASSES.length];

  if (errored) {
    return <div className={`aspect-[16/9] ${fallback}`} aria-hidden="true" />;
  }

  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-md">
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        unoptimized
        onError={() => setErrored(true)}
        priority={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
    </div>
  );
}

/* ---------- Page ---------- */
export default function VueEnsembleIndex() {
  const [data, setData] = useState<RawBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const aborted = useRef(false);

  useEffect(() => {
    let mounted = true;
  
    (async () => {
      try {
        setLoading(true);
        setErr(null);
  
        const res = await fetch('/content/sections/overview.json', {
          cache: 'no-store',
        });
  
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
        const json: RawBlock[] = await res.json();
        if (mounted) setData(json);
      } catch (e: any) {
        // Only surface real errors while ignoring unmounts
        if (mounted) setErr(e?.message || 'Erreur inconnue');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
  
    return () => {
      mounted = false;
    };
  }, []);

  const sections: SectionCard[] = useMemo(() => {
    if (!data?.length) return [];
    const out: SectionCard[] = [];

    const indices = data
      .map((b, i) => ({ b, i }))
      .filter(({ b }) => b.type === 'h2') as { b: Extract<RawBlock, { type: 'h2' }>; i: number }[];

    for (let k = 0; k < indices.length; k++) {
      const { b, i } = indices[k];
      const nextIndex = k + 1 < indices.length ? indices[k + 1].i : data.length;

      let description: string | undefined;
      for (let j = i + 1; j < nextIndex; j++) {
        const blk = data[j];
        if (blk.type === 'paragraph' && typeof (blk as any).text === 'string') {
          description = (blk as any).text;
          break;
        }
      }

      const title = b.text?.trim() || `Section ${k + 1}`;
      const label = `Section ${String.fromCharCode(65 + k)}`; // A, B, C...
      out.push({ title, slug: slugify(title), description, label });
    }
    return out;
  }, [data]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8">
          <h1 className="text-center text-3xl font-semibold tracking-tight">Vue d’ensemble</h1>
          <p className="mt-2 text-center text-muted-foreground">
            Parcourez les sections clés de l’application. Chaque carte utilise une illustration standard (ou un dégradé) et un court résumé.
          </p>
        </header>

        {/* Error state */}
        {err && !loading && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm">
            Impossible de charger le contenu. <span className="font-medium">{err}</span>
          </div>
        )}

        {/* Loading skeleton grid */}
        {loading && (
          <section
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-live="polite"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </section>
        )}

        {/* Empty state */}
        {!loading && !err && sections.length === 0 && (
          <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
            Aucune section trouvée.
          </div>
        )}

        {/* Section cards */}
        {!loading && sections.length > 0 && (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s, idx) => (
              <Link
                key={s.slug}
                href={`/overview/${s.slug}`}
                className="group block overflow-hidden rounded-lg border bg-card p-3 transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`Ouvrir ${s.title}`}
                prefetch
              >
                <div className="space-y-4">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                  <CardCover idx={idx} />
                  <h2 className="mt-1 text-sm font-medium leading-tight">{s.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {s.description ?? 'Consulter la section →'}
                  </p>
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
