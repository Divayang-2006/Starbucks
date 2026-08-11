import type { RefObject } from "react";
import type { TextInput } from "react-native";

import type { CardStyle } from "./cardStyles";
import { FIELDS, type FieldKey, type Values } from "./fields";

/**
 * Everything a card face needs to render its lines as live fields. Both faces
 * take the identical bundle, so OnboardingFlow assembles it once and neither
 * face has to know which questions live on the other side.
 */
export type FaceWiring = {
   /** The chosen edition: gradients, magstripe colour, printed pattern. */
   skin: CardStyle;
   values: Values;
   /** The line the flow is currently asking about, or null in the wallet. */
   activeKey: FieldKey | null;
   editable: boolean;
   refs: Record<FieldKey, RefObject<TextInput | null>>;
   onChange: (key: FieldKey, raw: string) => void;
   onFocus: (key: FieldKey) => void;
   onBlur: () => void;
   onSubmit: () => void;
};

export const LAST_KEY = FIELDS[FIELDS.length - 1].key;
