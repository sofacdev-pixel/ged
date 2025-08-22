'use client';

import React, { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Info, CheckCircle2, ArrowRight, BookOpenCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/* =========================
   Types (tolérants aux champs manquants)
   ========================= */
type Shortcut = { label: string; href: string };
type Step = { image: { src: string; alt: string }; caption: string };
type Category = {
  slug: string;
  title: string;
  callout?: string;
  bestPractices?: string[];
  shortcuts?: Shortcut[];
  steps?: Step[]; // <- rendu optionnel
};
type PersoData = {
  title: string;
  subtitle?: string;
  categories?: Category[]; // <- rendu optionnel
};

/* =========================
   UI atoms
   ========================= */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border bg-gradient-to-b from-muted/40 to-background">
      <div className="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(1200px_circle_at_20%_-10%,_hsl(var(--primary))_0,_transparent_40%)]" />
      <div className="px-5 py-8 md:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <BookOpenCheck className="h-3.5 w-3.5" />
          <span>Guide de procédure</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-xl border bg-muted/40 p-4">
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
        <Info className="h-3.5 w-3.5 text-muted-foreground" />
      </span>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function StepCard({ index, src, alt, caption }: { index: number; src: string; alt: string; caption: string }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20% 0px -10% 0px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background font-medium">
          {index}
          <span className="absolute -inset-0.5 -z-10 rounded-full bg-gradient-to-b from-muted/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <p className="text-sm font-medium">Étape {index}</p>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative w-full">
            <img src={src} alt={alt} className="block w-full select-none bg-white object-contain" />
          </div>
        </CardContent>
      </Card>
      <p className="mt-2 text-sm text-muted-foreground">{caption}</p>
    </motion.li>
  );
}

/* =========================
   Onglets catégories
   ========================= */
function CategoryTabs({
  categories,
  activeSlug,
  onSelect,
}: {
  categories: Category[];
  activeSlug?: string | null;
  onSelect: (slug: string) => void;
}) {
  const list = categories ?? [];
  if (list.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {list.map((c) => {
        const active = c.slug === activeSlug;
        return (
          <button
            key={c.slug}
            onClick={() => onSelect(c.slug)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition
              ${active ? 'bg-muted font-medium' : 'hover:bg-muted/60'}`}
            aria-pressed={active}
          >
            <FileText className="h-4 w-4" />
            {c.title}
          </button>
        );
      })}
    </div>
  );
}

/* =========================
   Page — /products/perso.json
   ========================= */
export default function PretPersonnelPage() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialCat = params.get('cat');

  const [data, setData] = useState<PersoData | null>(null);
  const [catSlug, setCatSlug] = useState<string | null>(initialCat);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch('/products/leasing.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('Impossible de charger /products/leasing.json');
        const json: PersoData = await res.json();
        if (cancelled) return;

        // Normalisation douce des données
        const categories = json.categories ?? [];
        setData({ ...json, categories });

        // Choisir la catégorie active de façon robuste
        const first = categories[0]?.slug ?? null;
        const exists = initialCat && categories.some((c) => c.slug === initialCat);
        setCatSlug(exists ? initialCat : first);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? 'Erreur inconnue');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = data?.categories ?? [];
  const activeCat = useMemo(() => {
    if (!categories.length || !catSlug) return null;
    return categories.find((c) => c.slug === catSlug) ?? categories[0] ?? null;
  }, [categories, catSlug]);

  const onSelectCat = (slug: string) => {
    setCatSlug(slug);
    const next = new URLSearchParams(window.location.search);
    next.set('cat', slug);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-24 rounded-2xl bg-muted/60" />
          <div className="h-10 w-2/3 rounded bg-muted/50" />
          <div className="h-40 rounded bg-muted/40" />
        </div>
      </main>
    );
  }

  if (err || !data) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <SectionHeader title="Dossier introuvable" subtitle={err ?? 'Vérifiez le JSON'} />
      </main>
    );
  }

  if (!categories.length) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <SectionHeader title={data.title} subtitle={data.subtitle} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aucune catégorie disponible</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Ajoutez des catégories dans <code>/products/perso.json</code> pour afficher le contenu.
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <SectionHeader title={data.title} subtitle={data.subtitle} />

      <CategoryTabs categories={categories} activeSlug={activeCat?.slug ?? null} onSelect={onSelectCat} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">{activeCat?.title ?? 'Catégorie'}</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">Parcours de consultation dans Content Server</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              {activeCat?.callout ? (
                <Callout>
                  <span className="font-medium">Remarque.</span> {activeCat.callout}
                </Callout>
              ) : null}
            </CardContent>
          </Card>

          {/* Steps (tolère absence) */}
          <section id="etapes" className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Étapes</h2>
            {activeCat?.steps && activeCat.steps.length > 0 ? (
              <ol className="space-y-6">
                {(activeCat.steps ?? []).map((s, i) => (
                  <StepCard
                    key={`${activeCat.slug}-${i}`}
                    index={i + 1}
                    src={s.image.src}
                    alt={s.image.alt}
                    caption={s.caption}
                  />
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune étape à afficher pour cette catégorie.</p>
            )}
          </section>
        </div>

        {/* Right rail */}
        <aside className="lg:sticky lg:top-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bonnes pratiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {(activeCat?.bestPractices ?? []).map((bp, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" />
                  <p>{bp}</p>
                </div>
              ))}
              {(activeCat?.bestPractices ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">Pas de bonnes pratiques renseignées.</p>
              )}
            </CardContent>
          </Card>

          {(activeCat?.shortcuts ?? []).length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Raccourcis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {(activeCat?.shortcuts ?? []).map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className="group inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-muted/60"
                  >
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    {s.label}
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </main>
  );
}
