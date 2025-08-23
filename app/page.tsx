'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

/* ---------- Types tied to JSON structure ---------- */
type HomeLink = {
  title: string;
  href: string;
  image?: { src: string; alt?: string } | null;
};

type HomeData = {
  title: string; // supports inline HTML for styled spans
  subtitle: string;
  hero?: { video?: string; poster?: string; alt?: string } | null;
  suggestions: string[];
  quickLinks: HomeLink[];
};

/* ---------- Tiny skeleton primitives ---------- */
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded-md bg-muted/50', className)} />;
}

function TextSkeleton({ lines = 2, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={clsx('h-4 w-full', i === lines - 1 && 'w-4/5')} />
      ))}
    </div>
  );
}

/* ---------- Lazy video: mounts only when visible ---------- */
function LazyVideo({
  src,
  poster,
  alt,
}: {
  src: string;
  poster?: string;
  alt?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl border bg-card">
      <div className="relative aspect-video w-full">
        {visible ? (
          <video
            className="h-full w-full object-cover"
            src={src}
            poster={poster}
            preload="none"
            playsInline
            muted
            autoPlay
            loop
            aria-label={alt || 'Vidéo de présentation'}
          />
        ) : (
          <Skeleton className="absolute inset-0" />
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load UI content from JSON so it's editable without code changes
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/pages/home.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: HomeData = await res.json();
        if (mounted) setData(json);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Erreur inconnue');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const query = q.trim();
      router.push(query ? `/recherche?query=${encodeURIComponent(query)}` : '/recherche');
    },
    [q, router]
  );

  const useSuggestion = useCallback((s: string) => {
    setQ(s);
    inputRef.current?.focus();
  }, []);

  const suggestions = useMemo(() => data?.suggestions ?? [], [data]);
  const quickLinks = useMemo(() => data?.quickLinks ?? [], [data]);
  const hero = data?.hero;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* soft background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/10),transparent_50%)]"
      />

      <section className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-4 py-10">
        {/* Loading / Error */}
        {error && !loading && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm">
            Impossible de charger le contenu. <span className="font-medium">{error}</span>
          </div>
        )}

        {/* ----------- Loading Skeleton State ----------- */}
        {loading && (
          <>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <TextSkeleton lines={2} className="mt-3 max-w-xl" />
                <div className="mt-5">
                  <Skeleton className="h-12 w-full rounded-2xl" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-7 w-28 rounded-full" />
                  ))}
                </div>
              </div>
              <div className="order-first lg:order-none">
                <Skeleton className="aspect-video w-full rounded-2xl" />
              </div>
            </div>

            <div className="mt-12">
              <Skeleton className="mb-3 h-4 w-32" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative flex items-stretch gap-3 rounded-lg border bg-card p-3"
                  >
                    <Skeleton className="h-48 w-48 rounded-md" />
                    <div className="flex min-w-0 flex-1 items-center pr-8">
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ----------- Loaded Content ----------- */}
        {!loading && data && (
          <>
            {/* Top grid: left copy + search | right video */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
              {/* LEFT: heading / subtitle / search / suggestions */}
              <div>
                <header className="mb-5">
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    <span dangerouslySetInnerHTML={{ __html: data.title }} />
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">{data.subtitle}</p>
                </header>

                {/* Search bar */}
                <form onSubmit={onSubmit} className="relative" role="search" aria-label="Recherche">
                  <div className="group relative flex items-center rounded-2xl border bg-accent/50 px-4 py-3 transition-colors hover:bg-accent">
                    <SearchIcon className="mr-3 h-5 w-5 text-muted-foreground shrink-0" />
                    <input
                      ref={inputRef}
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Rechercher (⌘K)"
                      className="peer w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                      aria-label="Rechercher"
                    />
                    <button
                      type="submit"
                      className={clsx(
                        'ml-3 inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors',
                        'hover:bg-background'
                      )}
                    >
                      Rechercher
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => useSuggestion(s)}
                        className="rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT: hero video (optional, lazy) */}
              {hero?.video ? (
                <div className="order-first lg:order-none">
                  <LazyVideo src={hero.video} poster={hero.poster} alt={hero.alt} />
                </div>
              ) : null}
            </div>

            {/* Quick links */}
            {quickLinks.length > 0 && (
              <div className="mt-12">
                <div className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Accès rapide
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  {quickLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="group relative flex items-stretch gap-3 rounded-lg border bg-card transition hover:bg-accent"
                    >
                      {/* Image (optimized with next/image) */}
                      <div className="relative h-48 w-48 overflow-hidden shrink-0">
                        <Image
                          src={l.image?.src ?? '/media/fallback.jpg'}
                          alt={l.image?.alt ?? l.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 192px"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          priority={false}
                        />
                      </div>

                      {/* Text */}
                      <div className="flex min-w-0 flex-1 items-center pr-8">
                        <span className="truncate text-sm font-medium">{l.title}</span>
                      </div>

                      {/* Arrow */}
                      <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-lg border px-2 py-1 text-xs text-muted-foreground transition group-hover:translate-x-1 lg:flex">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
