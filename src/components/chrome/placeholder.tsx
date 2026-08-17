/**
 * Honest holes.
 *
 * These stand in for content that isn't built yet — a product photo, an
 * autoplaying video card, a tier gauge. They are recessed `Surface.sunken`
 * rather than grey skeleton bars, so a half-finished screen still reads as this
 * app rather than as a loading state, and an optional caps label says out loud
 * what belongs in the slot instead of leaving the reader to guess.
 *
 * Every one of these is meant to be deleted by the screen that fills it in.
 *
 * **On the radius.** The audit found four different corner radii applied to this
 * one primitive, which made four identical grey rectangles look like four
 * different components. The rule, and the default below, is by role rather than
 * by taste:
 *
 * | Role | Radius |
 * |---|---|
 * | Media inside a card — a product photo, an article head | `Radius.lg` (default) |
 * | A block that *is* the card — an empty transaction list | `Radius.xl` |
 * | A small inline slot — the QR square on the Pay card | `Radius.md` |
 * | A disc — a category button, the tier gauge | `Radius.pill` |
 *
 * Anything outside that table is a fifth radius and needs a reason.
 */

import { type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Rail } from './rail';

import { CapsKicker } from './screen-header';

import { Radius, Space, Surface, TextColor } from '@/theme';

type BlockProps = {
   /** ALL-CAPS name of what goes here. Omit for small slots where a label would crowd. */
   label?: string;
   height: number;
   radius?: number;
   style?: StyleProp<ViewStyle>;
};

export function PlaceholderBlock({ label, height, radius = Radius.lg, style }: BlockProps) {
   return (
      <View style={[styles.block, { height, borderRadius: radius }, style]}>
         {label ? <Text style={styles.blockLabel}>{label}</Text> : null}
      </View>
   );
}

type RailProps = {
   children: ReactNode;
};

/**
 * Kept as the name five sections already call. It is `Rail` with its defaults —
 * new code should use `Rail` directly, which can also snap.
 */
export function PlaceholderRail({ children }: RailProps) {
   return <Rail>{children}</Rail>;
}

const styles = StyleSheet.create({
   block: {
      backgroundColor: Surface.sunken,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Space.md,
   },
   blockLabel: {
      ...CapsKicker,
      textAlign: 'center',
      color: TextColor.tertiary,
   },
});
