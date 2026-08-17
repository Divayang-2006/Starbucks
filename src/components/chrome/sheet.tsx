/**
 * The white sheet that slides up over the dark green header.
 *
 * This is the reference app's single strongest structural motif (§7) — Account,
 * Personal Information and Rewards all use it — so it lives here rather than
 * being redrawn per screen. The sheet rides *up over* the header band by
 * `SHEET_OVERLAP`, which is what makes the rounded corners read as one surface
 * passing behind another instead of two stacked blocks.
 *
 * `ScreenHeader` grows its bottom padding by the same constant when you tell it
 * a sheet follows, so the two always meet in the same place.
 */

import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Space, Surface } from '@/theme';

/** How far the sheet overlaps the band above it. Equal to the corner radius, so the curve is fully inside the green. */
export const SHEET_OVERLAP = Radius.sheet;

/**
 * The vertical gap between the sections inside a sheet.
 *
 * Five screens wrote this rule out by hand and four of them said `Space.xxl`;
 * `order.tsx` said `Space.lg` and nobody decided that. `Space.xxl` wins — the
 * majority is one reason, but the better one is that a section boundary in this
 * app is usually a *subject* change (rewards → promos → the menu), and 20pt
 * reads as "these two things are related" while 32pt reads as "these are two
 * things". Order's menu is the one place where the tighter rhythm was arguably
 * right; a screen that genuinely wants it passes `gap` rather than restating
 * the whole rule.
 */
export const SHEET_GAP = Space.xxl;

type Props = {
   children: ReactNode;
   /** Between direct children. Defaults to `SHEET_GAP` — override only with a reason. */
   gap?: number;
   style?: StyleProp<ViewStyle>;
};

export function Sheet({ children, gap = SHEET_GAP, style }: Props) {
   return <View style={[styles.sheet, { gap }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
   sheet: {
      marginTop: -SHEET_OVERLAP,
      /**
       * Cream, not white, even though §7 calls it a white sheet — every tab
       * screen fills it with white cards, and white-on-white would need an
       * outline on each one. Form screens (Personal Information) want the
       * literal white and can pass `style={{ backgroundColor: Surface.raised }}`.
       */
      backgroundColor: Surface.app,
      borderTopLeftRadius: Radius.sheet,
      borderTopRightRadius: Radius.sheet,
      paddingTop: Space.xl,
      /**
       * The sheet closes its own bottom. Every screen was appending the same
       * `paddingBottom` to stop the last section sitting flush against the
       * scroll's end — that is the sheet's business, not the screen's. Note this
       * is *not* clearance for the tab bar: the scroll view gets that from the
       * native bottom inset and nothing adds it by hand.
       */
      paddingBottom: Space.xxl,
      flexGrow: 1,
   },
});
