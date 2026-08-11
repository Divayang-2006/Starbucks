import { StyleSheet, Text, View } from "react-native";
import Svg, {
   ClipPath,
   Defs,
   G,
   LinearGradient,
   Path,
   Rect,
   Stop,
} from "react-native-svg";

import { CardLine } from "./CardLine";
import { type FaceWiring, LAST_KEY } from "./CardFace";
import { CardPattern } from "./CardPattern";
import { SIREN_PATH } from "./SirenLogo";
import { FIELDS_ON, memberSeeds } from "./fields";
import { Type } from "./fonts";
import { CARD, memberNumber } from "./theme";

const LINES = FIELDS_ON("front");

/**
 * The siren watermark. Printed big, in light white, and deliberately hung off
 * the corner so the card edge trims it — a press mark, not a sticker. It sits
 * under the gloss sweep so the light overlay reads as one surface.
 *
 * Flip LOGO_CORNER to "bottom-left" to hang it off the other side.
 */
const LOGO_CORNER: "bottom-right" | "bottom-left" = "bottom-right";
const SIREN_SIZE = 118;
const SIREN_BLEED_X = 30;
const SIREN_BLEED_Y = 34;
const SIREN_X =
   LOGO_CORNER === "bottom-right"
      ? CARD.width - SIREN_SIZE + SIREN_BLEED_X
      : -SIREN_BLEED_X;
const SIREN_Y = CARD.height - SIREN_SIZE + SIREN_BLEED_Y;
/** The source glyph is drawn on a 24x24 box. */
const SIREN_SCALE = SIREN_SIZE / 24;

/**
 * The face you show. Zero image assets: two SVG gradient rects, a printed
 * texture, the live lines, and a member number that finishes itself as the
 * answers come in.
 */
export function CardFront({
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
               {/* Ids carry the edition, so two skins on screen can't collide. */}
               <LinearGradient id={`face-${skin.id}`} x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={skin.face[0]} />
                  <Stop offset="1" stopColor={skin.face[1]} />
               </LinearGradient>
               <LinearGradient
                  id={`gloss-${skin.id}`}
                  x1="0"
                  y1="0"
                  x2="0.62"
                  y2="0.72"
               >
                  <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.2} />
                  <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
               </LinearGradient>
               {/* The rounded card bounds, so the bleeding siren gets cut by
                   the actual corner radius and not the square canvas. */}
               <ClipPath id={`clip-${skin.id}`}>
                  <Rect
                     width={CARD.width}
                     height={CARD.height}
                     rx={CARD.radius}
                  />
               </ClipPath>
            </Defs>
            <Rect
               width={CARD.width}
               height={CARD.height}
               rx={CARD.radius}
               fill={`url(#face-${skin.id})`}
            />
            <CardPattern pattern={skin.pattern} />
            <G clipPath={`url(#clip-${skin.id})`}>
               <Path
                  d={SIREN_PATH}
                  fill="#FFFFFF"
                  fillOpacity={0.16}
                  transform={`translate(${SIREN_X}, ${SIREN_Y}) scale(${SIREN_SCALE})`}
               />
            </G>
            <Rect
               width={CARD.width}
               height={CARD.height}
               rx={CARD.radius}
               fill={`url(#gloss-${skin.id})`}
            />
         </Svg>

         <View style={styles.content}>
            <View style={styles.lines}>
               {LINES.map((def) => (
                  <CardLine
                     key={def.key}
                     def={def}
                     value={values[def.key]}
                     active={activeKey === def.key}
                     editable={editable}
                     last={def.key === LAST_KEY}
                     inputRef={refs[def.key]}
                     onChangeText={(raw) => onChange(def.key, raw)}
                     onFocus={() => onFocus(def.key)}
                     onBlur={onBlur}
                     onSubmit={onSubmit}
                  />
               ))}
            </View>

            {/* The watermark owns the right half of the footer band, so the
                member number keeps the left and nothing else competes. */}
            <View style={styles.footer}>
               <View>
                  <Text style={styles.numberLabel} maxFontSizeMultiplier={1.1}>
                     MEMBER NO.
                  </Text>
                  <Text
                     style={styles.number}
                     numberOfLines={1}
                     maxFontSizeMultiplier={1.1}
                  >
                     {memberNumber(memberSeeds(values))}
                  </Text>
               </View>
            </View>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   face: {
      width: CARD.width,
      height: CARD.height,
   },
   content: {
      ...StyleSheet.absoluteFill,
      padding: 14,
   },
   lines: {
      gap: 9,
   },
   footer: {
      marginTop: "auto",
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
   },
   numberLabel: {
      fontFamily: Type.semibold,
      fontSize: 7,
      letterSpacing: 1.1,
      lineHeight: 9,
      includeFontPadding: false,
      color: "rgba(255,255,255,0.5)",
   },
   number: {
      fontFamily: Type.display,
      fontSize: 13,
      letterSpacing: 1.6,
      lineHeight: 17,
      includeFontPadding: false,
      color: "rgba(255,255,255,0.9)",
   },
});
