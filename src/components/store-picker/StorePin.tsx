import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
   interpolate,
   interpolateColor,
   useAnimatedStyle,
   useSharedValue,
   withSpring,
   withTiming,
} from 'react-native-reanimated';

import type { Store } from '@/lib/session';
import { Accent, Action, Surface } from '@/theme';

import { CupMark } from './CupMark';
import { DIM_TIMING, PIN, PIN_SPRING, PRESS_SPRING, PRESS_TIMING } from './stage';

/**
 * The pin. Deliberately not a teardrop: a disc on a stalk with a ground dot
 * reads as "a place" without borrowing the map-app vocabulary, and it gives the
 * selected state somewhere to go — the disc lifts off its own anchor.
 *
 * Open and closed are told apart by *fill*, not by a badge. A solid House Green
 * disc is open; a muted sage disc is closed. At 30pt that distinction survives
 * where an icon would not.
 *
 * Selection used to *invert* the pin to a cream disc, which was right when the
 * basemap was near-black and wrong the moment it became cream — an inverted pin
 * on a light map is a hole. It now works the other way round: the disc stays
 * dark and legible, and selection adds a gold ring, a gold halo and the lift.
 * Emphasis, not inversion, is what survives a light ground.
 */

const OPEN_DISC = Surface.inverse;
const CLOSED_DISC = '#8A9691';
const SELECTED_DISC = Action.primary;
const RING = 'rgba(255,255,255,0.95)';
const SELECTED_RING = Accent.gold;
const CLOSED_MARK_OPACITY = 0.55;
const HALO_FILL = 'rgba(203,162,88,0.18)';
const HALO_RING = 'rgba(203,162,88,0.55)';

type Props = {
   store: Store;
   selected: boolean;
   /** A search is narrowing the map and this store is not one of the hits. */
   dimmed: boolean;
   onPress: (store: Store) => void;
};

export function StorePin({ store, selected, dimmed, onPress }: Props) {
   const on = useSharedValue(selected ? 1 : 0);
   const away = useSharedValue(dimmed ? 1 : 0);
   const pressed = useSharedValue(0);

   useEffect(() => {
      on.set(withSpring(selected ? 1 : 0, PIN_SPRING));
   }, [selected, on]);

   useEffect(() => {
      away.set(withTiming(dimmed ? 1 : 0, DIM_TIMING));
   }, [dimmed, away]);

   const restDisc = store.isOpen ? OPEN_DISC : CLOSED_DISC;
   const markOpacity = store.isOpen ? 1 : CLOSED_MARK_OPACITY;

   const boxStyle = useAnimatedStyle(() => ({
      opacity: interpolate(away.get(), [0, 1], [1, PIN.dimOpacity]),
   }));

   const discStyle = useAnimatedStyle(() => {
      const lit = on.get();
      return {
         backgroundColor: interpolateColor(lit, [0, 1], [restDisc, SELECTED_DISC]),
         borderColor: interpolateColor(lit, [0, 1], [RING, SELECTED_RING]),
         borderWidth: interpolate(lit, [0, 1], [1.5, 2.5]),
         transform: [
            { translateY: -lit * PIN.lift },
            // The three drivers multiply rather than add: selection, search
            // de-emphasis and the press are independent reasons to resize.
            {
               scale:
                  interpolate(lit, [0, 1], [1, PIN.selectedScale]) *
                  interpolate(away.get(), [0, 1], [1, PIN.dimScale]) *
                  interpolate(pressed.get(), [0, 1], [1, 0.9]),
            },
         ],
      };
   });

   const haloStyle = useAnimatedStyle(() => {
      const lit = on.get();
      return {
         opacity: lit,
         transform: [{ translateY: -lit * PIN.lift }, { scale: interpolate(lit, [0, 1], [0.5, 1]) }],
      };
   });

   // One mark, not two. The disc stays dark in both states now, so the cup is
   // white throughout and the old crossfade between a cream and a green cup
   // had nothing left to cross-fade between.
   const markStyle = useAnimatedStyle(() => ({
      opacity: interpolate(on.get(), [0, 1], [markOpacity, 1]),
   }));

   return (
      <Animated.View
         style={[styles.box, boxStyle]}
         // box-none so the 72pt frame never swallows a pan meant for the map,
         // and none while dimmed so a search result is unambiguous.
         pointerEvents={dimmed ? 'none' : 'box-none'}>
         <Pressable
            style={styles.tap}
            onPressIn={() => pressed.set(withTiming(1, PRESS_TIMING))}
            onPressOut={() => pressed.set(withSpring(0, PRESS_SPRING))}
            onPress={() => onPress(store)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${store.name}, ${store.area}${store.isOpen ? '' : ', closed'}`}>
            <Animated.View style={[styles.halo, haloStyle]} pointerEvents="none" />
            {/*
             * Before the disc, so the disc masks all but its exposed 6pt. Stem
             * and dot take the disc colour, not the ring colour — a white stalk
             * was invisible the moment the ground turned cream.
             */}
            <View style={[styles.stem, { backgroundColor: restDisc }]} pointerEvents="none" />
            <View style={[styles.dot, { backgroundColor: restDisc }]} pointerEvents="none" />
            <Animated.View style={[styles.disc, discStyle]} pointerEvents="none">
               <Animated.View style={[styles.mark, markStyle]}>
                  <CupMark size={PIN.mark} color={Surface.app} />
               </Animated.View>
            </Animated.View>
         </Pressable>
      </Animated.View>
   );
}

const styles = StyleSheet.create({
   box: {
      width: PIN.box,
      height: PIN.box,
      alignItems: 'center',
      justifyContent: 'flex-end',
   },
   tap: {
      width: PIN.tap,
      height: PIN.tap,
   },
   halo: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: PIN.halo,
      height: PIN.halo,
      borderRadius: PIN.halo / 2,
      borderWidth: 1.5,
      borderColor: HALO_RING,
      backgroundColor: HALO_FILL,
   },
   disc: {
      position: 'absolute',
      left: (PIN.tap - PIN.disc) / 2,
      bottom: (PIN.tap - PIN.disc) / 2,
      width: PIN.disc,
      height: PIN.disc,
      borderRadius: PIN.disc / 2,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
   },
   mark: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
   },
   stem: {
      position: 'absolute',
      left: (PIN.tap - 2) / 2,
      bottom: PIN.dot,
      width: 2,
      height: PIN.stem,
   },
   dot: {
      position: 'absolute',
      left: (PIN.tap - PIN.dot) / 2,
      bottom: 0,
      width: PIN.dot,
      height: PIN.dot,
      borderRadius: PIN.dot / 2,
   },
});
