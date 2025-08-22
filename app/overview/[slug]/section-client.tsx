// app/vue-ensemble/[slug]/section-client.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpenCheck, Image as ImageIcon, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { slugify } from '@/utils/slugify';

type Block =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'callout'; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: string; [k: string]: any };

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border bg-gradient-to-b from-muted/40 to-background">
      <div className="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(1200px_circle_at_20%_-10%,_hsl(var(--primary))_0,_transparent_40%)]" />
    
      <div className="px-5 py-8 md:px-8">
      <Link
            href="/overview"
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-muted/60"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
      
        <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-xl border bg-muted/40 p-4">
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
        <Info className="h-3.5 w-3.5 text-muted-foreground" />
      </span>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function Shot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20% 0px -10% 0px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="my-6"
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-2 py-3">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground">{alt}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative aspect-[16/9] w-full bg-muted/20">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover"
            />
          </div>
        </CardContent>
      </Card>
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>
      ) : null}
    </motion.figure>
  );
}

export default function ClientSection({ slug }: { slug: string }) {
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/content/sections/overview.json', { cache: 'no-store' });
        const json = (await res.json()) as Block[];
        setBlocks(Array.isArray(json) ? json : []);
      } catch {
        setBlocks([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const section = useMemo(() => {
    if (!blocks?.length) return null;
    const h2s = blocks
      .map((b, i) => ({ b, i }))
      .filter(({ b }) => b.type === 'h2') as { b: Extract<Block, { type: 'h2' }>; i: number }[];

    const match = h2s.find(({ b }) => slugify(b.text.trim()) === slug);
    if (!match) return null;

    const start = match.i;
    const end = h2s.find(({ i }) => i > start)?.i ?? blocks.length;
    return blocks.slice(start, end);
  }, [blocks, slug]);

  const title = useMemo(() => {
    if (!section?.length) return 'Section';
    const h2 = section[0] as Extract<Block, { type: 'h2' }>;
    return h2?.text ?? 'Section';
  }, [section]);

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

  if (!section) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-8 space-y-4">
          <SectionHeader
            title="Section introuvable"
            subtitle="Vérifiez le slug ou le contenu du fichier overview.json."
          />
          <Link
            href="/overview"
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted/60"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à l’aperçu
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        {/* Header */}
        <SectionHeader title={title} subtitle="Vue d’ensemble — section détaillée" />

        {/* Breadcrumb + actions */}
        <nav className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
       
          <div>
            <Link href="/overview" className="underline underline-offset-2">
              Vue d’ensemble
            </Link>{' '}
            / <span className="text-foreground">{title}</span>
          </div>
         
        </nav>

        {/* Layout similar to Pret Perso: main + (optional) rail */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed">
                {/* Render blocks except the leading h2 which is now the page header */}
                {section.slice(1).map((b, i) => {
                  if (b.type === 'paragraph') return <p key={i}>{b.text}</p>;
                  if (b.type === 'callout') return <Callout key={i}>{b.text}</Callout>;
                  if (b.type === 'image') return <Shot key={i} src={b.src} alt={b.alt} caption={b.caption} />;
                  return null;
                })}
                {section.slice(1).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun contenu pour cette section.</p>
                ) : null}
              </CardContent>
            </Card>
          </div>

          {/* Right rail: quick links */}
          <aside className="lg:sticky lg:top-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Raccourcis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Link
                  href="/overview"
                  className="group inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-muted/60"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  Retour à l’aperçu
                </Link>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-muted/60"
                >
                  ↑ Haut de page
                </a>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
