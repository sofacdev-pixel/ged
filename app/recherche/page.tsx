"use client";

import Link from "next/link";
import { FileSearch, Filter, FolderOpen, Save, Search, Plus, ArrowRight } from "lucide-react";

type RechercheLink = {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const features = [
  { icon: Search,     text: "Trouver les informations stockées dans Content Server qui vous intéressent." },
  { icon: FolderOpen, text: "Rechercher l’emplacement de documents, dossiers, discussions et autres éléments." },
  { icon: FileSearch, text: "Effectuer une recherche simple." },
  { icon: Filter,     text: "Lancer des recherches plus complexes à l’aide de requêtes." },
  { icon: Save,       text: "Une requête stocke vos critères et préférences d’affichage pour les réutiliser." },
];

const rechercheLinks: RechercheLink[] = [
  { title: "La barre de recherche Content Server", href: "/recherche/content-server",  icon: Search },
  { title: "Recherche avancée",                    href: "/recherche/advanced-search", icon: Filter },
  { title: "Utilisation des recherches enregistrées", href: "/recherche/registered-search", icon: Save },
];

function CardLink({ title, href, icon: Icon }: RechercheLink) {
  return (
    <Link
      href={href}
      className="group relative rounded border border-primary/20 p-5 transition-all hover:bg-primary/5 focus:outline-none"
      aria-label={title}
    >
      {/* top-left icon */}
      <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary/30 bg-transparent">
        <Icon className="h-5 w-5 text-primary" />
      </div>

      {/* title */}
      <h3 className="text-base font-medium leading-tight text-primary">{title}</h3>

      {/* footer actions */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-primary/70">Voir plus</span>
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 text-primary/80 transition-colors group-hover:bg-primary/10"
          >
            <Plus className="h-4 w-4" />
          </span>
         
        </div>
      </div>

      {/* subtle hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded ring-0 transition-[box-shadow] duration-200 group-hover:ring-1 group-hover:ring-primary/20" />
    </Link>
  );
}

export default function Recherche() {
  return (
    <main className="min-h-screen mx-auto">
      <div className="mx-auto w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Page heading */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-primary">La recherche</h1>
          <p className="mt-2 text-primary/70">
            Explorez les différentes façons de trouver rapidement vos contenus dans Content Server.
          </p>
        </header>

        {/* Modes */}
        <section className="mb-4">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-primary/70">
            Mode de recherche
          </h2>
        </section>

        {/* Cards (primary-only accents) */}
        <section className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3">
          {rechercheLinks.map((link) => (
            <CardLink key={link.href} {...link} />
          ))}
        </section>

        {/* Intro list */}
        <section className="mb-8">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-primary/70">
            Principales fonctionnalités
          </h2>
          <ul className="mt-4 grid gap-3">
            {features.map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-3 border-b border-primary/20 p-4 text-sm"
              >
                <feature.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-primary">{feature.text}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
