/**
 * The FSSAI food indicator — a dot inside a rounded square, green for veg and
 * maroon for non-veg.
 *
 * India-market mandatory (§8): it goes on every consumable, on product cards, in
 * list rows and on the PDP. `Diet.veg` / `Diet.nonVeg` are regulated colours —
 * do not restyle them to fit a category accent.
 */

import { StyleSheet, View } from 'react-native';

import { Diet, Radius } from '@/theme';

type Props = {
   veg: boolean;
   size?: number;
};

export function DietMark({ veg, size = 14 }: Props) {
   const color = veg ? Diet.veg : Diet.nonVeg;

   return (
      <View
         style={[styles.box, { width: size, height: size, borderColor: color }]}
         accessibilityLabel={veg ? 'Vegetarian' : 'Non-vegetarian'}
      >
         <View
            style={{
               width: size / 2.6,
               height: size / 2.6,
               borderRadius: size,
               backgroundColor: color,
            }}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   box: {
      borderWidth: 1.4,
      borderRadius: Radius.xs,
      alignItems: 'center',
      justifyContent: 'center',
   },
});
