/**
 * A white card on cream, with the green-tinted shadow.
 *
 * The shadow is the point: `Elevation.card` is tinted House Green because a
 * neutral grey shadow on a cream surface is the clearest tell of a cheap clone
 * (DESIGN_SYSTEM §2). Every card in the app goes through here so none of them
 * can quietly opt out.
 */

import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Elevation, Pressed, Radius, Space, Surface } from '@/theme';

type Props = {
   children: ReactNode;
   /** Pass to make the whole card a tap target. */
   onPress?: () => void;
   accessibilityLabel?: string;
   style?: StyleProp<ViewStyle>;
};

export function Card({ children, onPress, accessibilityLabel, style }: Props) {
   if (!onPress) {
      return <View style={[styles.card, style]}>{children}</View>;
   }

   return (
      <Pressable
         accessibilityRole="button"
         accessibilityLabel={accessibilityLabel}
         onPress={onPress}
         style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      >
         {children}
      </Pressable>
   );
}

const styles = StyleSheet.create({
   card: {
      backgroundColor: Surface.raised,
      borderRadius: Radius.xl,
      padding: Space.base,
      ...Elevation.card,
   },
   /** One value app-wide — see `Pressed` in `@/theme` for which won and why. */
   pressed: {
      opacity: Pressed.opacity,
   },
});
