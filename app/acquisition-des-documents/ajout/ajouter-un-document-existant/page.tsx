"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

// ---------- Types matching new.json ----------
type Step = {
  n: number;
  textHtml: string; // rich HTML allowed (e.g., <span class="font-medium">…</span>)
  subHtml?: string;
  bullets?: string[];
  image?: { src: string; alt: string } | null;
  noteHtml?: string; // optional note block as HTML
};

type GuideData = {
  title: string;
 
  steps: Step[];
};

// ---------- Minimal, reusable UI helpers ----------
function Container({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">{children}</main>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{children}</h1>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={"rounded-2xl border bg-card text-card-foreground shadow-sm " + className}>{children}</div>
  );
}

function StepItem({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border text-sm font-semibold">{n}</span>
      <div className="min-w-0 space-y-2 text-sm sm:text-base leading-relaxed">{children}</div>
    </li>
  );
}

function Note({ title = "Note", children }: { title?: string; children: React.ReactNode }) {
  return (
    <Card className="p-4 text-sm">
      <div className="font-medium mb-2">{title}</div>
      <div className="prose prose-sm dark:prose-invert max-w-none">{children}</div>
    </Card>
  );
}

// ---------- Page (fetches /data/new.json) ----------
export default function Page() {
  const [data, setData] = useState<GuideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/pages/exist.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: GuideData = await res.json();
        if (alive) setData(json);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Erreur inconnue");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <Container>
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-2/3 rounded bg-muted" />
          <div className="h-52 w-full rounded-2xl bg-muted" />
          <div className="h-24 w-full rounded bg-muted" />
        </div>
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container>
        <Card className="p-4">
          <div className="text-sm">Impossible de charger <code>/data/new.json</code>. {error && <span className="text-destructive">({error})</span>}</div>
        </Card>
      </Container>
    );
  }



  return (
    <Container>
      <div className="space-y-6">
        <H1>{data.title}</H1>

        {/* Hero screenshot */}
       

        {/* Steps */}
        <ol className="space-y-5">
          {data.steps.map((s) => (
            <React.Fragment key={s.n}>
              <StepItem n={s.n}>
                {/* textHtml & subHtml are trusted content from your own JSON (no user input) */}
                <div dangerouslySetInnerHTML={{ __html: s.textHtml }} />
                {s.subHtml && (
                  <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: s.subHtml }} />
                )}
                {s.bullets && s.bullets.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
                    {s.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </StepItem>

              {s.image && (
                <div className="ml-[3.5rem]">
                  <Card className="p-0 border-none shadow-none">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                      <Image src={s.image.src} alt={s.image.alt} fill className="object-cover" />
                    </div>
                  </Card>
                </div>
              )}

              {s.noteHtml && (
                <div className="ml-[3.5rem]">
                  <Note>
                    <div dangerouslySetInnerHTML={{ __html: s.noteHtml }} />
                  </Note>
                </div>
              )}
            </React.Fragment>
          ))}
        </ol>
      </div>
    </Container>
  );
}

