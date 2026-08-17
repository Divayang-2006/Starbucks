/**
 * The universal row, and the single biggest thing the screens were rebuilding.
 *
 * A payment mode, a corporate-gifting teaser, a product in the menu, an account
 * menu item, a transaction, a tier benefit — all of them are: something on the
 * left, a stack of text, something on the right. Six near-identical
 * implementations existed because each screen only ever saw its own one.
 *
 * The slots are deliberately `ReactNode` rather than typed variants. A leading
 * slot that enumerates `glyph | thumb | avatar | dot` has to grow a case every
 * time a new screen lands, and the union is never the interesting part — the row
 * is. Callers pass the thing.
 *
 * `children` is the fourth slot and the one that is easy to miss: it renders
 * *under* the text stack, inside the text column, which is what a product row's
 * price-and-add foot needs. Without it a product row cannot be a `ListRow` and
 * you are back to a seventh implementation.
 *
 * The separator is a `borderTopWidth`, not a `<Divider>` child, so the row stays
 * a single flex node — but it is the same hairline and the same two tokens.
 * `ListSection` sets `divided` for you; setting it by hand on the first row of a
 * group is the classic way to end up with a rule under a section header.
 */

import { type ReactNode } from 'react';
import {
   Pressable,
   StyleSheet,
   Text,
   View,
   type StyleProp,
   type ViewStyle,
} from 'react-native';

import { Card } from './card';
import { Glyph } from './glyphs';
import { CapsKicker } from './screen-header';

import {
   Border,
   IconSize,
   Pressed,
   Sizes,
   Space,
   Status,
   TextColor,
   TextStyles,
} from '@/theme';

type Props = {
   title: string;
   /** ALL-CAPS meta above the title — a category, a transaction kind, a product's size line. */
   kicker?: string;
   subtitle?: string;
   /** Glyph, thumbnail, avatar, dot. Anything, at whatever size it wants to be. */
   leading?: ReactNode;
   /** Price, badge, switch, stepper. Suppresses the default chevron. */
   trailing?: ReactNode;
   /** Rendered under the text stack, inside the text column. */
   children?: ReactNode;
   /**
    * How the kicker is set. `caps` is the label voice — `CURRENT ITEM`, `FEATURED`
    * — and is the default because that is what a kicker usually is.
    *
    * `micro` is for a kicker that is *data* rather than a label: `354 ml · 210
    * kcal` sits in the kicker slot, but uppercasing it gives `354 ML`, and `ML`
    * is not the symbol for a millilitre. It also matches what the same string is
    * set in outside a row, which is the actual bug this exists to prevent — one
    * product reading two ways depending on whether it is in a rail or a list.
    */
   kickerStyle?: 'caps' | 'micro';
   /** Force the chevron on or off. Defaults on for a pressable row with no `trailing`. */
   chevron?: boolean;
   /** Hairline along the top edge. `ListSection` manages this. */
   divided?: boolean;
   tone?: 'light' | 'inverse';
   /** Destructive rows — Log Out. Uses the on-dark error colour when inverse. */
   destructive?: boolean;
   /** `card` puts the row on its own white card, for a rail or a standalone teaser. */
   surface?: 'plain' | 'card';
   /**
    * `top` once the leading slot is taller than one line of text. `stretch` when
    * the leading slot has to span the row's full height — a timeline connector
    * running between consecutive rows is the case that needs it, and without
    * this it can only be faked with a negative margin at the call site.
    */
   align?: 'center' | 'top' | 'stretch';
   /** Off when the parent already insets the row horizontally. */
   inset?: boolean;
   onPress?: () => void;
   accessibilityLabel?: string;
   style?: StyleProp<ViewStyle>;
};

