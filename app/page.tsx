'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

// ---------- Types tied to JSON structure ----------
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

export default function Home() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load UI content from JSON so it's editable without code changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/pages/home.json', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: HomeData) => {
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      })
      .catch((e) => !cancelled && setError(e.message || 'Erreur inconnue'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // ⌘K / Ctrl+K focuses the search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/recherche?query=${encodeURIComponent(query)}` : '/recherche');
  };

  const useSuggestion = (s: string) => {
    setQ(s);
    inputRef.current?.focus();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* soft background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/10),transparent_50%)]"
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Loading / Error */}
        {loading && (
          <div className="text-center text-sm text-muted-foreground">Chargement…</div>
        )}
        {error && !loading && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm">
            Impossible de charger le contenu. <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Content */}
        {data && (
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
                <form onSubmit={onSubmit} className="relative">
                  <div className="group relative flex items-center rounded-2xl border bg-accent/50 px-4 py-3 transition-colors hover:bg-accent">
                    <SearchIcon className="mr-3 h-5 w-5 text-muted-foreground" />
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
                {data.suggestions?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {data.suggestions.map((s) => (
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

              {/* RIGHT: hero video (optional) */}
              {data.hero?.video ? (
                <div className="order-first lg:order-none">
                  <div className="relative overflow-hidden rounded-2xl border bg-card">
                    <div className="relative aspect-video w-full">
                      <video
                        className="h-full w-full object-cover"
                        src={data.hero.video}
                        poster={data.hero.poster}
                        playsInline
                        muted
                        autoPlay
                        loop
                        preload="none"
                        aria-label={data.hero.alt || 'Vidéo de présentation'}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Quick links */}
            {data.quickLinks?.length > 0 && (
              <div className="mt-12">
                <div className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Accès rapide
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  {data.quickLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="group relative flex items-stretch gap-3   bg-card  transition hover:bg-accent"
                    >
                      {/* Image */}
                      <div className="relative h-48 w-48 overflow-hidden ">
                        <img
                          src={l.image?.src ?? '/media/fallback.jpg'}
                          alt={l.image?.alt ?? l.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </div>

                      {/* Text */}
                      <div className="flex min-w-0 flex-1 items-center pr-8">
                        <span className="truncate text-sm font-medium">
                          {l.title}
                        </span>
                      </div>

                      {/* Arrow */}
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border px-2 py-1 text-xs text-muted-foreground transition group-hover:translate-x-1">
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
