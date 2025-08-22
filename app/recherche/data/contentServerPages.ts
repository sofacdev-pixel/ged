// data/contentServerPages.ts

export type GuideSection = {
    title: string;
    intro?: string;
    screenshots?: { src: string; alt?: string; caption?: string }[];
    steps?: string[];
    notes?: string[];
  };
  
  export const contentServerPages: Record<string, GuideSection> = {
    "numero-affaire": {
      title: "Recherche par numéro d’affaire",
      intro:
        "Ce formulaire permet de rechercher un dossier dans la GED à l’aide d’un numéro d’affaire unique.",
      screenshots: [
        { src: "/image.png", alt: "Formulaire recherche par numéro d’affaire" },
        { src: "/image.png", alt: "Résultat de recherche par numéro d’affaire" },
      ],
      steps: [
        "Choisir un formulaire et cliquer dessus, exemple « recherche par numéro d’affaire ».",
        "Saisir un numéro d’affaire puis cliquer sur le bouton « Rechercher ».",
        "Le système retourne le dossier du numéro d’affaire trouvé dans la base GED.",
      ],
      notes: [
        "L’utilisateur peut consulter tout le contenu du dossier trouvé en naviguant dans les sous-dossiers.",
        "Un message de notification est affiché si le numéro d’affaire saisi est incorrect.",
      ],
    },
  
    "numero-tiers": {
      title: "Recherche par numéro tiers",
      intro:
        "Ce formulaire permet la recherche par identifiants tiers (tiers client, tiers payeur ou tiers caution).",
      screenshots: [
        { src: "/image.png", alt: "Formulaire recherche par numéro tiers" },
        { src: "/image.png", alt: "Page des résultats pour numéro tiers" },
      ],
      steps: [
        "Saisir un des trois numéros (client, payeur, ou caution) puis lancer la recherche.",
        "Le résultat de la recherche est retourné dans une autre page avec les dossiers associés.",
      ],
    },
  
    "rapport-reclamation": {
      title: "Recherche rapport réclamation",
      intro:
        "Ce formulaire est dédié à la recherche des rapports de réclamations déjà classés dans la GED.",
      screenshots: [
        { src: "/image.png", alt: "Formulaire rapport réclamation" },
        { src: "/image.png", alt: "Résultat de recherche rapport réclamation" },
      ],
      steps: [
        "Choisir dans la liste des formulaires « Recherche rapport réclamation ».",
        "Spécifier l’année de recherche puis lancer la recherche (vous pouvez ajouter d’autres paramètres pour plus de précision).",
        "Consulter les résultats retournés dans la page dédiée.",
      ],
    },
  
    "reclamation-ticket": {
      title: "Recherche réclamation par numéro de ticket",
      intro:
        "Ce formulaire permet de retrouver une réclamation précise à l’aide de son numéro de ticket.",
      screenshots: [
        { src: "/image.png", alt: "Formulaire réclamation par ticket" },
        { src: "/image.png", alt: "Dossier de réclamation correspondant au ticket" },
      ],
      steps: [
        "Choisir dans la liste « Recherche réclamation ».",
        "Saisir un numéro de ticket puis lancer la recherche.",
        "Le système retourne le bon dossier si le numéro du ticket est correct.",
      ],
      notes: [
        "Les autres formulaires fonctionnent de la même façon et facilitent la recherche.",
      ],
    },
  };
  