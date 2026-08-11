import { DeviceMotion } from "expo-sensors";
import { type ReactNode, useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
   Easing,
   useAnimatedStyle,
   useSharedValue,
   withTiming,
} from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { CARD } from "./theme";

/**
 * The welcome screen's holographic moment: once the card is claimed it
 * follows the device's tilt, and a light band slides across the face the way
 * gloss moves on a real card — the trimmed siren catches it as it passes.
 *
 * Driven by DeviceMotion attitude rather than gyroscope rate, so holding the
 * phone at an angle holds the card there; nothing needs integrating. The
 * first reading after enabling becomes neutral — however the phone is already
 * being held is "flat". Where there is no sensor (desktop web), the listener
 * never fires and the card simply sits still: the right fallback for a
 * flourish.
 */

/** How far the device leans (radians) for the card to hit full tilt. */
const FULL_LEAN = 0.35;
/** Card tilt at full lean, degrees. Subtle — this is a card, not a coin. */
const MAX_DEG = 6;
/** How far the sheen band travels at full lean, points. */
const SHEEN_TRAVEL = 52;
/** The band is bigger than the card so its edges never show mid-travel. */
const SHEEN_W = CARD.width * 1.8;
const SHEEN_H = CARD.height * 2;
/**
 * Retargeted on every sensor event (~30Hz). Short enough to track the hand,
 * long enough that the sampling never shows as steps.
 */
const GLIDE = { duration: 120, easing: Easing.out(Easing.quad) } as const;
const SHEEN_IN = { duration: 600, easing: Easing.out(Easing.cubic) } as const;

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

type Props = {
   enabled: boolean;
   children: ReactNode;
};

export function HoloTilt({ enabled, children }: Props) {
   /** -1..1 device lean. x follows roll (gamma), y follows pitch (beta). */
   const leanX = useSharedValue(0);
   const leanY = useSharedValue(0);
   /** Gates the sheen, so the band does not exist during the form. */
   const on = useSharedValue(0);

   useEffect(() => {
      if (!enabled) {
         on.set(withTiming(0, GLIDE));
         leanX.set(withTiming(0, GLIDE));
         leanY.set(withTiming(0, GLIDE));
         return;
      }

      on.set(withTiming(1, SHEEN_IN));

      let neutral: { beta: number; gamma: number } | null = null;
      let sub: { remove(): void } | null = null;
      let alive = true;

      DeviceMotion.isAvailableAsync().then((ok) => {
         if (!ok || !alive) return;
         DeviceMotion.setUpdateInterval(33);
         sub = DeviceMotion.addListener(({ rotation }) => {
            if (!rotation) return;
            neutral ??= { beta: rotation.beta, gamma: rotation.gamma };
            leanX.set(
               withTiming(clamp((rotation.gamma - neutral.gamma) / FULL_LEAN), GLIDE),
            );
            leanY.set(
               withTiming(clamp((rotation.beta - neutral.beta) / FULL_LEAN), GLIDE),
            );
         });
      });

      return () => {
         alive = false;
         sub?.remove();
      };
   }, [enabled, leanX, leanY, on]);

   const tiltStyle = useAnimatedStyle(() => ({
      transform: [
         { perspective: 700 },
         { rotateX: `${leanY.get() * -MAX_DEG}deg` },
         { rotateY: `${leanX.get() * MAX_DEG}deg` },
      ],
   }));

   /** The sheen slides against the lean, the way a reflection moves. */
   const sheenStyle = useAnimatedStyle(() => ({
      opacity: on.get(),
      transform: [
         { translateX: leanX.get() * -SHEEN_TRAVEL },
         { translateY: leanY.get() * -SHEEN_TRAVEL * 0.6 },
         { rotate: "18deg" },
      ],
   }));

   return (
      <Animated.View style={tiltStyle}>
         {children}
         <Animated.View pointerEvents="none" style={styles.sheenClip}>
            <Animated.View style={[styles.sheen, sheenStyle]}>
               <Svg width={SHEEN_W} height={SHEEN_H}>
                  <Defs>
                     <LinearGradient id="holo-sheen" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
                        <Stop offset="0.42" stopColor="#FFFFFF" stopOpacity={0.13} />
                        <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.2} />
                        <Stop offset="0.58" stopColor="#FFFFFF" stopOpacity={0.13} />
                        <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
                     </LinearGradient>
                  </Defs>
                  <Rect width={SHEEN_W} height={SHEEN_H} fill="url(#holo-sheen)" />
               </Svg>
            </Animated.View>
         </Animated.View>
      </Animated.View>
   );
}

const styles = StyleSheet.create({
   sheenClip: {
      ...StyleSheet.absoluteFill,
      borderRadius: CARD.radius,
      overflow: "hidden",
   },
   sheen: {
      position: "absolute",
      left: (CARD.width - SHEEN_W) / 2,
      top: (CARD.height - SHEEN_H) / 2,
   },
});
