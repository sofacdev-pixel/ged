"use client";
import React from "react";

// ---------- Minimal OpenAI-style helpers ----------
function Container({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto w-full max-w-4xl px-4 py-10">{children}</main>;
}
function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{children}</h1>;
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{children}</h2>;
}
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={"rounded-2xl border bg-card text-card-foreground shadow-sm " + className}>{children}</div>;
}
function Note({ title = "Note", children }: { title?: string; children: React.ReactNode }) {
  return (
    <Card className="p-4 text-sm">
      <div className="font-medium mb-2">{title}</div>
      <div className="prose prose-sm dark:prose-invert max-w-none">{children}</div>
    </Card>
  );
}
function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border text-sm font-semibold">{n}</span>
      <div className="min-w-0 space-y-2 text-sm sm:text-base leading-relaxed">{children}</div>
    </li>
  );
}

// ---------- Content (data-driven to keep JSX tiny) ----------
const intro = {
  title: "Modification des documents avec Office Editor",
  p1: `Si votre administrateur configure Content Server pour fonctionner avec Office Editor, vous pouvez également ouvrir les documents à modifier dans Content Server. Pour cela, vous devez lancer une session de modification. Une session de modification exécute automatiquement pour vous les opérations suivantes :`,
  bullets1: [
    "Réservation du document et téléchargement d'un fichier temporaire sur votre ordinateur.",
    "Ouverture du fichier dans son programme de bureau associé afin que vous puissiez le modifier.",
  ],
  note1: `Office Editor ou Enterprise Connect doit être installé sur votre système pour vous permettre d'exécuter une session de modification.`,
  p2: `Votre administrateur peut configurer les paramètres qui déterminent quand le document est chargé pendant une session de modification. Suivant la configuration de votre système, l'une des actions suivantes se produit :`,
  bullets2: [
    "Lorsque vous fermez le document et la session de modification, une nouvelle version du document est chargée sur Content Server et la réservation du document est annulée.",
    "Chaque fois que vous enregistrez les modifications, une nouvelle version est chargée sur Content Server. À la fermeture, la réservation du document est annulée.",
  ],
  note2:
    "Pour tout document autre que Microsoft Office, vous devrez manuellement charger ou annuler la réservation une fois la session de modification terminée. Utilisez l'icône Éditeur Office dans la zone de notification pour ouvrir la boîte de dialogue Gérer les documents locaux et choisir l'action appropriée.",
};

const steps = [
  {
    n: 1,
    text: (
      <p>
        Dans le <span className="font-medium">menu Fonctions du document</span>, choisissez
        <span className="font-medium"> Modifier dans Office Application</span> ou
        <span className="font-medium"> Modifier avec le bureau</span>.
      </p>
    ),
    note:
      "Si l'administrateur a défini Office Editor comme éditeur principal, vous pouvez aussi cliquer sur le lien \"Modifier\" à côté du nom du document.",
  },
  {
    n: 2,
    text: <p>Une fois le document ouvert dans l'application bureautique associée, modifiez son contenu, puis enregistrez et fermez.</p>,
  },
  {
    n: 3,
    text: <p>Facultatif — pour voir vos modifications dans Content Server, actualisez le navigateur à la fin de la session.</p>,
  },
  {
    n: 4,
    text: (
      <div className="space-y-2">
        <p>
          Facultatif — dans certains cas, vous devrez <span className="font-medium">charger</span> ou
          <span className="font-medium"> annuler la réservation</span> manuellement :
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>
            Cliquez sur l'icône <span className="font-medium">Éditeur Office</span> dans la zone de notification.
            La boîte de dialogue <em>Gérer les documents locaux</em> s'ouvre.
          </li>
          <li>
            Choisissez l'action selon l'état du document : <strong>Finaliser</strong> (charge une nouvelle version et
            annule la réservation), <strong>Annuler la réservation</strong>, ou <strong>Télécharger</strong> (charge une
            nouvelle version sans changer l'état de réservation).
          </li>
        </ul>
      </div>
    ),
    note:
      "Vous pouvez résoudre les conflits de documents depuis l'icône Éditeur Office → \"Résoudre le conflit\" dans la boîte de dialogue Gérer les documents locaux.",
  },
];

const tip =
  "Astuce : si Office Editor est l’éditeur principal, vous pouvez aussi modifier un document depuis la page Vue d’ensemble (menu Fonctions du document → Vue d’ensemble → Modifier dans Office Application / Modifier avec le bureau).";

// ---------- Page ----------
export default function Page() {
  return (
    <Container>
      <div className="space-y-6">
        <H1>{intro.title}</H1>

        <p className="text-sm sm:text-base leading-relaxed">{intro.p1}</p>
        <ul className="list-disc pl-5 text-sm sm:text-base space-y-1">
          {intro.bullets1.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
        <Note>{intro.note1}</Note>

        <p className="text-sm sm:text-base leading-relaxed">{intro.p2}</p>
        <ul className="list-disc pl-5 text-sm sm:text-base space-y-1">
          {intro.bullets2.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
        <Note>{intro.note2}</Note>

        <H2>a. Pour modifier un document avec Office Editor :</H2>
        <ol className="space-y-5">
          {steps.map((s) => (
            <React.Fragment key={s.n}>
              <Step n={s.n}>{s.text}</Step>
              {s.note && (
                <div className="ml-[3.5rem]">
                  <Note>{s.note}</Note>
                </div>
              )}
            </React.Fragment>
          ))}
        </ol>

        <Card className="p-4 text-sm">
          <div className="font-medium mb-2">Astuce</div>
          <p>{tip}</p>
        </Card>
      </div>
    </Container>
  );
}