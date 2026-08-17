/**
 * A product, in either orientation.
 *
 * `index.tsx`'s rail tile and `order.tsx`'s menu row are the same object rotated:
 * a picture, a size-and-kcal line, a name, a price and a way to add one. They
 * were written twice, with two copies of the price style and two copies of the
 * 30pt add button, and they had already drifted — the tile reserved a 40pt
 * minimum for the name and the row did not, so the same product sat at different
 * heights on two screens.
 *
 * One component, one `variant`. The tile stacks; the row is a `ListRow` with the
 * thumb in its leading slot and the price foot in its `children` slot, which is
 * exactly the slot `ListRow` grew for this.
 *
 * `trailing` overrides the add button. A cart line wants a `Stepper` there, a
 * sold-out item wants a `Chip`, and neither should mean a third variant.
 */

import { type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { PriceTag } from './price-tag';
import { ProductThumb } from './product-thumb';

import { Card, ListRow } from '@/components/chrome';
import { IconButton } from '@/components/controls';
import { RailCard, Sizes, Space, TextColor, TextStyles } from '@/theme';

type Props = {
   name: string;
   /** `TALL · 354 ml · 655 kcal`. One string — this does not compose it. */
   meta?: string;
   price: number;
   /** Pre-discount price, struck through by `PriceTag`. */
   was?: number;
   /** Cheapest of several sizes, so the price reads "from ₹x". */
   from?: boolean;
   /** Omit for a non-consumable. Drives the FSSAI mark on the thumb. */
   veg?: boolean;
   image?: ReactNode;
   variant?: 'tile' | 'row';
   /**
    * Tile only. A number for a rail — pass a `RailCard` step. `'fill'` inside a
    * `Grid`, where the cell already decides the width and a fixed one would
    * fight it.
    */
   width?: number | 'fill';
   onPress?: () => void;
   /** Renders the add button. Omit it and the foot is just a price. */
   onAdd?: () => void;
   /** Replaces the add button — a `Stepper`, a sold-out `Chip`. */
   trailing?: ReactNode;
   style?: StyleProp<ViewStyle>;
};

export function ProductCard({
   name,
   meta,
   price,
   was,
   from,
   veg,
   image,
   variant = 'tile',
   width = RailCard.compact,
   onPress,
   onAdd,
   trailing,
   style,
}: Props) {
   const foot = (
      <View style={styles.foot}>
         <PriceTag amount={price} was={was} from={from} />

         {trailing ??
            (onAdd ? (
               <IconButton
                  glyph="plus"
                  label={`Add ${name}`}
                  size={Sizes.inlineControl}
                  onPress={onAdd}
               />
            ) : null)}
      </View>
   );

   if (variant === 'row') {
      return (
         <ListRow
            surface="card"
            align="top"
            kicker={meta}
            /** So `354 ml` is `354 ml` in a list and in a rail. See `ListRow`. */
            kickerStyle="micro"
            title={name}
            leading={<ProductThumb image={image} veg={veg} />}
            onPress={onPress}
            chevron={false}
            style={style}
         >
            {foot}
         </ListRow>
      );
   }

   const fills = width === 'fill';

   return (
      <Card
         onPress={onPress}
         accessibilityLabel={name}
         style={[!fills && { width: width as number }, style]}
      >
         {/* `Card` pads by `Space.base` on both sides — that is what the thumb loses. */}
         <ProductThumb
            image={image}
            veg={veg}
            fill={fills}
            size={fills ? undefined : (width as number) - Space.base * 2}
         />

         {meta ? (
            <Text style={styles.meta} numberOfLines={1}>
               {meta}
            </Text>
         ) : null}

         <Text style={styles.name} numberOfLines={2}>
            {name}
         </Text>

         {foot}
      </Card>
   );
}

const styles = StyleSheet.create({
   meta: {
      ...TextStyles.micro,
      color: TextColor.secondary,
      marginTop: Space.md,
   },
   name: {
      ...TextStyles.bodySmStrong,
      color: TextColor.primary,
      marginTop: Space.xs,
      /**
       * Two lines' worth, reserved whether or not the name needs it. Without it
       * a rail of products has its prices at three different heights, which
       * reads as a rendering glitch rather than as variable-length names.
       */
      minHeight: 40,
   },
   foot: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Space.sm,
      marginTop: Space.sm,
   },
});
