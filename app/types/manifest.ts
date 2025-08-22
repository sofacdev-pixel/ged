// ---------- app/guide/types/manifest.ts ----------
export type ManifestSection = {
    id: string;
    title: string;
    file: string; // URL under /public or remote
    icon?: string;
    tags?: string[];
    order?: number;
  };
  
  export type GuideManifest = {
    title: string;
    version: number;
    sections: ManifestSection[];
  };
  