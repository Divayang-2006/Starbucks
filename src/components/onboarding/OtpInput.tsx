import { type RefObject, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import Animated, {
   Easing,
   Extrapolation,
   type SharedValue,
   interpolate,
   interpolateColor,
   useAnimatedStyle,
   useSharedValue,
   withSequence,
   withTiming,
} from "react-native-reanimated";

import { Type } from "./fonts";
import { Palette } from "./theme";

export const OTP_LENGTH = 6;

export type OtpStatus = "idle" | "checking" | "ok" | "fail";

const IDLE_BORDER = "rgba(255,255,255,0.26)";
const ACTIVE_BORDER = "rgba(255,255,255,0.85)";
const IDLE_FILL = "rgba(255,255,255,0.09)";
const ACTIVE_FILL = "rgba(255,255,255,0.16)";
const OK_BORDER = "#5BD68A";
const OK_FILL = "rgba(91,214,138,0.22)";
const BAD_BORDER = "#FF7A7A";
const BAD_FILL = "rgba(255,122,122,0.18)";

/**
 * The green sweep is one shared value, not six. Each cell opens its own
 * window `STAGGER` later than its neighbour and reads the same clock, so the
 * approval runs left to right off a single animation with nothing to keep in
 * sync.
 */
const STAGGER = 0.125;
const WINDOW = 0.3;
const SWEEP = { duration: 780, easing: Easing.linear } as const;

/** Amplitude of the rejection shake, in points. */
const SHAKE = 9;

function Cell({
   index,
   char,
   active,
   ok,
   bad,
}: {
   index: number;
   char: string;
   active: boolean;
   ok: SharedValue<number>;
   bad: SharedValue<number>;
}) {
   const style = useAnimatedStyle(() => {
      const start = index * STAGGER;
      const p = interpolate(
         ok.get(),
         [start, start + WINDOW],
         [0, 1],
         Extrapolation.CLAMP,
      );
      const b = bad.get();

      // Layered rather than branched: idle/active is the base, green washes
      // over it, red washes over that. They are mutually exclusive in
      // practice, so whichever is non-zero is the one you see.
      let border = active ? ACTIVE_BORDER : IDLE_BORDER;
      let fill = active ? ACTIVE_FILL : IDLE_FILL;
      border = interpolateColor(p, [0, 1], [border, OK_BORDER]);
      fill = interpolateColor(p, [0, 1], [fill, OK_FILL]);
      border = interpolateColor(b, [0, 1], [border, BAD_BORDER]);
      fill = interpolateColor(b, [0, 1], [fill, BAD_FILL]);

      // A bump as each cell turns, so approval travels along the row instead
      // of six borders quietly changing colour.
      const pop = interpolate(
         p,
         [0, 0.5, 1],
         [0, 1, 0],
         Extrapolation.CLAMP,
      );

      return {
         borderColor: border,
         backgroundColor: fill,
         transform: [{ scale: 1 + pop * 0.1 }],
      };
   });

   return (
      <Animated.View style={[styles.cell, style]}>
         <Text style={styles.digit}>{char}</Text>
      </Animated.View>
   );
}

type Props = {
   value: string;
   onChange: (next: string) => void;
   status: OtpStatus;
   /** Owned by the flow, so the code can be focused the moment the card lands. */
   inputRef: RefObject<TextInput | null>;
};

/**
 * Six cells over one real input.
 *
 * The hidden-input trick is the wrong answer for a normal text field — it is
 * what made the name field unfixable before it moved onto the card — but it is
 * exactly right here. Nobody edits between the digits of a one-time code; they
 * type six and it resolves, or the OS fills all six at once from the SMS.
 */
export function OtpInput({ value, onChange, status, inputRef }: Props) {
   const [focused, setFocused] = useState(false);

   const ok = useSharedValue(0);
   const bad = useSharedValue(0);
   const shake = useSharedValue(0);

   useEffect(() => {
      if (status === "ok") {
         bad.set(0);
         ok.set(withTiming(1, SWEEP));
         return;
      }
      if (status === "fail") {
         ok.set(0);
         bad.set(withTiming(1, { duration: 140 }));
         // Six diminishing swings: a head shaking "no", not a rattle. The
         // decay is what separates the two — equal swings read as an error
         // buzzer, decaying ones read as a gesture.
         shake.set(
            withSequence(
               withTiming(-1, { duration: 52 }),
               withTiming(1, { duration: 68 }),
               withTiming(-0.62, { duration: 64 }),
               withTiming(0.62, { duration: 64 }),
               withTiming(-0.22, { duration: 54 }),
               withTiming(0, { duration: 54 }),
            ),
         );
         return;
      }
      ok.set(withTiming(0, { duration: 200 }));
      bad.set(withTiming(0, { duration: 200 }));
   }, [status, ok, bad, shake]);

   const rowStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: shake.get() * SHAKE }],
   }));

   const caret = value.length;
   const showCaret = focused && status === "idle";

   return (
      <Pressable
         onPress={() => inputRef.current?.focus()}
         accessibilityLabel="One-time code"
      >
         <Animated.View style={[styles.row, rowStyle]}>
            {Array.from({ length: OTP_LENGTH }, (_, i) => (
               <Cell
                  key={i}
                  index={i}
                  char={value[i] ?? ""}
                  active={showCaret && i === caret}
                  ok={ok}
                  bad={bad}
               />
            ))}

            <TextInput
               ref={inputRef}
               value={value}
               onChangeText={(raw) =>
                  onChange(raw.replace(/\D/g, "").slice(0, OTP_LENGTH))
               }
               onFocus={() => setFocused(true)}
               onBlur={() => setFocused(false)}
               keyboardType="number-pad"
               textContentType="oneTimeCode"
               autoComplete="sms-otp"
               keyboardAppearance="dark"
               maxLength={OTP_LENGTH}
               caretHidden
               style={styles.catcher}
            />
         </Animated.View>
      </Pressable>
   );
}

const styles = StyleSheet.create({
   row: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
   },
   cell: {
      width: 46,
      height: 54,
      borderRadius: 9,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
   },
   digit: {
      fontFamily: Type.semibold,
      fontSize: 20,
      color: Palette.white,
      includeFontPadding: false,
   },
   // Transparent, full-bleed, and on top: the cells are decoration, this is
   // the thing the keyboard is actually attached to.
   catcher: {
      ...StyleSheet.absoluteFill,
      opacity: 0,
   },
});
