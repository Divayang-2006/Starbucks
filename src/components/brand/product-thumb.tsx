/**
 * The product square: an image, a fallback, and the FSSAI mark.
 *
 * The mark moves onto the thumbnail here, where the screens had it inline on the
 * meta line. That is a deliberate change and worth stating: §8 requires the
 * indicator to accompany the *item*, and a mark that travels with the picture
 * cannot be separated from it by a layout change, a truncated meta string or a
 * variant of the row that drops the meta line entirely. It also frees the meta
 * line to be one flowing string instead of a two-element flex row that every
 * caller rebuilds.
 *
 * The mark sits on a small white pad. `Diet.veg` and `Diet.nonVeg` are regulated
 * colours that cannot be adjusted for contrast (DESIGN_SYSTEM §2), so the only
 * legal way to guarantee they read on top of arbitrary photography is to put a
 * known surface behind them.
 *
 * No image yet? Pass nothing. The fallback is `PlaceholderBlock`, which is
 * honest — a recessed slot rather than a grey box pretending to be a photo.
 */

import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { DietMark, PlaceholderBlock } from '@/components/chrome';
import { Radius, Sizes, Space, Surface } from '@/theme';

type Props = {
   /** An `<Image>`, absolutely filled by this component. */
   image?: ReactNode;
   /** Omit entirely for a non-consumable — merch, gift cards. */
   veg?: boolean;
   size?: number;
   /**
    * Fill the container's width and stay square, ignoring `size`. For a card
    * whose own width is a grid fraction rather than a fixed number.
    */
   fill?: boolean;
   /**
    * Media inside a card is `Radius.lg`. See the table in `placeholder.tsx`
    * before picking anything else.
    */
   radius?: number;
   /** Caps text in the fallback slot. Ignored once there is an image. */
   label?: string;
   style?: StyleProp<ViewStyle>;
};

export function ProductThumb({
   image,
   veg,
   size = Sizes.productThumb,
   fill = false,
   radius = Radius.lg,
   label,
   style,
}: Props) {
   return (
      <View
         style={[
            styles.box,
            fill ? styles.boxFill : { width: size, height: size },
            { borderRadius: radius },
            style,
         ]}
      >
         {image ?? (
            <PlaceholderBlock
               label={label}
               height={size}
               radius={radius}
               style={fill ? styles.blockFill : undefined}
            />
         )}

         {veg !== undefined ? (
            <View style={styles.mark}>
               <DietMark veg={veg} />
            </View>
         ) : null}
      </View>
   );
}

const styles = StyleSheet.create({
   box: {
      /** Clips a photo to the corner radius; the fallback rounds itself anyway. */
      overflow: 'hidden',
      backgroundColor: Surface.sunken,
   },
   boxFill: {
      width: '100%',
      aspectRatio: 1,
   },
   /** Overrides the block's own `height`, which is last in its own style array. */
   blockFill: {
      width: '100%',
      height: '100%',
   },
   mark: {
      position: 'absolute',
      left: Space.xs,
      bottom: Space.xs,
      padding: Space.xxs,
      borderRadius: Radius.xs,
      backgroundColor: Surface.raised,
   },
});