export function ListRow({
   title,
   kicker,
   kickerStyle = 'caps',
   subtitle,
   leading,
   trailing,
   children,
   chevron,
   divided = false,
   tone = 'light',
   destructive = false,
   surface = 'plain',
   align = 'center',
   inset = true,
   onPress,
   accessibilityLabel,
   style,
}: Props) {
   const inverse = tone === 'inverse';
   const onCard = surface === 'card';
   const showChevron = chevron ?? (Boolean(onPress) && trailing === undefined);

   const content = (
      <>
         {leading}

         <View style={styles.text}>
            {kicker ? (
               <Text
                  style={[
                     kickerStyle === 'caps' ? styles.kicker : styles.kickerMicro,
                     inverse && styles.kickerInverse,
                  ]}
                  numberOfLines={1}
               >
                  {kicker}
               </Text>
            ) : null}

            <Text
               style={[
                  styles.title,
                  inverse && styles.titleInverse,
                  destructive && (inverse ? styles.titleErrorInverse : styles.titleError),
               ]}
               numberOfLines={2}
               maxFontSizeMultiplier={1.3}
            >
               {title}
            </Text>

            {subtitle ? (
               <Text
                  style={[styles.subtitle, inverse && styles.subtitleInverse]}
                  numberOfLines={2}
               >
                  {subtitle}
               </Text>
            ) : null}

            {children}
         </View>

         {trailing}

         {showChevron ? (
            <Glyph
               id="chevronRight"
               size={IconSize.sm}
               color={inverse ? TextColor.onDarkMuted : TextColor.tertiary}
            />
         ) : null}
      </>
   );

   const frame: StyleProp<ViewStyle> = [
      styles.row,
      align === 'top' && styles.rowTop,
      align === 'stretch' && styles.rowStretch,
      // A card supplies its own padding; doubling it makes the row look inset twice.
      !onCard && inset && styles.rowInset,
      divided && !onCard && (inverse ? styles.dividedInverse : styles.divided),
   ];

   if (onCard) {
      return (
         <Card onPress={onPress} accessibilityLabel={accessibilityLabel ?? title} style={style}>
            <View style={frame}>{content}</View>
         </Card>
      );
   }

   if (!onPress) {
      return <View style={[frame, style]}>{content}</View>;
   }

   return (
      <Pressable
         accessibilityRole="button"
         accessibilityLabel={accessibilityLabel ?? title}
         onPress={onPress}
         style={({ pressed }) => [frame, pressed && styles.pressed, style]}
      >
         {content}
      </Pressable>
   );
}

const styles = StyleSheet.create({
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.base,
      minHeight: Sizes.tap,
   },
   rowTop: {
      alignItems: 'flex-start',
   },
   rowStretch: {
      alignItems: 'stretch',
   },
   rowInset: {
      paddingHorizontal: Space.base,
      paddingVertical: Space.md,
   },
   divided: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Border.hair,
   },
   dividedInverse: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Border.hairOnDark,
   },

   text: {
      flex: 1,
      gap: Space.xxs,
   },
   kicker: {
      ...CapsKicker,
      color: TextColor.secondary,
   },
   /** Same slot, same size, no transform — see `kickerStyle`. */
   kickerMicro: {
      ...TextStyles.micro,
      color: TextColor.secondary,
   },
   kickerInverse: {
      color: TextColor.onDarkMuted,
   },
   /**
    * Semibold, not regular. A row title shares its line with a chevron or a
    * price, and at regular weight the trailing element wins the glance.
    * `pay.tsx` set these in `TextStyles.body`; this is the unification.
    */
   title: {
      ...TextStyles.bodyStrong,
      color: TextColor.primary,
   },
   titleInverse: {
      color: TextColor.onDark,
   },
   titleError: {
      color: Status.error,
   },
   /** `Status.error` is 2.3:1 on House Green. See DESIGN_SYSTEM "Added since". */
   titleErrorInverse: {
      color: Status.errorOnDark,
   },
   subtitle: {
      ...TextStyles.bodySm,
      color: TextColor.secondary,
   },
   subtitleInverse: {
      color: TextColor.onDarkMuted,
   },

   pressed: {
      opacity: Pressed.opacity,
   },
});
