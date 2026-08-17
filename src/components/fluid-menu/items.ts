/**
 * The account menu, as data.
 *
 * The reference this is drawn from groups nine rows 6 · 2 · 1, and the grouping
 * carries meaning: things you own, things you read, and the way out. Ours keeps
 * the shape and swaps the contents for what `docs/APP_METADATA.md` §2 says lives
 * behind the avatar — Account is not a tab, so this list is the entire entrance
 * to everything that isn't Home, Gift, Order, Pay or Rewards.
 *
 * `group` is what draws the gaps. Rows are never separated by rules; the reference
 * uses whitespace and so do we.
 */

import type { GlyphId } from '@/components/chrome/glyphs';

/**
 * Every row's id, spelled out as a union rather than left as `string`.
 *
 * It exists so a consumer's destination table can be keyed on it and therefore
 * be exhaustive: adding a row below without deciding where it goes is a compile
 * error in `src/app/(tabs)/_layout.tsx`, not a row that silently does nothing.
 * That matters here more than it usually would — four of the nine have no
 * destination yet, so "does nothing" is a state this list is already in and
 * cannot be allowed to drift further into.
 */
export type MenuItemId =
   | 'profile'
   | 'pay'
   | 'gift'
   | 'subscription'
   | 'stores'
   | 'rewards'
   | 'stories'
   | 'support'
   | 'logout';

export type MenuItem = {
   id: MenuItemId;
   label: string;
   glyph: GlyphId;
   /** Rows sharing a number sit together; a change of number is a gap. */
   group: number;
   /** Rendered in `Status.error`, and always last. */
   destructive?: boolean;
};

export const MENU_ITEMS: readonly MenuItem[] = [
   { id: 'profile', label: 'Profile', glyph: 'person', group: 1 },
   { id: 'pay', label: 'Starbucks Pay', glyph: 'pay', group: 1 },
   { id: 'gift', label: 'Gift Cards', glyph: 'gift', group: 1 },
   { id: 'subscription', label: 'Beverage Subscription', glyph: 'crown', group: 1 },
   { id: 'stores', label: 'Store Locator', glyph: 'pin', group: 1 },
   { id: 'rewards', label: 'Rewards & Stars', glyph: 'rewards', group: 1 },

   { id: 'stories', label: 'Coffee Stories', glyph: 'article', group: 2 },
   { id: 'support', label: 'Help & Support', glyph: 'heart', group: 2 },

   { id: 'logout', label: 'Log Out', glyph: 'arrowLeft', group: 3, destructive: true },
];
