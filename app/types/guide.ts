export type HeadingLevel = "h1" | "h2" | "h3" | "h4";

export type Block =
  | { type: HeadingLevel; text: string; id?: string }
  | { type: "paragraph"; text: string }
  | { type: "note"; text: string }
  | { type: "list"; items: string[] }
  | { type: "number-list"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "callout"; text: string; title?: string; tone?: "info" | "success" | "warn" | "danger" | "tip"; icon?: string };
