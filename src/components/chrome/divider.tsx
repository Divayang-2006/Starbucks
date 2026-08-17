/**
 * One hairline.
 *
 * Trivial enough that four screens each drew their own, which is how
 * `rewards.tsx` ended up separating a timeline with `Border.strong`. That token
 * is a *chip and card outline* — a colour picked to read as a real edge around
 * an object. Used as a separator it is roughly twice as loud as the rest of the
 * app's rules and it makes a list look like a table.
 *
 * `Border.hair` on light, `Border.hairOnDark` on green. Those are the only two,
 * and this component is where that stays true.
 *
 * Thickness is `StyleSheet.hairlineWidth`, not 1: on a 3x screen a 1pt rule is
 * three device pixels and reads as a deliberate line rather than a division.
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Border } from '@/theme';

type Props = {
   tone?: 'light' | 'inverse';
   /**
    * `vertical` is the rule between cells in a stat strip. It stretches to the
    * row's height unless given a `length`.
    */
   orientation?: 'horizontal' | 'vertical';
   /** Fixed cross-axis length, when stretching would make the rule too tall. */
   length?: number;
   /** Indent from the leading edge — for a list whose rows have a leading glyph. */
   inset?: number;
   style?: StyleProp<ViewStyle>;
};

export function Divider({
   tone = 'light',
   orientation = 'horizontal',
   length,
   inset,
   style,
}: Props) {
   const color = tone === 'inverse' ? Border.hairOnDark : Border.hair;
   const vertical = orientation === 'vertical';

   return (
      <View
         pointerEvents="none"
         style={[
            vertical ? styles.vertical : styles.horizontal,
            { backgroundColor: color },
            vertical
               ? length !== undefined && { height: length, alignSelf: 'center' }
               : inset !== undefined && { marginLeft: inset },
            style,
         ]}
      />
   );
}

const styles = StyleSheet.create({
   horizontal: {
      height: StyleSheet.hairlineWidth,
      alignSelf: 'stretch',
   },
   vertical: {
      width: StyleSheet.hairlineWidth,
      alignSelf: 'stretch',
   },
});
