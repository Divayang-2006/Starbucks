import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import Animated, {
   interpolateColor,
   useAnimatedStyle,
   useSharedValue,
   withTiming,
} from 'react-native-reanimated';

import { Border, Gutter, Radius, Space, Surface, TextColor, TextStyles } from '@/theme';

import type { CityFilter } from './geo';
import { DIM_TIMING } from './stage';

/**
 * Four cities and twelve stores is too many to scroll a map between and too few
 * to need a search-as-you-pan. A rail of city pills is the honest middle: it
 * flies the camera and narrows the list in one tap, and because it is derived
 * from the store data it cannot drift out of sync with it.
 *
 * The pills sit directly on the map, so they are translucent cream over green
 * until selected, when they fill solid — the same "selected chips are House
 * Green on cream" logic the design system uses, read in reverse because here the
 * cream is the foreground.
 */

const OFF_FILL = 'rgba(255,255,255,0.13)';
const OFF_BORDER = Border.hairOnDark;

type Props = {
   filters: readonly CityFilter[];
   activeId: string;
   onSelect: (filter: CityFilter) => void;
};

function CityPill({
   filter,
   active,
   onSelect,
}: {
   filter: CityFilter;
   active: boolean;
   onSelect: (filter: CityFilter) => void;
}) {
   const on = useSharedValue(active ? 1 : 0);

   useEffect(() => {
      on.set(withTiming(active ? 1 : 0, DIM_TIMING));
   }, [active, on]);

   const pillStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(on.get(), [0, 1], [OFF_FILL, Surface.app]),
      borderColor: interpolateColor(on.get(), [0, 1], [OFF_BORDER, Surface.app]),
   }));

   const labelStyle = useAnimatedStyle(() => ({
      color: interpolateColor(on.get(), [0, 1], [TextColor.onDark, TextColor.primary]),
   }));

   const countStyle = useAnimatedStyle(() => ({
      color: interpolateColor(on.get(), [0, 1], [TextColor.onDarkMuted, TextColor.tertiary]),
   }));

   return (
      <Pressable
         onPress={() => onSelect(filter)}
         accessibilityRole="button"
         accessibilityState={{ selected: active }}
         accessibilityLabel={`${filter.label}, ${filter.count} stores`}>
         <Animated.View style={[styles.pill, pillStyle]}>
            <Animated.Text style={[styles.label, labelStyle]}>{filter.label}</Animated.Text>
            <Animated.Text style={[styles.count, countStyle]}>{filter.count}</Animated.Text>
         </Animated.View>
      </Pressable>
   );
}

export function CityRail({ filters, activeId, onSelect }: Props) {
   return (
      <ScrollView
         horizontal
         showsHorizontalScrollIndicator={false}
         contentContainerStyle={styles.rail}
         // The rail floats on the map, so it must not eat vertical pans.
         directionalLockEnabled>
         {filters.map((filter) => (
            <CityPill
               key={filter.id}
               filter={filter}
               active={filter.id === activeId}
               onSelect={onSelect}
            />
         ))}
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   rail: {
      paddingHorizontal: Gutter,
      gap: Space.sm,
      alignItems: 'center',
   },
   pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
      height: 34,
      paddingHorizontal: Space.base,
      borderRadius: Radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
   },
   label: {
      ...TextStyles.bodySmStrong,
   },
   count: {
      ...TextStyles.micro,
   },
});
