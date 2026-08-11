import { Pressable, StyleSheet, Text, View } from "react-native";

import { CARD_STYLES, type CardStyleId, STYLE_BY_ID } from "./cardStyles";
import { Type } from "@/theme";
import { tapFeedback } from "./haptics";
import { Palette } from "./theme";

type Props = {
   value: CardStyleId;
   onChange: (id: CardStyleId) => void;
};

/**
 * Editions, picked without spending a step on it.
 *
 * This deliberately isn't question four. It sits under the card for the whole
 * flow, so anyone who cares can recolour their card while they answer, and
 * anyone who doesn't never has to acknowledge it exists. Personalisation at
 * zero cost to the funnel.
 */
export function StylePicker({ value, onChange }: Props) {
   return (
      <View style={styles.wrap}>
         <View style={styles.row}>
            {CARD_STYLES.map((s) => {
               const selected = s.id === value;
               return (
                  <Pressable
                     key={s.id}
                     hitSlop={6}
                     accessibilityRole="button"
                     accessibilityLabel={s.name}
                     accessibilityState={{ selected }}
                     onPress={() => {
                        if (selected) return;
                        tapFeedback();
                        onChange(s.id);
                     }}
                     style={[styles.ring, selected && styles.ringOn]}
                  >
                     <View
                        style={[styles.dot, { backgroundColor: s.swatch }]}
                     />
                  </Pressable>
               );
            })}
         </View>
         <Text style={styles.name}>{STYLE_BY_ID[value].name}</Text>
      </View>
   );
}

const styles = StyleSheet.create({
   wrap: { alignItems: "center" },
   row: {
      flexDirection: "row",
      gap: 10,
   },
   ring: {
      padding: 2,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: "transparent",
   },
   ringOn: {
      borderColor: Palette.ink,
   },
   dot: {
      width: 24,
      height: 24,
      borderRadius: 12,
   },
   name: {
      marginTop: 7,
      fontFamily: Type.semibold,
      fontSize: 9.5,
      letterSpacing: 1.4,
      textTransform: "uppercase",
      color: Palette.inkSoft,
   },
});
