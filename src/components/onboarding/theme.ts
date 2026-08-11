/**
 * Design tokens + geometry for the Starbucks onboarding flow.
 *
 * Every number the animation depends on lives here so the motion code stays
 * readable. If the card lands slightly off inside the wallet on your device,
 * CARD_DROP and POCKET_TOP are the two knobs to turn.
 */

/**
 * Chrome colours for this flow only.
 *
 * TODO: migrate onto the app tokens in `@/theme`. Held back deliberately —
 * two values differ from the decided palette (`cream` #F2F0EB vs
 * `Surface.app` #F7F5F0, `ink` #1E3932 vs `TextColor.primary` #14231E), so
 * the swap is a visual change to a finely-tuned animation, not a rename.
 */
export const Palette = {
   cream: "#F2F0EB",
   creamShade: "#E2DDD1",
   ink: "#1E3932",
   inkSoft: "#5C6D66",

   // Card face colours now live per-edition in `cardStyles.ts` — this palette
   // is the surrounding app chrome only.
   screenGreen: "#006241",
   screenGreenDeep: "#003322",

   pocket: "#0E362A",
   pocketEdge: "#052018",

   white: "#FFFFFF",
   disabled: "#D9D3C4",
} as const;

export const CARD = {
   width: 236,
   height: 148,
   radius: 14,
} as const;

/** Vertical playground the card travels through. */
export const STAGE_HEIGHT = 300;

/** Where the card starts, and how far it falls into the wallet. */
export const CARD_TOP = 8;
export const CARD_DROP = 120;
export const CARD_END_SCALE = 0.9;

/**
 * How the card reacts while a field is focused. These are *deltas* layered on
 * top of whatever the journey animation is already doing, not absolute
 * values — see `cardStyle` in OnboardingFlow.
 */
export const CARD_FOCUS = {
   /** Multiplied into the journey scale. 1.44 = 44% bigger. */
   scale: 1.44,
   /** Added to the journey translateY. Negative lifts it up the screen. */
   lift: 0,
   /** Added to the journey translateX. Positive slides it right. */
   leftSlide: 0,
   /** Added to the journey rotation, so -7deg becomes 0: it squares up. */
   straighten: 7,
} as const;

/** Geometry of the printed back. */
export const CARD_BACK = {
   stripeTop: 13,
   stripeHeight: 30,
   pad: 14,
   panelRadius: 3,
} as const;

/** Wallet is two pieces: a back panel and a front panel with the curved lip. */
export const WALLET = {
   width: 252,
   backTop: 120,
   backHeight: 168,
   frontTop: 164,
   frontHeight: 124,
   radius: 16,
   /** How far the front panel's top edge dips in the middle. */
   lipDip: 24,
} as const;

/**
 * `2510` -> `25/10`, `25101991` -> `25/10/1991`.
 *
 * Rebuilt from the digit string on every keystroke rather than patched in
 * place. That is what makes backspace behave: deleting the `1` from `25/10/1`
 * leaves `2510`, which reformats to `25/10` — the separator leaves with the
 * digit instead of stranding the caret behind it.
 */
export function formatDob(digits: string): string {
   const d = digits.slice(0, 8);
   let out = d.slice(0, 2);
   if (d.length > 2) out += `/${d.slice(2, 4)}`;
   if (d.length > 4) out += `/${d.slice(4, 8)}`;
   return out;
}

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Rejects `35/13/1850` without pulling in a date library. February is allowed
 * 29 days in every year — a birthday field is not the place to argue with
 * someone about whether they were born in a leap year.
 */
export function isRealDob(digits: string): boolean {
   if (digits.length !== 8) return false;
   const day = Number(digits.slice(0, 2));
   const month = Number(digits.slice(2, 4));
   const year = Number(digits.slice(4, 8));
   if (month < 1 || month > 12) return false;
   if (day < 1 || day > DAYS_IN_MONTH[month - 1]) return false;
   return year >= 1900 && year <= new Date().getFullYear();
}

/** `9876543210` -> `98765 43210`. One line to change for other markets. */
export function formatPhone(digits: string): string {
   const d = digits.slice(0, 10);
   return d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
}

const NUMBER_BLANK = "XXXX";

function group(seed: string): string {
   if (!seed) return NUMBER_BLANK;
   let h = 7;
   for (let i = 0; i < seed.length; i++) {
      h = (h * 31 + seed.charCodeAt(i)) % 10000;
   }
   return String(h).padStart(4, "0");
}

/**
 * The member number is the progress bar. Each group is derived from one field,
 * so a block of XXXX resolves into digits the moment that field is answered —
 * the card visibly finishing itself, rather than a bar filling up beside it.
 */
export function memberNumber(seeds: string[]): string {
   return ["4471", ...seeds.map(group)].join(" ");
}
