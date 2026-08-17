import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
   Extrapolation,
   interpolate,
   useAnimatedStyle,
   useSharedValue,
   withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { Store } from '@/lib/session';
import { Sizes, Space, TextColor, TextStyles } from '@/theme';

import { ChevronGlyph } from './Glyphs';
import { StoreDetail } from './StoreDetail';
import { StoreList } from './StoreList';
import type { StoreSheetProps } from './StoreSheet.shared';
import { FACE_IN, FACE_OUT, GLASS, PEEK_SPRING, SHEET } from './stage';

/**
 * Liquid Glass is iOS 26 and up. Below that — and on Android and web — the
 * native view has no effect to render, so the sheet takes the tinted cream
 * fallback instead of a transparent hole. Resolved once at module scope
 * because it cannot change while the bundle is running.
 */
const GLASS_AVAILABLE = isLiquidGlassAvailable();

/**
 * One sheet, two faces, one driver.
 *
 * The alternative — a modal that snaps up over the list — was the thing to avoid.
 * A pin tap should feel like the sheet turning to look at you, so `face` slides
 * the list up and out while it slides the detail card up and in, with the two
 * crossing in the middle. Because both faces are always mounted and only ever
 * transformed, nothing re-lays-out during the transition and the map's own fly-to
 * runs on the same beat.
 *
 * Peek uses `translateY` rather than an animated `height` for the same reason:
 * animating height would re-lay-out the list's ScrollView on every frame.
 *
 * The sheet is deliberately tap-driven and not draggable. A pan gesture starting
 * here would race the map's own recogniser — @rnmapbox/maps has a whole
 * `stopGesturePropagation` prop about that fight — and the chevron is honest
 * about being a button rather than pretending to be a grabber.
 */

export function StoreSheet({
   height,
   bottomInset,
   selected,
   collapsed,
   collapsible,
   onToggleCollapsed,
   onBack,
   stores,
   query,
   onQueryChange,
   distanceFor,
   onSelect,
   onConfirm,
   note,
}: StoreSheetProps) {
   const face = useSharedValue(selected ? 1 : 0);
   const peek = useSharedValue(collapsed ? 1 : 0);

   /**
    * The store the detail face is *showing*, which lags `selected` on the way
    * out. Without it the card would blank to nothing and then slide away empty.
    */
   const [shown, setShown] = useState<Store | null>(selected);

   /**
    * Adjusted during render rather than in an effect: the detail face has to
    * carry its store on the very first frame it animates in, and an effect
    * would land a frame late — you would see the card start moving with the
    * previous store's name still on it.
    */
   if (selected && selected !== shown) setShown(selected);

   useEffect(() => {
      if (selected) {
         face.set(withSpring(1, FACE_IN));
         return;
      }
      face.set(
         withSpring(0, FACE_OUT, (finished) => {
            'worklet';
            if (finished) scheduleOnRN(setShown, null);
         }),
      );
   }, [selected, face]);

   useEffect(() => {
      peek.set(withSpring(collapsed ? 1 : 0, PEEK_SPRING));
   }, [collapsed, peek]);

   const sheetStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: peek.get() * Math.max(0, height - SHEET.peek) }],
   }));

   const browseStyle = useAnimatedStyle(() => ({
      opacity: interpolate(face.get(), [0, 0.65], [1, 0], Extrapolation.CLAMP),
      transform: [{ translateY: face.get() * -22 }],
   }));

   const detailStyle = useAnimatedStyle(() => ({
      opacity: interpolate(face.get(), [0.35, 1], [0, 1], Extrapolation.CLAMP),
      transform: [{ translateY: (1 - face.get()) * 26 }],
   }));

   const backStyle = useAnimatedStyle(() => ({ opacity: face.get() }));
   const chevronStyle = useAnimatedStyle(() => ({
      opacity: 1 - face.get(),
      transform: [{ rotate: `${180 * peek.get()}deg` }],
   }));

   const browsing = selected === null;

   return (
      <Animated.View style={[styles.sheet, { height }, sheetStyle]}>
         <View style={styles.clip}>
            {/*
             * The surface, as an absolute-fill layer behind the content rather
             * than a wrapper around it. Keeping it out of the layout path means
             * the glass can be swapped for the fallback without either branch
             * touching how the sheet measures — and `clip` stays the single
             * node that owns the radius and the overflow.
             */}
            {GLASS_AVAILABLE ? (
               <GlassView
                  style={StyleSheet.absoluteFill}
                  glassEffectStyle="regular"
                  tintColor={GLASS.tint}
                  /**
                   * Pinned light. The app is light-only (`app.json` pins
                   * `userInterfaceStyle`), so letting the glass follow the
                   * system would give a dark sheet under a cream app on a
                   * device set to dark.
                   */
                  colorScheme="light"
               />
            ) : (
               <View style={[StyleSheet.absoluteFill, styles.fallbackFill]} />
            )}

            {/*
             * The grabber row is what was missing at the top. The header used to
             * start at y=0, so the first thing in the sheet sat against its own
             * rounded edge with nothing above it.
             */}
            <View style={styles.grabberRow}>
               <View style={styles.grabber} />
            </View>

            <View style={styles.header}>
               <Animated.View
                  style={[styles.back, backStyle]}
                  pointerEvents={browsing ? 'none' : 'auto'}>
                  <Pressable
                     style={styles.backTap}
                     onPress={onBack}
                     hitSlop={Space.sm}
                     accessibilityRole="button"
                     accessibilityLabel="Back to all stores">
                     <View style={styles.backChevron}>
                        <ChevronGlyph size={16} color={TextColor.secondary} />
                     </View>
                     <Text style={styles.backLabel}>All stores</Text>
                  </Pressable>
               </Animated.View>

               <Animated.View
                  style={chevronStyle}
                  pointerEvents={browsing && collapsible ? 'auto' : 'none'}>
                  <Pressable
                     style={styles.toggle}
                     onPress={onToggleCollapsed}
                     accessibilityRole="button"
                     accessibilityState={{ expanded: !collapsed }}
                     accessibilityLabel={
                        collapsed ? 'Show the store list' : 'Hide the list to see the map'
                     }>
                     <ChevronGlyph size={20} color={TextColor.tertiary} />
                  </Pressable>
               </Animated.View>
            </View>

            <View style={styles.faces}>
               <Animated.View
                  style={[styles.face, browseStyle]}
                  pointerEvents={browsing ? 'auto' : 'none'}>
                  <StoreList
                     stores={stores}
                     query={query}
                     onQueryChange={onQueryChange}
                     distanceFor={distanceFor}
                     onSelect={onSelect}
                     note={note}
                     bottomInset={bottomInset}
                  />
               </Animated.View>

               <Animated.View
                  style={[styles.face, detailStyle]}
                  pointerEvents={browsing ? 'none' : 'auto'}>
                  {shown ? (
                     <StoreDetail
                        store={shown}
                        distanceKm={distanceFor(shown)}
                        onConfirm={onConfirm}
                        bottomInset={bottomInset}
                     />
                  ) : null}
               </Animated.View>
            </View>
         </View>
      </Animated.View>
   );
}

