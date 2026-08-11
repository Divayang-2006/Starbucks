import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { CardLine } from "./CardLine";
import { type FaceWiring, LAST_KEY } from "./CardFace";
import { FIELDS_ON } from "./fields";
import { Type } from "@/theme";
import { CARD, CARD_BACK, Palette } from "./theme";

const LINES = FIELDS_ON("back");

/**
 * The face you write on.
 *
 * The signature panel is the whole reason contact details work on a card: it
 * is the one place on a physical card that exists to be written on, so an
 * input sitting there needs no explaining. Cream panel, ink text, a caret —
 * it reads as writable in a way a gradient never will.
 */
export function CardBack({
   skin,
   values,
   activeKey,
   editable,
   refs,
   onChange,
   onFocus,
   onBlur,
   onSubmit,
}: FaceWiring) {
   return (
      <View style={styles.face}>
         <Svg
            width={CARD.width}
            height={CARD.height}
            style={StyleSheet.absoluteFill}
         >
            <Defs>
               <LinearGradient id={`back-${skin.id}`} x1="0" y1="0" x2="0.7" y2="1">
                  <Stop offset="0" stopColor={skin.back[0]} />
                  <Stop offset="1" stopColor={skin.back[1]} />
               </LinearGradient>
            </Defs>
            <Rect
               width={CARD.width}
               height={CARD.height}
               rx={CARD.radius}
               fill={`url(#back-${skin.id})`}
            />
         </Svg>

         {/* Full-bleed, so it sits outside the padded content block. */}
         <View style={[styles.stripe, { backgroundColor: skin.magstripe }]} />

         <View style={styles.content}>
            <View style={styles.panel}>
               {LINES.map((def) => (
                  <CardLine
                     key={def.key}
                     def={def}
                     value={values[def.key]}
                     active={activeKey === def.key}
                     editable={editable}
                     tone="onPanel"
                     last={def.key === LAST_KEY}
                     inputRef={refs[def.key]}
                     onChangeText={(raw) => onChange(def.key, raw)}
                     onFocus={() => onFocus(def.key)}
                     onBlur={onBlur}
                     onSubmit={onSubmit}
                  />
               ))}
            </View>

            <Text style={styles.print} maxFontSizeMultiplier={1.1}>
               This card remains the property of Starbucks and is not
               transferable.
            </Text>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   face: {
      width: CARD.width,
      height: CARD.height,
   },
   stripe: {
      position: "absolute",
      left: 0,
      right: 0,
      top: CARD_BACK.stripeTop,
      height: CARD_BACK.stripeHeight,
   },
   content: {
      ...StyleSheet.absoluteFill,
      paddingHorizontal: CARD_BACK.pad,
      paddingTop: CARD_BACK.stripeTop + CARD_BACK.stripeHeight + 14,
      paddingBottom: CARD_BACK.pad,
   },
   panel: {
      backgroundColor: Palette.cream,
      borderRadius: CARD_BACK.panelRadius,
      paddingHorizontal: 9,
      paddingTop: 5,
      paddingBottom: 4,
   },
   print: {
      marginTop: "auto",
      fontFamily: Type.regular,
      fontSize: 6.5,
      lineHeight: 9,
      includeFontPadding: false,
      color: "rgba(255,255,255,0.4)",
   },
});
