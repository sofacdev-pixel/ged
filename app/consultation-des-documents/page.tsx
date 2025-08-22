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

/* ---------- Types matching /pages/consultation.json ---------- */
type QuickLink = { title: string; href: string };

type ProcedureImage = { src: string; alt?: string; caption?: string };
type Procedure = {
  title: string;
  steps: string[];
  note?: string;
  image?: ProcedureImage;
};

type Step = {
  n: number;
  title: string;
  paragraphs?: string[];
  notes?: string[];
  procedures?: Procedure[];
};

type ConsultationData = {
  header: { title: string; subtitle: string };
  steps: Step[];
  // catalog is not used on this page; if present it will be ignored safely
  quickLinks?: QuickLink[];
};

export default function Page() {
  const [data, setData] = useState<ConsultationData | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/pages/consultation.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ConsultationData = await res.json();
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

  return (
    <main className="min-h-screen mx-auto bg-background">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            {data.header.title}
          </h1>
          <p className="mt-2 text-muted-foreground">{data.header.subtitle}</p>
        </header>

        {/* Steps */}
        {data.steps.map((step) => (
          <section key={step.n} className="space-y-4">
            <div className="flex items-center gap-3">
              <StepBadge n={step.n} />
              <h2 className="text-xl font-medium leading-tight">{step.title}</h2>
            </div>

            {/* Paragraphs */}
            {step.paragraphs?.map((t, i) => (
              <p key={i} className="text-sm leading-relaxed">
                {t}
              </p>
            ))}

            {/* Notes */}
            {step.notes?.map((n, i) => (
              <div key={i} className="rounded-lg border bg-card p-4 text-sm">
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Remarque
                </div>
                <p className="mt-2">{n}</p>
              </div>
            ))}

            {/* Procedures */}
            {step.procedures?.length ? (
              <div className="space-y-4">
                {step.procedures.map((proc, i) => (
                  <div key={i} className="rounded-lg border bg-card p-4">
                    <p className="text-sm font-medium">{proc.title}</p>

                    {/* Steps list */}
                    <ol className="mt-2 list-decimal pl-5 text-sm">
                      {proc.steps.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ol>

                    {/* Optional note inside the procedure */}
                    {proc.note && (
                      <div className="mt-3 rounded-md border bg-background p-3 text-xs">
                        <span className="font-semibold">Note&nbsp;:</span> {proc.note}
                      </div>
                    )}

                    {/* Optional image */}
                    {proc.image?.src && (
                      <figure className="mt-3">
                        <Image
                          src={proc.image.src}
                          alt={proc.image.alt || proc.title}
                          width={1200}
                          height={700}
                          className="w-full h-auto rounded-md border object-contain"
                        />
                        {proc.image.caption && (
                          <figcaption className="mt-1 text-xs text-muted-foreground">
                            {proc.image.caption}
                          </figcaption>
                        )}
                      </figure>
                    )}
                  </div>
                ))}
              </div>
            ) : null}

            <Separator className="my-10" />
          </section>
        ))}

        {/* Quick links */}
        {data.quickLinks?.length ? (
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
        ) : null}

        <div className="h-24" />
      </div>
    </main>
  );
}
