// app/content-server/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { contentServerPages } from "../../data/contentServerPages";

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Remarque
      </div>
      <div className="mt-2 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function ScreenshotFigure({
  src,
  alt = "Capture d’écran",
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}) {
  return (
    <figure className="space-y-2">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border bg-muted/20">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover"
        />
      </div>
      {caption ? (
        <figcaption className="text-xs text-muted-foreground text-center">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;              // ✅ Next 15: params is a Promise
  const data = contentServerPages[slug];

  if (!data) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm">Section introuvable.</p>
          </div>
          <Link
            href="/recherche/content-server"
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à Content Server
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground">
          <Link href="/recherche/content-server" className="underline underline-offset-2">
            Content Server
          </Link>{" "}
          / <span className="text-foreground">{data.title}</span>
        </nav>

        {/* Title + intro */}
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{data.title}</h1>
          {data.intro ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{data.intro}</p>
          ) : null}
        </header>

        {/* Screenshots */}
        {data.screenshots?.length ? (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.screenshots.map((s: any, i: number) => (
              <ScreenshotFigure key={i} src={s.src} alt={s.alt ?? "screenshot"} caption={s.caption} />
            ))}
          </section>
        ) : null}

        {/* Steps */}
        {data.steps?.length ? (
          <section className="space-y-3">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Étapes
            </div>
            <ol className="list-decimal pl-6 space-y-2 text-sm leading-relaxed">
              {data.steps.map((step: string, i: number) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>
        ) : null}

        {/* Notes */}
        {data.notes?.length ? (
          <Callout>
            <ul className="list-disc pl-5 space-y-1">
              {data.notes.map((note: string, i: number) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </Callout>
        ) : null}

        {/* Back */}
        <div>
          <Link
            href="/recherche/content-server"
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </div>
      </section>
    </main>
  );
}
