/**
 * The strip above the tab bar — Stars balance and the store you are ordering
 * from, on one line, tappable through to Rewards.
 *
 * This is the only chrome in the app that survives a tab switch. Everything else
 * on screen belongs to a tab and is torn down and rebuilt when you leave it; a
 * `UITabBarController` bottom accessory belongs to the *controller*, so it is
 * mounted once and simply keeps going. That continuity is the entire point of
 * the component, and it is why it holds the two facts that are true no matter
 * which tab you are looking at rather than anything tab-local: the strip is what
 * makes five screens read as one surface.
 *
 * Two constraints from the platform, both easy to violate by accident:
 *
 *   1. **This renders twice.** UIKit asks for one copy per placement, and the
 *      two copies are separate React trees that share nothing. So there is no
 *      `useState` here and there must not be one — a counter incremented in the
 *      regular copy would simply not exist in the inline one. Everything shown
 *      comes from `useSession()`, which is above both.
 *   2. **The placements are different shapes.** `inline` is what you get once
 *      the bar has minimized to a pill and there is perhaps half the width;
 *      `regular` is the full-width bar. Same facts, less furniture.
 *
 * No background and no border: iOS 26 draws Liquid Glass behind the accessory
 * and anything we paint on top of it reads as a sticker stuck to the glass. We
 * only supply foreground.
 */

import { useRouter } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Glyph } from '@/components/chrome';
import { useSession } from '@/lib/session';
import { Accent, Border, IconSize, Space, Stroke, TextColor, TextStyles } from '@/theme';

export function SessionStrip() {
   const placement = NativeTabs.BottomAccessory.usePlacement();
   const router = useRouter();
   const { member, store } = useSession();

   const inline = placement === 'inline';
   const stars = member?.stars ?? 0;
   const storeName = store?.name ?? 'No store';

   /**
    * Two targets, not one.
    *
    * The strip is the only chrome that survives a tab switch, which makes it the
    * one place in the app where "which store am I ordering from" is always on
    * screen — and therefore the only sensible place to change it from. Before
    * this split, changing your store was a 14pt word on Home and nowhere else:
    * four of the five tabs had no way back to the map at all.
    *
    * The store half routes to `/change-store` rather than `/store-picker`. That
    * is not a preference — a `push` to a guarded-away route is silently dropped,
    * and gate one is guarded away by definition once you have a store. See
    * `src/app/change-store.tsx`.
    */
   return (
      <View style={[styles.strip, inline && styles.stripInline]}>
         <Pressable
            style={({ pressed }) => [styles.half, pressed && styles.pressed]}
            accessibilityRole="button"
            /**
             * Spelled out because the visible line leans on a star mark to carry
             * meaning that a screen reader cannot see, and in `inline` the word
             * "Stars" is dropped from the line entirely.
             */
            accessibilityLabel={`${stars} Stars. Opens Rewards.`}
            onPress={() => router.navigate('/rewards')}
         >
            {/*
             * Gold because gold is the Stars accent (DESIGN_SYSTEM §2), and gold on
             * glass is nowhere near a text contrast ratio — which is fine, because
             * this mark is decoration. The balance next to it carries the meaning
             * and the label above carries it again for anyone not looking.
             */}
            <Glyph id="rewards" size={IconSize.xs} color={Accent.gold} strokeWidth={Stroke.heavy} />

            <Text style={styles.stars} numberOfLines={1}>
               {stars}
               {inline ? '' : ' Stars'}
            </Text>
         </Pressable>

         <View style={styles.divider} />

         <Pressable
            style={({ pressed }) => [styles.half, styles.storeHalf, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={`Ordering from ${storeName}. Change store.`}
            onPress={() => router.navigate('/change-store')}
         >
            {/*
             * Shrinks first and truncates. A long store name is the only thing on
             * this line whose length we do not control, so it is the only thing
             * allowed to give.
             */}
            <Text style={styles.store} numberOfLines={1}>
               {storeName}
            </Text>

            {/* The affordance costs width the pill does not have. */}
            {inline ? null : (
               <Glyph
                  id="chevronRight"
                  size={IconSize.xs}
                  color={TextColor.tertiary}
                  strokeWidth={Stroke.heavy}
               />
            )}
         </Pressable>
      </View>
   );
}

const styles = StyleSheet.create({
   strip: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
      paddingHorizontal: Space.base,
   },
   stripInline: {
      gap: Space.xs,
      paddingHorizontal: Space.md,
   },
   /**
    * The row is the tap target, so each half carries the strip's full height
    * rather than hugging its text — a 20pt-tall hit area inside a 44pt bar is the
    * classic accessory-strip miss.
    */
   half: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
      gap: Space.sm,
   },
   /** Takes the slack, so the store name gets the width the stars do not need. */
   storeHalf: {
      flex: 1,
      justifyContent: 'flex-start',
   },
   pressed: {
      opacity: 0.6,
   },
   stars: {
      ...TextStyles.bodySmStrong,
      color: TextColor.primary,
   },
   divider: {
      width: StyleSheet.hairlineWidth,
      alignSelf: 'stretch',
      marginVertical: Space.sm,
      backgroundColor: Border.strong,
   },
   store: {
      ...TextStyles.bodySm,
      color: TextColor.secondary,
      flexShrink: 1,
   },
});
