"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/pages/acquisition.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: AcquisitionData = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return null; // keep UI clean; no loader

  const [step1, step2, step3] = data.steps;

  return (
    <main className="min-h-screen mx-auto bg-background">
      <div className=" w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            {data.header.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {data.header.subtitle}
          </p>
        </header>

        {/* Step 1 (UI identical) */}
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

        {/* Produits (UI identical) */}
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
                className="group flex items-center gap-3  border bg-card p-0 pr-8 transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

        {/* Step 2 (UI identical) */}
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

        {/* Step 3 (UI identical) */}
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

          {/* The note box (matches your original placement) */}
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

        {/* Quick links (UI identical) */}
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
