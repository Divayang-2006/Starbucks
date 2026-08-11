/**
 * The card editions. All five are Starbucks greens — the brand never leaves
 * the family, the picker just moves through it: bright house green out to a
 * near-black Reserve.
 *
 * Hard constraint: white must stay legible on the face and ink on the cream
 * signature panel — so every edition is dark-to-mid, no pale or high-chroma
 * backgrounds.
 */

export type CardStyleId = "house" | "forest" | "jade" | "sage" | "reserve";
export type PatternId = "arcs" | "hairlines" | "dots";

export type CardStyle = {
   id: CardStyleId;
   name: string;
   /** Front gradient, top-left to bottom-right. */
   face: readonly [string, string];
   /** Back gradient. Always a couple of stops darker than the face. */
   back: readonly [string, string];
   magstripe: string;
   pattern: PatternId;
   /** Flat colour for the picker dot. */
   swatch: string;
};

export const CARD_STYLES: readonly CardStyle[] = [
   {
      id: "house",
      name: "House",
      face: ["#00754A", "#002E1F"],
      back: ["#005C3A", "#001B12"],
      magstripe: "#001108",
      pattern: "arcs",
      swatch: "#006241",
   },
   {
      id: "forest",
      name: "Forest",
      face: ["#28463C", "#0C1A15"],
      back: ["#1C332B", "#060F0C"],
      magstripe: "#030A08",
      pattern: "hairlines",
      swatch: "#1E3932",
   },
   {
      id: "jade",
      name: "Jade",
      face: ["#118F66", "#04402C"],
      back: ["#0B6B4B", "#022A1C"],
      magstripe: "#021911",
      pattern: "dots",
      swatch: "#118F66",
   },
   {
      id: "sage",
      name: "Sage",
      face: ["#5F7E6E", "#233830"],
      back: ["#465F52", "#141F1A"],
      magstripe: "#0C1310",
      pattern: "arcs",
      swatch: "#5F7E6E",
   },
   {
      id: "reserve",
      name: "Reserve",
      face: ["#233B32", "#0A100D"],
      back: ["#182B24", "#050807"],
      magstripe: "#040605",
      pattern: "hairlines",
      swatch: "#233B32",
   },
] as const;

export const DEFAULT_STYLE_ID: CardStyleId = "house";

export const STYLE_BY_ID = Object.fromEntries(
   CARD_STYLES.map((s) => [s.id, s]),
) as Record<CardStyleId, CardStyle>;