const styles = StyleSheet.create({
   sheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderTopLeftRadius: SHEET.radius,
      borderTopRightRadius: SHEET.radius,
      /**
       * Transparent, so the map reads through the glass. That does cost the
       * drop shadow — iOS renders nothing from a fully transparent node — which
       * is why `clip` carries a rim hairline instead. A lit top edge is how a
       * glass panel actually separates from what is under it; a shadow under a
       * translucent sheet would read as dirt.
       */
      backgroundColor: 'transparent',
   },
   clip: {
      flex: 1,
      borderTopLeftRadius: SHEET.radius,
      borderTopRightRadius: SHEET.radius,
      overflow: 'hidden',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: GLASS.rim,
   },
   fallbackFill: {
      backgroundColor: GLASS.base,
   },
   grabberRow: {
      height: SHEET.grabberRow,
      alignItems: 'center',
      justifyContent: 'center',
   },
   grabber: {
      width: SHEET.grabberWidth,
      height: SHEET.grabberHeight,
      borderRadius: SHEET.grabberHeight / 2,
      backgroundColor: GLASS.grabber,
   },
   header: {
      height: SHEET.headerRow,
      alignItems: 'center',
      justifyContent: 'center',
   },
   back: {
      position: 'absolute',
      left: Space.md,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
   },
   backTap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.xs,
      minHeight: Space.xxl,
      paddingRight: Space.sm,
   },
   backChevron: {
      transform: [{ rotate: '90deg' }],
   },
   backLabel: {
      ...TextStyles.bodySmStrong,
      color: TextColor.secondary,
   },
   toggle: {
      width: Sizes.tap,
      height: SHEET.headerRow,
      alignItems: 'center',
      justifyContent: 'center',
   },
   faces: {
      flex: 1,
   },
   face: {
      ...StyleSheet.absoluteFill,
   },
});
