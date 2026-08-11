import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  type SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { FIELDS } from './fields';
import { Palette } from './theme';

type Props = {
  /** Animated field index — fractional while sliding between questions. */
  field: SharedValue<number>;
  /** 0 while collecting, 1 once the card is in the wallet. */
  journey: SharedValue<number>;
};

/**
 * Each dot measures its own distance from the current field and reacts. There
 * is no per-dot state and no effect — one shared value feeds all of them, and
 * the count comes straight off FIELDS.
 */
function Dot({ index, field, journey }: { index: number } & Props) {
  const style = useAnimatedStyle(() => {
    const distance = Math.abs(field.get() - index);
    return {
      width: interpolate(distance, [0, 1], [22, 6], Extrapolation.CLAMP),
      opacity: interpolate(distance, [0, 1], [1, 0.3], Extrapolation.CLAMP),
      backgroundColor: interpolateColor(journey.get(), [0.4, 1], [Palette.ink, Palette.white]),
    };
  });

  return <Animated.View style={[styles.dot, style]} />;
}

export function ProgressDots({ field, journey }: Props) {
  return (
    <View style={styles.row}>
      {FIELDS.map((f, i) => (
        <Dot key={f.key} index={i} field={field} journey={journey} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
