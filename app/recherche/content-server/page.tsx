// app/content-server/page.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// You can move this to /data/contentServerSections.ts later if you prefer
const contentServerSections = [
  { title: "Recherche par numéro d’affaire", slug: "numero-affaire" },
  { title: "Recherche par numéro tiers", slug: "numero-tiers" },
  { title: "Recherche rapport réclamation", slug: "rapport-reclamation" },
  { title: "Recherche réclamation par numéro de ticket", slug: "reclamation-ticket" },
];

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
          // If sharp crashes locally, uncomment:
          // unoptimized
        />
      </div>
    </figure>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">
            La barre de recherche Content Server
          </h1>
          <p className="mt-2 text-muted-foreground">
            Comprendre les éléments clés, lancer des recherches simples ou via formulaires, et accéder aux guides détaillés.
          </p>
        </header>

        {/* Screenshot */}
        <ScreenshotFrame src="/image.png" alt="Barre de recherche — capture" />

        {/* Aperçu des éléments */}
        <section className="space-y-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Aperçu
          </div>
          <p className="text-sm leading-relaxed">
            La barre de recherche apparaît par défaut sur la plupart des pages, à droite de la barre de menu.
            Éléments (de gauche à droite) :
          </p>

          <ul className="grid gap-2">
            <li className="rounded-lg border bg-card p-3 text-sm">
              Le texte <em>Rechercher</em>
            </li>
            <li className="rounded-lg border bg-card p-3 text-sm">
              La zone <em>Rechercher à partir d&apos;ici</em>
            </li>
            <li className="rounded-lg border bg-card p-3 text-sm">
              Le bouton <em>Exécuter la recherche</em>
            </li>
            <li className="rounded-lg border bg-card p-3 text-sm">
              La flèche <em>Ouvrir/fermer le panneau de recherche</em> pour développer/réduire les options
            </li>
          </ul>
        </section>

        {/* Étape 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-medium leading-tight">
            1. Effectuer une recherche depuis la barre
          </h2>
          <ol className="list-decimal pl-6 text-sm leading-relaxed">
            <li>Renseignez vos critères dans le champ <em>Rechercher</em>.</li>
            <li>Cliquez sur <em>Exécuter la recherche</em>.</li>
          </ol>
        </section>

        {/* Formulaires */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium leading-tight">
            2. Rechercher à l’aide de formulaires
          </h2>
          <p className="text-sm leading-relaxed">
            L’administrateur peut paramétrer des formulaires selon les besoins métier : clés uniques
            (N° offre, N° d’affaire, N° tiers), type de dossier/document, famille de crédit, etc.
          </p>
          <p className="text-sm leading-relaxed">
            Tous les utilisateurs peuvent lancer une recherche depuis leurs espaces.
          </p>

          <ScreenshotFrame src="/image.png" alt="Formulaires — liste déroulante" />

          <p className="text-sm leading-relaxed">
            Pour lancer une recherche via les formulaires, choisissez <em>Autres formulaires</em> après avoir
            cliqué dans la barre de recherche sur l’espace utilisateur. La liste des formulaires paramétrés s’affiche.
          </p>

          <ScreenshotFrame src="/image.png" alt="Formulaires — exemple" />
        </section>

        {/* Guides détaillés */}
        <section className="space-y-3">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Guides détaillés
          </div>

          <div className="grid grid-cols-1 gap-3">
            {contentServerSections.map((s, i) => (
              <Link
                key={s.slug}
                href={`/recherche/content-server/${s.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-medium leading-tight">{s.title}</h3>
                </div>
                <ArrowRight
                  size={16}
                  className="opacity-60 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Remarques */}
        <section className="space-y-4">
          <Callout>
            <ul className="list-disc pl-5 space-y-1">
              <li>L’utilisateur peut consulter tout le contenu d’un dossier trouvé en naviguant dans ses sous-dossiers.</li>
              <li>Un message de notification est retourné si le numéro d’affaire saisi est incorrect.</li>
            </ul>
          </Callout>
          <Callout>
            Les autres formulaires fonctionnent de la même façon et facilitent la recherche.
          </Callout>
        </section>
      </section>
    </main>
  );
}
