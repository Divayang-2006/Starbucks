import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
   interpolate,
   interpolateColor,
   useAnimatedStyle,
   useSharedValue,
   withSpring,
   withTiming,
} from 'react-native-reanimated';

import { Action, Radius, Sizes, TextStyles } from '@/theme';

import { PRESS_SPRING, PRESS_TIMING } from './stage';

/**
 * The gate's one button.
 *
 * It commits *immediately* — no confirming animation, no delay. The root
 * layout's `<Stack.Protected>` guard is watching the session, so the screen is
 * being replaced the moment `selectStore` lands; anything staged here would be
 * cut off halfway. All the feedback the press needs is the scale, which is
 * instant and belongs to the finger rather than to the transition.
 *
 * Its own component rather than the onboarding flow's `PrimaryButton` because
 * that one is skinned from `onboarding/theme.ts`, which still carries a private
 * palette (see `docs/DESIGN_SYSTEM.md` §5). This one is tokens only.
 */

type Props = {
   label: string;
   onPress: () => void;
};

export function ConfirmButton({ label, onPress }: Props) {
   const pressed = useSharedValue(0);

   const boxStyle = useAnimatedStyle(() => ({
      transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.975]) }],
      backgroundColor: interpolateColor(
         pressed.get(),
         [0, 1],
         [Action.primary, Action.primaryPressed],
      ),
   }));

   return (
      <Pressable
         onPressIn={() => pressed.set(withTiming(1, PRESS_TIMING))}
         onPressOut={() => pressed.set(withSpring(0, PRESS_SPRING))}
         onPress={onPress}
         accessibilityRole="button"
         accessibilityLabel={label}>
         <Animated.View style={[styles.box, boxStyle]}>
            <Text style={styles.label} maxFontSizeMultiplier={1.2}>
               {label}
            </Text>
         </Animated.View>
      </Pressable>
   );
}

const styles = StyleSheet.create({
   box: {
      height: Sizes.buttonHeight,
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
   },
   label: {
      ...TextStyles.bodyStrong,
      color: Action.onPrimary,
      letterSpacing: 0.3,
   },
});
