/**
 * A member, as a circle.
 *
 * Initials are the fallback, not a placeholder for one — this app has no photo
 * upload and probably never will, so initials on House Green *is* the avatar for
 * almost everyone. Deriving them here rather than at each call site means the
 * rule ("first letter of each of the first two words, uppercased") is stated
 * once and a one-word name does not crash it.
 *
 * The tier ring is the interesting part and the reason this is a brand component
 * rather than a chrome one: a Gold member's avatar carries `Tier.gold`, which is
 * the only place outside the Rewards screen that the tier is visible at all.
 * Pass `tier` and you get the ring; omit it and you get a plain disc.
 *
 * Not to be confused with `AvatarButton` in `screen-header.tsx`. That one is a
 * fixed 44pt header control with a white outer ring whose job is holding it off
 * the green band behind it. This one goes in list rows, account screens and
 * anywhere a member is named.
 */

import { type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Action, Radius, Sizes, Space, TextColor, TextStyles, Tier } from '@/theme';

type TierId = keyof typeof Tier;

type Props = {
   /** Full name. Initials are derived from it unless `initials` is given. */
   name?: string;
   /** Overrides the derived initials — one or two characters. */
   initials?: string;
   /** An `<Image>`, filling the disc. */
   image?: ReactNode;
   size?: number;
   /** Adds the tier ring. Omit for a plain disc. */
   tier?: TierId;
   style?: StyleProp<ViewStyle>;
};

export function Avatar({ name, initials, image, size = Sizes.tap, tier, style }: Props) {
   const label = initials ?? derive(name);
   /** Proportional so the ring reads the same at 32pt and at 72pt. */
   const ring = Math.max(2, Math.round(size / 18));

   return (
      <View
         accessibilityLabel={name}
         style={[
            styles.disc,
            { width: size, height: size, borderRadius: Radius.pill },
            tier ? { borderWidth: ring, borderColor: Tier[tier] } : null,
            style,
         ]}
      >
         {image ?? (
            <Text
               style={[styles.initials, { fontSize: Math.round(size / 2.8) }]}
               maxFontSizeMultiplier={1.1}
            >
               {label}
            </Text>
         )}
      </View>
   );
}

/** "Divayang Malseda" → "DM". "Prince" → "P". Nothing → the siren's stand-in. */
function derive(name?: string): string {
   if (!name) return '★';

   const words = name.trim().split(/\s+/).filter(Boolean);
   if (words.length === 0) return '★';

   return words
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
}

const styles = StyleSheet.create({
   disc: {
      backgroundColor: Action.selected,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: Space.xxs,
   },
   initials: {
      /**
       * Family only, never a `fontWeight` alongside it — the size is set
       * inline above, so this cannot spread a `TextStyles` entry.
       */
      fontFamily: TextStyles.bodyStrong.fontFamily,
      color: TextColor.onDark,
   },
});
