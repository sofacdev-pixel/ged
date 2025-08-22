// app/recherche/advanced-search/page.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const productsTree = [
  { title: "Effectuer une recherche à l'aide de la recherche avancée", href: "/" },
  { title: "Créer un formulaire de recherche", href: "/" },
  { title: "Choisir un formulaire de recherche", href: "/" },
  { title: "Modifier un formulaire de recherche", href: "/" },
];

function ScreenshotFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <figure>
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border bg-muted/20">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-cover"
          // unoptimized // <- uncomment if sharp is flaky in dev
        />
      </div>
    </figure>
  );
}

function GuideLink({
  title,
  href,
  index,
}: {
  title: string;
  href: string;
  index: number;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center  justify-between gap-3 bg-card p-4 border   transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="  text-lg leading-tight">{title}</h3>
      </div>
      <ArrowRight
        size={16}
        className="opacity-60 transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto w-7xl py-10 px-6 lg:px-8 space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Recherche avancée</h1>
          <p className="text-sm text-muted-foreground">
            Utilisez des formulaires paramétrés et des critères précis pour trouver rapidement vos contenus.
          </p>
        </header>

        {/* Screenshot */}
        <ScreenshotFrame src="/image.png" alt="Interface de la recherche avancée" />

        {/* Guides list */}
        <section className="space-y-3 ">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Guides
          </div>
          <div className="grid grid-cols-2 mt-6 gap-8">
            {productsTree.map((item, i) => (
              <GuideLink key={item.title} title={item.title} href={item.href} index={i} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
