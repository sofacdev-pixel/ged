export type TocItem = {
    id: string;
    text: string;
    level: 1 | 2 | 3 | 4;
    children?: TocItem[];
  };