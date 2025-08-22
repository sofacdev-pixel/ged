export interface DossierManifestItem { slug: string; title: string; file: string }
export interface DossierManifest { default: string; items: DossierManifestItem[] }

export interface DossierStep { image: { src: string; alt: string }; caption: string }

export interface DossierCategory {
  slug: string;
  title: string;
  callout?: string;
  bestPractices?: string[];
  shortcuts?: { label: string; href: string }[];
  steps: DossierStep[];
}

export interface DossierData {
  title: string;
  subtitle?: string;
  categories: DossierCategory[];
}
