/**
 * The green field behind the menu.
 *
 * Flat House Green over this much area goes dead, so there are two gradients on
 * top of it: a soft bloom up where the header buttons are, and a deepening
 * toward the bottom edge. The effect is that the panel reads as lit from the
 * top-left, which is also where the rows enter from.
 *
 * Static, not animated. When the menu is shut the app card covers this entirely,
 * so the reveal *is* the animation — driving these gradients off progress too
 * would be work nobody can see.
 *
 * SVG rather than `expo-linear-gradient` because `react-native-svg` is already a
 * dependency and gives us the radial stop as well, which a linear-only gradient
 * package cannot.
 */

import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { Action, Surface } from '@/theme';

export function MenuBackdrop() {
   return (
      <View style={styles.root}>
         <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
               {/*
                * Offset left and high, centred roughly on the avatar button. `r`
                * is in viewport units, so 0.95 spills past the right edge on
                * purpose — a bloom that ends on screen looks like a circle.
                */}
               <RadialGradient id="bloom" cx="0.28" cy="0.3" r="0.95">
                  <Stop offset="0" stopColor={Action.primary} stopOpacity={0.62} />
                  <Stop offset="0.55" stopColor={Action.primary} stopOpacity={0.2} />
                  <Stop offset="1" stopColor={Action.primary} stopOpacity={0} />
               </RadialGradient>

               {/* Weight at the bottom, so the rows have something to sit on. */}
               <LinearGradient id="floor" x1="0" y1="0.45" x2="0" y2="1">
                  <Stop offset="0" stopColor={Surface.inverseDeep} stopOpacity={0} />
                  <Stop offset="1" stopColor={Surface.inverseDeep} stopOpacity={0.85} />
               </LinearGradient>
            </Defs>

            <Rect x="0" y="0" width="100%" height="100%" fill="url(#bloom)" />
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#floor)" />
         </Svg>
      </View>
   );
}

const styles = StyleSheet.create({
   root: {
      ...StyleSheet.absoluteFill,
      backgroundColor: Surface.inverse,
   },
});
