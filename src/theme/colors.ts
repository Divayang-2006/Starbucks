/**
 * Colour tokens.
 *
 * Two layers. `Brand` holds raw values and is *not* meant to be read from
 * components — it exists so the semantic groups below have one place to point
 * at. Screens and components import the semantic groups (`Surface`, `Text`,
 * `Accent`, …) so a value can move without a find-and-replace.
 *
 * Light only. The reference app ships no dark mode, and a grey inversion of a
 * cream palette looks like a different product — if a night theme happens it
 * will be a deliberate "Reserve" identity, not a computed inverse.
 *
 * Contrast ratios in the comments are measured against `Surface.app`
 * (#F7F5F0) unless stated otherwise.
 */

/** Raw brand values. Reach for the semantic groups instead. */
const Brand = {
   /** Primary action green. 7.5:1 with white on top. */
   green: '#006241',
   /** House Green — headers, tab bar, selected pills, sheet backdrops. */
   house: '#1E3932',
   /** Brighter green for positive states and illustration, never for text. */
   bright: '#00A862',
   /** Deepest green-black. Reserve tier, scrim ends. */
   espresso: '#0B1F1A',
   /** Pale green wash for tint fills and progress tracks. */
   mint: '#D4E9E2',

   white: '#FFFFFF',
   cream: '#F7F5F0',
   creamSunken: '#EFECE5',
   creamEdge: '#E3DFD6',
} as const;

export const Surface = {
   /** App background. Warm cream — never a grey-white. */
   app: Brand.cream,
   /** Cards and the 28pt-radius sheet that slides over the green header. */
   raised: Brand.white,
   /** Recessed regions: the PDP "customise" area, unselected chips. */
   sunken: Brand.creamSunken,
   /** Dark green sections — headers, tab bar, sticky bars. */
   inverse: Brand.house,
   /** Deepest inverse, for scrims over photography. */
   inverseDeep: Brand.espresso,
   /** Tinted fill behind selected chips and progress tracks. */
   tint: Brand.mint,
   /**
    * Translucent white, for a control or a slot drawn *on* a green surface —
    * the round header buttons, the QR block on the Pay card, the tab bar's
    * travelling capsule.
    *
    * Same family as `Border.hairOnDark` and it exists for the same reason: on
    * an inverse surface you tint the surface itself rather than reaching for a
    * lighter opaque colour, because an opaque tile has an edge that shifts as
    * soon as the green behind it does. Alpha, not a hex, is the whole point.
    */
   onDarkFill: 'rgba(255,255,255,0.14)',
} as const;

/** Named `TextColor`, not `Text`, so it never collides with RN's `Text`. */
export const TextColor = {
   /** Green-black rather than pure black — #000 buzzes on cream. 15:1. */
   primary: '#14231E',
   /** 5.2:1. Replaces the reference app's #7C7C7C, which fails AA at 3.6:1. */
   secondary: '#5C6A65',
   /** 3.7:1 — placeholders, disabled text, and >=18pt only. Never body copy. */
   tertiary: '#79817E',
   /** On green surfaces. */
   onDark: Brand.white,
   onDarkMuted: 'rgba(255,255,255,0.72)',
   /** Text that is itself an action, on light surfaces. */
   action: Brand.green,
} as const;

export const Border = {
   /** Underline-style fields, list separators. */
   hair: Brand.creamEdge,
   /** Same weight over a dark green surface. */
   hairOnDark: 'rgba(255,255,255,0.16)',
   /** Chip and card outlines that need to read as a real edge. */
   strong: '#CFC9BC',
} as const;

export const Action = {
   primary: Brand.green,
   primaryPressed: '#004E34',
   primaryDisabled: '#B9C6BF',
   /** Selected chips and toggles use House Green, not the CTA green. */
   selected: Brand.house,
   onPrimary: Brand.white,
} as const;

export const Accent = {
   /** Stars and Gold tier. */
   gold: '#CBA258',
   goldSoft: '#F0E2C0',
   /** Refer & Reap and other tan promo cards. */
   tan: '#E5D3B3',
   /** Food and roast cues. */
   caramel: '#9D5116',
} as const;

export const Status = {
   success: '#007A4D',
   /** Log Out and other destructive rows. */
   error: '#C0362C',
   /**
    * `error` on House Green is 2.3:1 — it fails even the 3:1 floor for icons, let
    * alone text, so a destructive row on a dark surface needs its own value. This
    * is 7.4:1 on `Surface.inverse`. Same signal, legible.
    */
   errorOnDark: '#FF9B8F',
   warning: '#B26B00',
   info: Brand.house,
} as const;

/** FSSAI-mandated indicators. Non-negotiable colours, do not restyle. */
export const Diet = {
   veg: '#0A8A3C',
   nonVeg: '#B0332B',
} as const;

export const Tier = {
   green: Brand.green,
   gold: Accent.gold,
   reserve: Brand.espresso,
   /** Reserve's metallic accent, used on the tier gauge and card. */
   reserveMetal: '#B0703C',
} as const;

/**
 * Per-family accents for the "the product brings its own colour" rule.
 *
 * Scope is deliberately narrow — a drink family may tint **only** the PDP hero
 * scrim, that screen's section rules, its selected option chips, and the
 * favourite heart. The tab bar, the sticky Add-to-Cart bar, and every CTA stay
 * brand green. Merch, At-Home Coffee and Food have no accent on purpose: the
 * idea reads as intentional only while it stays confined to drinks.
 *
 * Every `base` clears 4.5:1 on cream, so it is safe for chip labels and meta
 * text. `deep` is for gradient ends and scrims; `tint` for fills.
 */
export const CategoryAccent = {
   espresso: { base: '#9D5116', deep: '#5A2C0B', tint: '#F5E7D8' },
   coldBrew: { base: '#5B3A29', deep: '#33200F', tint: '#EFE4DC' },
   frappuccino: { base: '#7E5B86', deep: '#43294A', tint: '#EFE6F1' },
   matcha: { base: '#3E7C59', deep: '#1F4530', tint: '#E1EFE5' },
   refresher: { base: '#B23A5C', deep: '#671E33', tint: '#F7E2E7' },
   /** Fallback for anything unmapped, and for all non-drink categories. */
   default: { base: Brand.house, deep: Brand.espresso, tint: Brand.mint },
} as const;

export type CategoryAccentId = keyof typeof CategoryAccent;

/**
 * Shadows are green-tinted, never neutral black. Grey shadows on a cream
 * surface are the single clearest tell of a cheap clone.
 */
export const Elevation = {
   card: {
      shadowColor: Brand.house,
      shadowOpacity: 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
   },
   sheet: {
      shadowColor: Brand.house,
      shadowOpacity: 0.14,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: -6 },
      elevation: 8,
   },
   floating: {
      shadowColor: Brand.house,
      shadowOpacity: 0.18,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
   },
} as const;
