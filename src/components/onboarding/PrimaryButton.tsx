import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Type } from './fonts';
import { Palette } from './theme';

type Variant = 'onCream' | 'onGreen';

const SKINS: Record<Variant, { fillOff: string; fillOn: string; textOff: string; textOn: string }> = {
  onCream: {
    fillOff: Palette.disabled,
    fillOn: Palette.screenGreen,
    textOff: 'rgba(30,57,50,0.38)',
    textOn: Palette.white,
  },
  onGreen: {
    fillOff: 'rgba(255,255,255,0.22)',
    fillOn: Palette.cream,
    textOff: 'rgba(255,255,255,0.55)',
    textOn: Palette.ink,
  },
};

type Props = {
  label: string;
  onPress: () => void;
  enabled?: boolean;
  variant?: Variant;
};

/**
 * The enabled/disabled flip is animated rather than a hard style swap — that
 * 280ms colour fade is what makes the form feel responsive instead of binary.
 */
export function PrimaryButton({ label, onPress, enabled = true, variant = 'onCream' }: Props) {
  const skin = SKINS[variant];
  const on = useSharedValue(enabled ? 1 : 0);
  const pressed = useSharedValue(0);

  useEffect(() => {
    on.set(withTiming(enabled ? 1 : 0, { duration: 280, easing: Easing.out(Easing.quad) }));
  }, [enabled, on]);

  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(on.get(), [0, 1], [skin.fillOff, skin.fillOn]),
    transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.975]) }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(on.get(), [0, 1], [skin.textOff, skin.textOn]),
  }));

  return (
    <Pressable
      disabled={!enabled}
      onPressIn={() => pressed.set(withTiming(1, { duration: 90 }))}
      onPressOut={() => pressed.set(withSpring(0, { damping: 15, stiffness: 260, mass: 0.5 }))}
      onPress={onPress}>
      <Animated.View style={[styles.box, boxStyle]}>
        <Animated.Text style={[styles.label, textStyle]}>{label}</Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: Type.semibold,
    fontSize: 13,
    letterSpacing: 1.6,
  },
});
