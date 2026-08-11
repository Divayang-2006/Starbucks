import type { TextInputProps } from "react-native";

import { formatDob, formatPhone, isRealDob } from "./theme";

export type FieldKey = "name" | "dob" | "phone";
export type Face = "front" | "back";
export type Values = Record<FieldKey, string>;

export type FieldDef = {
   key: FieldKey;
   /** Which side of the card this line is printed on. */
   face: Face;
   /** Micro-caps printed above the value. Sells "this is a field". */
   label: string;
   /** Question shown above the card. */
   heading: string;
   sub: string;
   placeholder: string;
   /** Passed straight through to the TextInput. */
   input: Pick<
      TextInputProps,
      | "keyboardType"
      | "autoCapitalize"
      | "autoComplete"
      | "textContentType"
      | "maxLength"
      | "autoCorrect"
   >;
   /** Raw keystrokes -> what we store. Digit fields drop everything else. */
   clean: (raw: string) => string;
   /** Stored value -> what is printed on the card. */
   format: (value: string) => string;
   isValid: (value: string) => boolean;
};

const digitsOnly = (raw: string) => raw.replace(/\D/g, "");

/**
 * The whole onboarding flow, as data.
 *
 * Order matters twice over: it is the order the questions are asked, and — via
 * `face` — it is the choreography. A field whose face differs from the one
 * before it triggers the card flip. Adding a question is an entry in this
 * array; nothing in OnboardingFlow counts stages.
 *
 * Email is deliberately absent. `firstname.lastname@company.com` is thirty
 * characters and there is no honest way to print that on a 236pt card face —
 * it would force the type down to a size that undoes the whole idea. If it
 * turns out to be needed, it wants its own screen, not a line on the card.
 */
export const FIELDS: FieldDef[] = [
   {
      key: "name",
      face: "front",
      label: "NAME",
      heading: "WHAT'S YOUR NAME?",
      sub: "We use your name to personalise the content of this app",
      placeholder: "Your name",
      input: {
         keyboardType: "default",
         autoCapitalize: "words",
         autoComplete: "name",
         textContentType: "name",
         autoCorrect: false,
         maxLength: 18,
      },
      // Collapse runs of spaces but keep a trailing one, so typing a space
      // between first and last name isn't swallowed as you type it.
      clean: (raw) => raw.replace(/\s{2,}/g, " ").trimStart(),
      format: (v) => v,
      isValid: (v) => v.trim().length > 1,
   },
   {
      key: "dob",
      face: "front",
      label: "DATE OF BIRTH",
      heading: "WHEN IS YOUR BIRTHDAY?",
      sub: "So we can send you something on the day",
      placeholder: "DD/MM/YYYY",
      input: {
         keyboardType: "number-pad",
         autoComplete: "birthdate-full",
         autoCorrect: false,
         // The formatted value, not the digit count: 25/10/1991 is 10 chars.
         maxLength: 10,
      },
      clean: (raw) => digitsOnly(raw).slice(0, 8),
      format: formatDob,
      isValid: isRealDob,
   },
   {
      key: "phone",
      face: "back",
      label: "MOBILE NUMBER",
      heading: "YOUR MOBILE NUMBER",
      sub: "We'll text you a one-time code. Nothing else, ever",
      placeholder: "00000 00000",
      input: {
         keyboardType: "phone-pad",
         autoComplete: "tel",
         textContentType: "telephoneNumber",
         autoCorrect: false,
         maxLength: 11,
      },
      clean: (raw) => digitsOnly(raw).slice(0, 10),
      format: formatPhone,
      isValid: (v) => v.length === 10,
   },
];

export const FIELDS_ON = (face: Face) => FIELDS.filter((f) => f.face === face);

export const FIELD_BY_KEY = Object.fromEntries(
   FIELDS.map((f) => [f.key, f]),
) as Record<FieldKey, FieldDef>;

export const EMPTY_VALUES: Values = { name: "", dob: "", phone: "" };

export const memberSeeds = (values: Values) => [
   values.name,
   values.dob,
   values.phone,
];
