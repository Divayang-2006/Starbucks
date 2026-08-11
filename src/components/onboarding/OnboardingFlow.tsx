import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
   Keyboard,
   Platform,
   Pressable,
   StyleSheet,
   Text,
   TextInput,
   View,
} from "react-native";
import Animated, {
   Easing,
   Extrapolation,
   FadeIn,
   FadeInDown,
   FadeOutDown,
   type SharedValue,
   interpolate,
   interpolateColor,
   useAnimatedStyle,
   useSharedValue,
   withSequence,
   withSpring,
   withTiming,
} from "react-native-reanimated";
import {
   SafeAreaView,
   useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { scheduleOnRN } from "react-native-worklets";

import { HoloTilt } from "./HoloTilt";
import { LoyaltyCard } from "./LoyaltyCard";
import { OTP_LENGTH, OtpInput, type OtpStatus } from "./OtpInput";
import { PrimaryButton } from "./PrimaryButton";
import { ProgressDots } from "./ProgressDots";
import { SirenLogo } from "./SirenLogo";
import { StylePicker } from "./StylePicker";
import { PocketBack, PocketFront } from "./Wallet";
import {
   type CardStyleId,
   DEFAULT_STYLE_ID,
   STYLE_BY_ID,
} from "./cardStyles";
import {
   EMPTY_VALUES,
   FIELDS,
   FIELD_BY_KEY,
   type FieldDef,
   type FieldKey,
   type Values,
} from "./fields";
import { Type } from "@/theme";
import {
   landFeedback,
   passFeedback,
   rejectFeedback,
   tapFeedback,
} from "./haptics";
import {
   CARD,
   CARD_DROP,
   CARD_END_SCALE,
   CARD_FOCUS,
   CARD_TOP,
   Palette,
   STAGE_HEIGHT,
   formatPhone,
} from "./theme";

/**
 * Entering-animation builders are defined at module scope. The Reanimated docs
 * call this out explicitly: rebuilding them on every render is wasted work.
 */
const OTP_TITLE_IN = FadeInDown.delay(520).duration(420);
const OTP_SUB_IN = FadeInDown.delay(620).duration(420);
const STATUS_IN = FadeIn.duration(200);
const BADGE_IN = FadeInDown.delay(560).duration(420);
const TITLE_IN = FadeInDown.delay(660).duration(420);
const SUB_IN = FadeInDown.delay(760).duration(420);
const FOOTER_OUT = FadeOutDown.duration(280);

/**
 * Zoom in overshoots slightly (dampingRatio < 1) so the card feels like it
 * springs toward you. Zoom out is critically damped — leaving a state should
 * be clean and quick, never bouncy. `duration`/`dampingRatio` cannot be mixed
 * with `stiffness`/`damping`; Reanimated types them as mutually exclusive.
 */
const ZOOM_IN = { duration: 520, dampingRatio: 0.78 } as const;
const ZOOM_OUT = { duration: 400, dampingRatio: 1 } as const;

const QUESTION_SLIDE = {
   duration: 420,
   easing: Easing.inOut(Easing.cubic),
} as const;
const TURN = { duration: 540, easing: Easing.inOut(Easing.cubic) } as const;
const DROP = { duration: 900, easing: Easing.out(Easing.cubic) } as const;

/**
 * A blur followed straight away by another focus is just the flow stepping
 * between lines. Only a blur that stands alone this long is a real dismissal
 * worth unzooming for.
 */
const DISMISS_GRACE = 140;

const LAST_INDEX = FIELDS.length - 1;

/**
 * How dimmed the screen should be for the OTP: the keyboard being up, but only
 * once we're on the wallet. Raising the keyboard over the cream collection
 * screen must not drag it toward the deep green.
 */
function otpDim(kb: number, journey: number) {
   "worklet";
   return kb * interpolate(journey, [0.6, 1], [0, 1], Extrapolation.CLAMP);
}

const OTP_STATUS_TEXT: Record<OtpStatus, string> = {
   idle: "Didn't get it? Resend code",
   checking: "Checking…",
   ok: "Verified",
   fail: "That code didn't work",
};

function ChevronLeft({ color }: { color: string }) {
   return (
      <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
         <Path
            d="M12.5 4 L6.5 10 L12.5 16"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </Svg>
   );
}

function StarBadge() {
   return (
      <View style={styles.badge}>
         <SirenLogo width={18} />
         <Text style={styles.badgeText}>0 Stars</Text>
      </View>
   );
}

/**
 * One question above the card. Every question renders identically and reads
 * its own distance from the cursor, so the set of them is however long FIELDS
 * happens to be — there is no hand-tuned cross-fade per stage any more.
 */
function Question({
   index,
   def,
   field,
   journey,
}: {
   index: number;
   def: FieldDef;
   field: SharedValue<number>;
   journey: SharedValue<number>;
}) {
   const layerStyle = useAnimatedStyle(() => {
      const d = field.get() - index;
      const near = interpolate(
         Math.abs(d),
         [0, 0.6],
         [1, 0],
         Extrapolation.CLAMP,
      );
      const beforeWallet = interpolate(
         journey.get(),
         [0, 0.45],
         [1, 0],
         Extrapolation.CLAMP,
      );
      return {
         opacity: near * beforeWallet,
         transform: [{ translateX: -d * 46 }],
      };
   });

   const headingColor = useAnimatedStyle(() => ({
      color: interpolateColor(
         journey.get(),
         [0.4, 1],
         [Palette.ink, Palette.white],
      ),
   }));

   return (
      <Animated.View style={[styles.textLayer, layerStyle]} pointerEvents="none">
         <Animated.Text style={[styles.heading, headingColor]}>
            {def.heading}
         </Animated.Text>
         <Text style={styles.sub}>{def.sub}</Text>
      </Animated.View>
   );
}

export function OnboardingFlow() {
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const [values, setValues] = useState<Values>(EMPTY_VALUES);
   /** Which question we're on. The card face follows from FIELDS[index]. */
   const [index, setIndex] = useState(0);
   /** True once the card has been handed over to the wallet. */
   const [done, setDone] = useState(false);
   /** The wallet screen is the OTP screen; this is the far side of it. */
   const [claimed, setClaimed] = useState(false);
   const [otp, setOtp] = useState("");
   const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
   const [styleId, setStyleId] = useState<CardStyleId>(DEFAULT_STYLE_ID);

   const nameRef = useRef<TextInput>(null);
   const dobRef = useRef<TextInput>(null);
   const phoneRef = useRef<TextInput>(null);
   const otpRef = useRef<TextInput>(null);
   const refs = useMemo(
      () => ({ name: nameRef, dob: dobRef, phone: phoneRef }),
      [],
   );

   /**
    * Four independent drivers, deliberately not one.
    *
    * `journey` is the only thing the card's flight path reads, so adding a
    * question never touches an interpolation range. `field` is the cursor
    * through FIELDS. `flip` is which face is up. `focus` is the zoom. They
    * compose rather than fight: translate and rotate ADD, scale MULTIPLIES,
    * because that is how those transforms actually stack.
    */
   const journey = useSharedValue(0);
   const field = useSharedValue(0);
   const flip = useSharedValue(0);
   const focus = useSharedValue(0);
   /** A one-shot kick when the edition changes, so the swap reads as physical. */
   const pulse = useSharedValue(0);
   /** 0 keyboard down, 1 keyboard up. Drives the dim. */
   const kb = useSharedValue(0);
   /** The keyboard's actual height. Drives the lift. */
   const kbH = useSharedValue(0);

   const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
   /** Set while the card is mid-turn, so the forced blur doesn't unzoom it. */
   const turning = useRef(false);

   const cancelDismiss = useCallback(() => {
      if (dismissTimer.current) {
         clearTimeout(dismissTimer.current);
         dismissTimer.current = null;
      }
   }, []);

   useEffect(() => cancelDismiss, [cancelDismiss]);

   /**
    * We measure the keyboard ourselves rather than handing the job to
    * KeyboardAvoidingView.
    *
    * KAV lifts content by padding its own box, which means it only works when
    * something in the column is willing to shrink — and on Android with
    * edge-to-edge it frequently does nothing at all, which is how the OTP
    * cells ended up behind the keyboard. Reading `endCoordinates.height` and
    * padding by it is the same idea made explicit, and it works identically on
    * both platforms. iOS fires `will` events carrying the system's own
    * duration, so matching it makes the lift ride the real keyboard; Android
    * only offers `did`, so it gets a fixed curve.
    */
   useEffect(() => {
      const ios = Platform.OS === "ios";
      const show = Keyboard.addListener(
         ios ? "keyboardWillShow" : "keyboardDidShow",
         (e) => {
            const cfg = {
               duration: e.duration || 250,
               easing: Easing.out(Easing.quad),
            };
            kbH.set(withTiming(e.endCoordinates.height, cfg));
            kb.set(withTiming(1, cfg));
         },
      );
      const hide = Keyboard.addListener(
         ios ? "keyboardWillHide" : "keyboardDidHide",
         (e) => {
            const cfg = {
               duration: e.duration || 220,
               easing: Easing.out(Easing.quad),
            };
            kbH.set(withTiming(0, cfg));
            kb.set(withTiming(0, cfg));
         },
      );
      return () => {
         show.remove();
         hide.remove();
      };
   }, [kb, kbH]);

   const focusField = useCallback(
      (i: number) => {
         refs[FIELDS[i].key].current?.focus();
      },
      [refs],
   );

   const focusAfterTurn = useCallback(
      (i: number) => {
         turning.current = false;
         focusField(i);
      },
      [focusField],
   );

   const goToField = useCallback(
      (next: number) => {
         if (next < 0 || next > LAST_INDEX) return;
         const from = FIELDS[index];
         const to = FIELDS[next];
         setIndex(next);
         field.set(withTiming(next, QUESTION_SLIDE));

         if (from.face === to.face) {
            focusField(next);
            return;
         }

         // Turning the card over: drop the keyboard first so the caret isn't
         // riding the flip, then focus the far side once it has landed flat.
         turning.current = true;
         cancelDismiss();
         Keyboard.dismiss();
         flip.set(
            withTiming(to.face === "back" ? 1 : 0, TURN, (finished) => {
               "worklet";
               if (finished) scheduleOnRN(focusAfterTurn, next);
            }),
         );
      },
      [index, field, flip, focusField, focusAfterTurn, cancelDismiss],
   );

   /**
    * The card touching down is also the cue to ask for the code — the screen
    * arrives ready to type into rather than waiting to be tapped.
    */
   const landed = useCallback(() => {
      landFeedback();
      otpRef.current?.focus();
   }, []);

   const finish = useCallback(() => {
      cancelDismiss();
      turning.current = false;
      Keyboard.dismiss();
      setDone(true);
      focus.set(withSpring(0, ZOOM_OUT));
      // Whatever side we finished on, the card goes into the wallet face up.
      flip.set(withTiming(0, TURN));
      journey.set(
         withTiming(1, DROP, (finished) => {
            "worklet";
            // scheduleOnRN hops back to the JS thread. In Reanimated 4 this
            // replaces the deprecated runOnJS.
            if (finished) scheduleOnRN(landed);
         }),
      );
   }, [cancelDismiss, focus, flip, journey, landed]);

   /**
    * Mock claim. Any six digits pass — this is the shape of the screen, not
    * the verification.
    */
   const claim = useCallback(() => {
      Keyboard.dismiss();
      setClaimed(true);
      landFeedback();
   }, []);

   const verifyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

   const cancelVerify = useCallback(() => {
      if (verifyTimer.current) {
         clearTimeout(verifyTimer.current);
         verifyTimer.current = null;
      }
   }, []);

   useEffect(() => cancelVerify, [cancelVerify]);

   /**
    * Auto-verify on the sixth digit. There is no submit button on this screen
    * by design — you finish typing and it answers, the way an OTP screen
    * should. The keyboard deliberately stays up through the green sweep so the
    * screen doesn't reflow underneath the result.
    */
   const verify = useCallback(
      (code: string) => {
         cancelVerify();
         setOtpStatus("checking");
         verifyTimer.current = setTimeout(() => {
            // Mock. Everything passes except a run of one repeated digit, so
            // the rejection choreography can be triggered deliberately —
            // type 000000 or 111111 to see it.
            const passed = !/^(\d)\1{5}$/.test(code);
            if (passed) {
               setOtpStatus("ok");
               passFeedback();
               verifyTimer.current = setTimeout(claim, 980);
               return;
            }
            setOtpStatus("fail");
            rejectFeedback();
            verifyTimer.current = setTimeout(() => {
               setOtp("");
               setOtpStatus("idle");
            }, 1000);
         }, 520);
      },
      [cancelVerify, claim],
   );

   const onOtpChange = useCallback(
      (next: string) => {
         // A verdict in flight owns the row; nothing typed or deleted lands
         // until it has finished being delivered.
         if (otpStatus === "checking" || otpStatus === "ok") return;
         // Correcting a rejected code cancels its pending auto-clear —
         // otherwise the reset lands a beat later and wipes the retype.
         if (otpStatus === "fail") {
            cancelVerify();
            setOtpStatus("idle");
         }
         setOtp(next);
         if (next.length === OTP_LENGTH) verify(next);
      },
      [otpStatus, verify, cancelVerify],
   );

   const onPickStyle = useCallback(
      (id: CardStyleId) => {
         setStyleId(id);
         pulse.set(
            withSequence(
               withTiming(1, { duration: 110 }),
               withSpring(0, { damping: 12, stiffness: 220, mass: 0.5 }),
            ),
         );
      },
      [pulse],
   );

   const advance = useCallback(() => {
      if (index < LAST_INDEX) goToField(index + 1);
      else finish();
   }, [index, goToField, finish]);

   const goBack = useCallback(() => {
      if (index === 0) router.back();
      else goToField(index - 1);
   }, [index, router, goToField]);

   const onChange = useCallback((key: FieldKey, raw: string) => {
      setValues((prev) => ({ ...prev, [key]: FIELD_BY_KEY[key].clean(raw) }));
   }, []);

   /**
    * Tapping a line on the card jumps the flow to it. The card is a form, not
    * a wizard — being able to reach back up and fix your name without undoing
    * anything is most of what makes putting the fields on the card worth it.
    */
   const onFieldFocus = useCallback(
      (key: FieldKey) => {
         cancelDismiss();
         const i = FIELDS.findIndex((f) => f.key === key);
         if (i >= 0 && i !== index) {
            setIndex(i);
            field.set(withTiming(i, QUESTION_SLIDE));
         }
         focus.set(withSpring(1, ZOOM_IN));
      },
      [cancelDismiss, index, field, focus],
   );

   const onFieldBlur = useCallback(() => {
      if (turning.current) return;
      cancelDismiss();
      dismissTimer.current = setTimeout(() => {
         focus.set(withSpring(0, ZOOM_OUT));
      }, DISMISS_GRACE);
   }, [cancelDismiss, focus]);

   // ---- Animated styles: every one of these reads `journey` ----------------

   const rootStyle = useAnimatedStyle(() => {
      const base = interpolateColor(
         journey.get(),
         [0, 0.45, 1],
         [Palette.cream, Palette.cream, Palette.screenGreen],
      );
      return {
         backgroundColor: interpolateColor(
            otpDim(kb.get(), journey.get()),
            [0, 1],
            [base, Palette.screenGreenDeep],
         ),
      };
   });

   /**
    * The column stops exactly where the keyboard starts. SafeAreaView has
    * already padded the bottom inset, and the keyboard covers that too, so
    * only the difference is ours to add.
    */
   const avoiderStyle = useAnimatedStyle(() => ({
      paddingBottom: Math.max(0, kbH.get() - insets.bottom),
   }));

   /**
    * Everything behind the code drops away while it's being entered. The
    * heading is deliberately not covered — it is the instruction, not the
    * scenery — so it outranks the scrim in `zIndex`.
    */
   const scrimStyle = useAnimatedStyle(() => ({
      opacity: otpDim(kb.get(), journey.get()) * 0.78,
   }));

   /** The cells come up to meet the keyboard, not just clear of it. */
   const otpBlockStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: kb.get() * -14 }],
   }));

   const cardStyle = useAnimatedStyle(() => {
      const j = journey.get();
      const f = focus.get();
      return {
         transform: [
            {
               translateY:
                  interpolate(j, [0, 1], [0, CARD_DROP]) + f * CARD_FOCUS.lift,
            },
            { translateX: f * CARD_FOCUS.leftSlide },
            {
               rotate: `${
                  interpolate(j, [0, 1], [-7, 0]) + f * CARD_FOCUS.straighten
               }deg`,
            },
            {
               scale:
                  interpolate(j, [0, 1], [1, CARD_END_SCALE]) *
                  (1 + f * (CARD_FOCUS.scale - 1)) *
                  (1 + pulse.get() * 0.045),
            },
         ],
      };
   });

   const walletStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
         journey.get(),
         [0.1, 0.5],
         [0, 1],
         Extrapolation.CLAMP,
      ),
      transform: [
         {
            translateY: interpolate(
               journey.get(),
               [0, 1],
               [70, 0],
               Extrapolation.CLAMP,
            ),
         },
      ],
   }));

   const chevronStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
         journey.get(),
         [0.3, 0.8],
         [1, 0],
         Extrapolation.CLAMP,
      ),
   }));

   const current = FIELDS[index];
   const isLast = index === LAST_INDEX;
   const canContinue = isLast
      ? FIELDS.every((f) => f.isValid(values[f.key]))
      : current.isValid(values[current.key]);

   const wiring = {
      skin: STYLE_BY_ID[styleId],
      values,
      activeKey: done ? null : current.key,
      editable: !done,
      refs,
      onChange,
      onFocus: onFieldFocus,
      onBlur: onFieldBlur,
      onSubmit: advance,
   };

   return (
      <Animated.View style={[styles.root, rootStyle]}>
         <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
            <Animated.View style={[styles.avoider, avoiderStyle]}>
               <View style={styles.header}>
                  <Animated.View style={chevronStyle}>
                     <Pressable onPress={goBack} hitSlop={12} disabled={done}>
                        <ChevronLeft color={Palette.ink} />
                     </Pressable>
                  </Animated.View>
                  <ProgressDots field={field} journey={journey} />
                  <View style={styles.headerSpacer} />
               </View>

               <View style={styles.body}>
                  {/* Every question shares one slot and cross-fades. */}
                  <View style={styles.textSlot}>
                     {FIELDS.map((def, i) => (
                        <Question
                           key={def.key}
                           index={i}
                           def={def}
                           field={field}
                           journey={journey}
                        />
                     ))}

                     {done && !claimed && (
                        <View style={styles.textLayer} pointerEvents="none">
                           <Animated.Text
                              entering={OTP_TITLE_IN}
                              style={styles.otpTitle}
                              numberOfLines={2}
                           >
                              ENTER OTP TO CLAIM YOUR MEMBERSHIP
                           </Animated.Text>
                           <Animated.Text
                              entering={OTP_SUB_IN}
                              style={styles.otpSub}
                           >
                              Sent to {formatPhone(values.phone)}
                           </Animated.Text>
                        </View>
                     )}

                     {claimed && (
                        <View style={styles.textLayer} pointerEvents="none">
                           <Animated.View entering={BADGE_IN}>
                              <StarBadge />
                           </Animated.View>
                           <Animated.Text
                              entering={TITLE_IN}
                              style={styles.welcomeTitle}
                              numberOfLines={2}
                           >
                              WELCOME {values.name.trim().toUpperCase()}!
                           </Animated.Text>
                           {/*
                            * This line is now carrying what the coach-mark
                            * arrows used to say. It is the only explanation of
                            * how the card works anywhere in the flow, so it
                            * states the earn and the reward rather than
                            * gesturing at them.
                            */}
                           <Animated.Text
                              entering={SUB_IN}
                              style={styles.welcomeSub}
                           >
                              1 star for every ₹10. 200 stars = your first
                              reward.
                           </Animated.Text>
                        </View>
                     )}
                  </View>

                  {/* The card travels through here. Paint order is the effect. */}
                  <View style={styles.cardStage}>
                     <Animated.View
                        style={[styles.layer, walletStyle]}
                        pointerEvents="none"
                     >
                        <PocketBack />
                     </Animated.View>

                     <Animated.View style={[styles.cardHolder, cardStyle]}>
                        <Pressable
                           onPress={() => focusField(index)}
                           disabled={done}
                           accessibilityLabel="Edit your membership card"
                        >
                           {/* The tilt only wakes on the welcome screen —
                               during the form the card must stay a form. */}
                           <HoloTilt enabled={claimed}>
                              <LoyaltyCard flip={flip} {...wiring} />
                           </HoloTilt>
                        </Pressable>
                     </Animated.View>

                     <Animated.View
                        style={[styles.layer, walletStyle]}
                        pointerEvents="none"
                     >
                        <PocketFront />
                     </Animated.View>

                  </View>

                  <Animated.View
                     style={[styles.scrim, scrimStyle]}
                     pointerEvents="none"
                  />

                  {!done && (
                     <Animated.View exiting={FOOTER_OUT} style={styles.footer}>
                        <StylePicker value={styleId} onChange={onPickStyle} />
                        <View style={styles.cta}>
                           <PrimaryButton
                              label={isLast ? "CREATE MY CARD" : "CONTINUE"}
                              enabled={canContinue}
                              onPress={advance}
                           />
                        </View>
                     </Animated.View>
                  )}

                  {done && !claimed && (
                     <Animated.View
                        exiting={FOOTER_OUT}
                        style={styles.otpFooter}
                     >
                        <Animated.View
                           style={[styles.otpBlock, otpBlockStyle]}
                        >
                           <OtpInput
                              value={otp}
                              onChange={onOtpChange}
                              status={otpStatus}
                              inputRef={otpRef}
                           />
                           <Pressable
                              onPress={otpStatus === "idle" ? tapFeedback : undefined}
                              disabled={otpStatus !== "idle"}
                              hitSlop={10}
                              style={styles.statusHit}
                           >
                              <Animated.Text
                                 key={otpStatus}
                                 entering={STATUS_IN}
                                 style={[
                                    styles.status,
                                    otpStatus === "ok" && styles.statusOk,
                                    otpStatus === "fail" && styles.statusBad,
                                 ]}
                              >
                                 {OTP_STATUS_TEXT[otpStatus]}
                              </Animated.Text>
                           </Pressable>
                        </Animated.View>
                     </Animated.View>
                  )}

                  {claimed && (
                     <Animated.View style={styles.footer}>
                        <View style={styles.cta}>
                           <PrimaryButton
                              label="LET'S GO"
                              variant="onGreen"
                              onPress={() => router.back()}
                           />
                        </View>
                     </Animated.View>
                  )}
               </View>
            </Animated.View>
         </SafeAreaView>
      </Animated.View>
   );
}

