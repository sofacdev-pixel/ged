"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";

/* ---------- Small skeleton atoms ---------- */
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted/50 ${className}`} />;
}

function RowSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === 0 ? "w-3/4" : "w-5/6"}`} />
      ))}
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background text-sm font-semibold">
      {n}
    </div>
  );
}

/* ---------- Types matching the JSON ---------- */
type Product = { icon: string; title: string; href: string };
type QuickLink = { title: string; href: string };
type Step = {
  n: number;
  title: string;
  paragraphs?: string[];
  notes?: string[];
  introListTitle?: string;
  introList?: string[];
};
type Catalog = {
  eyebrow: string;
  title: string;
  subtitle: string;
  products: Product[];
};
type AcquisitionData = {
  header: { title: string; subtitle: string };
  steps: Step[];
  catalog: Catalog;
  quickLinks: QuickLink[];
};

export default function Page() {
  const [data, setData] = useState<AcquisitionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const res = await fetch("/pages/acquisition.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: AcquisitionData = await res.json();
        if (mounted) setData(json);
      } catch (e: any) {
        if (mounted) setErr(e?.message || "Erreur inconnue");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* ---------- Skeleton UI ---------- */
  if (loading) {
    return (
      <main className="min-h-screen mx-auto bg-background">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {/* Header skeleton */}
          <div>
            <Skeleton className="h-8 w-2/3 rounded-lg" />
            <Skeleton className="mt-3 h-4 w-5/6" />
          </div>

          {/* Step 1 skeleton */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-64" />
            </div>
            <RowSkeleton lines={3} />
            <Skeleton className="h-20 w-full rounded-lg" />
          </section>

          <Separator className="my-10" />

          {/* Products skeleton */}
          <section>
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="mt-2 h-6 w-56" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 border bg-card p-0 pr-8">
                  <Skeleton className="h-48 w-48" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="ml-auto h-4 w-4 rounded-full" />
                </div>
              ))}
            </div>
          </section>

          <Separator className="my-10" />

          {/* Step 2 skeleton */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-64" />
            </div>
            <Skeleton className="h-24 w-full rounded-lg" />
            <RowSkeleton lines={3} />
            <Skeleton className="h-20 w-full rounded-lg" />
          </section>

          <Separator className="my-10" />

          {/* Step 3 skeleton */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-64" />
            </div>
            <RowSkeleton lines={1} />
            <Skeleton className="h-20 w-full rounded-lg" />
            <RowSkeleton lines={2} />
          </section>

          {/* Quick links skeleton */}
          <div className="mt-8 grid grid-cols-1 divide-y rounded-xl border sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>

          <div className="h-24" />
        </div>
      </main>
    );
  }

  /* ---------- Error fallback ---------- */
  if (err || !data) {
    return (
      <main className="min-h-screen mx-auto bg-background">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-xl border bg-destructive/10 p-4 text-sm">
            Impossible de charger la page. <span className="font-medium">{err}</span>
          </div>
        </div>
      </main>
    );
  }

  /* ---------- Content ---------- */
  const [step1, step2, step3] = data.steps;

  return (
    <main className="min-h-screen mx-auto bg-background">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            {data.header.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {data.header.subtitle}
          </p>
        </header>

        {/* Step 1 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <StepBadge n={step1.n} />
            <h2 className="text-xl font-medium leading-tight">
              {step1.title}
            </h2>
          </div>

          {step1.paragraphs?.map((t, i) => (
            <p key={i} className="text-sm leading-relaxed">{t}</p>
          ))}

          {step1.notes?.map((n, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 text-sm">
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Remarque
              </div>
              <p className="mt-2">{n}</p>
            </div>
          ))}
        </section>

        <Separator className="my-10" />

        {/* Products */}
        <section>
          <div className="mb-3">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {data.catalog.eyebrow}
            </div>
            <h3 className="mt-1 text-lg font-medium">{data.catalog.title}</h3>
            <p className="text-sm text-muted-foreground">
              {data.catalog.subtitle}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data.catalog.products.map((p, i) => (
              <Link
                key={`${p.title}-${i}`}
                href={p.href}
                className="group flex items-center gap-3 border bg-card p-0 pr-8 transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="relative flex h-48 w-48 items-center justify-center">
                  <Image
                    src={p.icon}
                    alt={p.title}
                    width={20}
                    height={20}
                    className="object-contain h-48 w-48"
                  />
                </span>
                <span className="text-sm font-medium">{p.title}</span>
                <ArrowRight
                  size={16}
                  className="ml-auto opacity-60 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>

        <Separator className="my-10" />

        {/* Step 2 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <StepBadge n={step2.n} />
            <h2 className="text-xl font-medium leading-tight">
              {step2.title}
            </h2>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm">{step2.introListTitle}</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {step2.introList?.map((li, i) => <li key={i}>{li}</li>)}
            </ul>
          </div>

          {step2.paragraphs?.map((t, i) => (
            <p key={i} className="text-sm leading-relaxed">{t}</p>
          ))}

          {step2.notes?.map((n, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 text-sm">
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Remarque
              </div>
              <p className="mt-2">{n}</p>
            </div>
          ))}
        </section>

        <Separator className="my-10" />

        {/* Step 3 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <StepBadge n={step3.n} />
            <h2 className="text-xl font-medium leading-tight">
              {step3.title}
            </h2>
          </div>

          {/* First paragraph stays outside note box */}
          {step3.paragraphs?.[0] && (
            <p className="text-sm leading-relaxed">{step3.paragraphs[0]}</p>
          )}

          {/* The note box */}
          {step3.notes?.[0] && (
            <div className="rounded-lg border bg-card p-4 text-sm">
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Remarque
              </div>
              <p className="mt-2">{step3.notes[0]}</p>
            </div>
          )}

          {/* Remaining paragraphs */}
          {step3.paragraphs?.slice(1).map((t, i) => (
            <p key={i} className="text-sm leading-relaxed">{t}</p>
          ))}
        </section>

        {/* Quick links */}
        <nav className="mt-8 grid grid-cols-1 divide-y rounded-xl border sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
          {data.quickLinks.map((item, i) => (
            <Link
              key={`${item.title}-${i}`}
              href={item.href}
              className="group flex items-center justify-between p-4 transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="text-sm font-medium">{item.title}</span>
              <ArrowRight
                size={16}
                className="opacity-60 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>

        <div className="h-24" />
      </div>
    </main>
  );
}
