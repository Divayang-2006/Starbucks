import type { RefObject } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import type { FieldDef } from "./fields";
import { Type } from "@/theme";
import { Palette } from "./theme";

type Tone = "onCard" | "onPanel";

/**
 * Card faces are dark, the signature panel is cream. Everything that has to
 * flip colour between the two lives here rather than in a pile of ternaries.
 */
const SKINS: Record<
   Tone,
   {
      label: string;
      value: string;
      placeholder: string;
      caret: string;
      ruleOn: string;
      ruleOff: string;
   }
> = {
   onCard: {
      label: "rgba(255,255,255,0.5)",
      value: Palette.white,
      placeholder: "rgba(255,255,255,0.34)",
      caret: Palette.white,
      ruleOn: "rgba(255,255,255,0.6)",
      // Idle lines carry no rule. A real card has no ruled fields, and a
      // permanent hairline between name and date of birth reads as a form
      // printed on a card rather than a card. The rule earns its place only
      // on the line being typed into.
      ruleOff: "transparent",
   },
   onPanel: {
      label: "rgba(30,57,50,0.45)",
      value: Palette.ink,
      placeholder: "rgba(30,57,50,0.3)",
      caret: Palette.screenGreen,
      ruleOn: "rgba(30,57,50,0.45)",
      ruleOff: "transparent",
   },
};

type Props = {
   def: FieldDef;
   value: string;
   /** Is this the line the flow is currently asking about? */
   active: boolean;
   editable: boolean;
   tone?: Tone;
   last?: boolean;
   inputRef: RefObject<TextInput | null>;
   onChangeText: (raw: string) => void;
   onFocus: () => void;
   onBlur: () => void;
   onSubmit: () => void;
};

/**
 * One printed line on the card that also happens to be a text field.
 *
 * The micro-label and the rule underneath are doing real work. A field
 * embedded in a decorative object reads as *display* unless something tells
 * the eye it is *input* — and the rule brightening on exactly one line is the
 * cheapest way to say "the keyboard is pointing here".
 *
 * Text and TextInput share the `value` style with a pinned line box, so the
 * line does not shift by a pixel when it swaps between the two.
 */
export function CardLine({
   def,
   value,
   active,
   editable,
   tone = "onCard",
   last = false,
   inputRef,
   onChangeText,
   onFocus,
   onBlur,
   onSubmit,
}: Props) {
   const skin = SKINS[tone];
   const display = def.format(value);

   return (
      <View
         style={[
            styles.wrap,
            { borderBottomColor: active ? skin.ruleOn : skin.ruleOff },
         ]}
      >
         <Text
            style={[styles.label, { color: skin.label }]}
            numberOfLines={1}
            maxFontSizeMultiplier={1.1}
         >
            {def.label}
         </Text>
         {editable ? (
            <TextInput
               ref={inputRef}
               value={display}
               onChangeText={onChangeText}
               onFocus={onFocus}
               onBlur={onBlur}
               onSubmitEditing={onSubmit}
               returnKeyType={last ? "done" : "next"}
               // `submit` keeps the keyboard up between fields — the flow only
               // ever loses it on the last answer, or on a face flip.
               submitBehavior={last ? "blurAndSubmit" : "submit"}
               placeholder={def.placeholder}
               placeholderTextColor={skin.placeholder}
               selectionColor={skin.caret}
               cursorColor={skin.caret}
               keyboardAppearance={tone === "onPanel" ? "light" : "dark"}
               maxFontSizeMultiplier={1.1}
               style={[styles.value, styles.input, { color: skin.value }]}
               {...def.input}
            />
         ) : (
            <Text
               style={[
                  styles.value,
                  { color: display ? skin.value : skin.placeholder },
               ]}
               numberOfLines={1}
               maxFontSizeMultiplier={1.1}
            >
               {display || def.placeholder}
            </Text>
         )}
      </View>
   );
}

const styles = StyleSheet.create({
   wrap: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      paddingBottom: 3,
   },
   label: {
      fontFamily: Type.semibold,
      fontSize: 7,
      letterSpacing: 1.1,
      lineHeight: 9,
      includeFontPadding: false,
   },
   // Bebas Neue is a single static weight with no lowercase, so no
   // `fontWeight` here and "Charles" prints as CHARLES.
   value: {
      fontFamily: Type.emboss,
      fontSize: 16,
      letterSpacing: 1.4,
      // Pinned so the static Text and the editable TextInput occupy an
      // identical line box; without it the card twitches on every swap.
      height: 20,
      lineHeight: 20,
      includeFontPadding: false,
   },
   input: {
      padding: 0,
      margin: 0,
      textAlignVertical: "center",
   },
});