const styles = StyleSheet.create({
   root: { flex: 1 },
   safe: { flex: 1 },
   avoider: { flex: 1 },
   header: {
      height: 40,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 22,
   },
   headerSpacer: { width: 20 },
   body: { flex: 1 },
   // The four bands inside `body` are explicitly ordered. Once anything in a
   // stack carries a zIndex, the ones that don't fall behind it — so the
   // footer has to opt in too or the scrim would cover the cells.
   textSlot: {
      height: 128,
      flexShrink: 1,
      paddingHorizontal: 34,
      zIndex: 2,
   },
   scrim: {
      ...StyleSheet.absoluteFill,
      backgroundColor: "#04130E",
      zIndex: 1,
   },
   textLayer: {
      ...StyleSheet.absoluteFill,
      paddingHorizontal: 34,
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 8,
   },
   // Every fontFamily below is a static single-weight file, so none of these
   // set `fontWeight` — the family already encodes the weight.
   heading: {
      fontFamily: Type.bold,
      fontSize: 22,
      letterSpacing: 0.2,
      textAlign: "center",
   },
   sub: {
      marginTop: 10,
      fontFamily: Type.regular,
      fontSize: 12.5,
      lineHeight: 18,
      color: Palette.inkSoft,
      textAlign: "center",
      maxWidth: 220,
   },
   otpTitle: {
      marginTop: 4,
      fontFamily: Type.bold,
      fontSize: 21,
      letterSpacing: 0.3,
      lineHeight: 27,
      color: Palette.white,
      textAlign: "center",
   },
   otpSub: {
      marginTop: 9,
      fontFamily: Type.regular,
      fontSize: 12.5,
      color: "rgba(255,255,255,0.7)",
      textAlign: "center",
   },
   statusHit: {
      alignSelf: "center",
      marginTop: 15,
      height: 18,
   },
   status: {
      fontFamily: Type.semibold,
      fontSize: 12,
      color: "rgba(255,255,255,0.72)",
   },
   statusOk: { color: "#5BD68A" },
   statusBad: { color: "#FF7A7A" },
   welcomeTitle: {
      marginTop: 16,
      fontFamily: Type.bold,
      fontSize: 27,
      letterSpacing: 0.3,
      color: Palette.white,
      textAlign: "center",
   },
   welcomeSub: {
      marginTop: 8,
      fontFamily: Type.regular,
      fontSize: 12.5,
      color: "rgba(255,255,255,0.7)",
      textAlign: "center",
   },
   badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      paddingHorizontal: 13,
      paddingVertical: 6,
      borderRadius: 15,
      backgroundColor: "rgba(255,255,255,0.16)",
   },
   badgeText: {
      color: Palette.white,
      fontFamily: Type.semibold,
      fontSize: 12,
   },
   cardStage: {
      height: STAGE_HEIGHT,
      width: "100%",
      // The one part of the column allowed to give ground when the keyboard
      // eats the bottom of the screen. The card inside is absolutely
      // positioned, so it keeps its place while the box below it rises.
      flexShrink: 1,
   },
   layer: { ...StyleSheet.absoluteFill, alignItems: "center" },
   cardHolder: {
      position: "absolute",
      top: CARD_TOP,
      left: "50%",
      marginLeft: -CARD.width / 2,
   },
   footer: {
      // `auto` pins the footer to the bottom of the free space instead of a
      // hard height, so it rides up as the avoider shrinks the column.
      marginTop: "auto",
      paddingHorizontal: 22,
      paddingBottom: 6,
      zIndex: 3,
   },
   otpFooter: { marginTop: "auto", zIndex: 3 },
   // No fill of its own: the scrim behind it is what separates the cells from
   // the card, so a panel here would read as a lit rectangle sitting on a
   // dimmed screen rather than as the one thing still in focus.
   otpBlock: {
      paddingHorizontal: 22,
      paddingTop: 18,
      paddingBottom: 16,
   },
   cta: {
      marginTop: 16,
   },
});
