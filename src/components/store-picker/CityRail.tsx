import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import Animated, {
   interpolateColor,
   useAnimatedStyle,
   useSharedValue,
   withTiming,
} from 'react-native-reanimated';

import { Border, Gutter, Radius, Space, Surface, TextColor, TextStyles } from '@/theme';

import { CityTile } from './CityTile';
import type { CityFilter } from './geo';
import { CITY_CARD, DIM_TIMING } from './stage';

/**
 * Four cities and twelve stores is too many to scroll a map between and too few
 * to need a search-as-you-pan. A rail is the honest middle: it flies the camera
 * and narrows the list in one tap, and because it is derived from the store data
 * it cannot drift out of sync with it.
 *
 * ## Cards, not pills
 *
 * These were text pills. A pill is a filter; a card is a *place*, and this rail
 * is the one on-screen answer to "where else could I be picking up?" — the
 * landmark does in one glance what the word "Bengaluru" does in one reading. It
 * also makes the rail worth the vertical space it now costs, which is the trade
 * that lets the header collapse away when the sheet comes up.
 *
 * The tiles are placeholders. `CityTile` says what replaces them and when.
 *
 * ## Why the tile does not change with selection
 *
 * Only the card's frame reacts: fill, border, and the label colours. The mint
 * square inside it is constant, because the moment it inherits the card's state
 * a selected tile and an unselected one need different art — and the real
 * renders, when they land, will be one PNG each. That is the same rule the map
 * pins ended up at, and it is why `docs/CITY_IMAGERY.md` specifies an opaque
 * mint ground rather than transparency.
 */

const OFF_FILL = 'rgba(255,255,255,0.13)';
const OFF_BORDER = Border.hairOnDark;

type Props = {
   filters: readonly CityFilter[];
   activeId: string;
   onSelect: (filter: CityFilter) => void;
};

function CityCard({
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

   const cardStyle = useAnimatedStyle(() => ({
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
         <Animated.View style={[styles.card, cardStyle]}>
            <Animated.View style={styles.tile}>
               <CityTile city={filter.id} size={CITY_CARD.tile} />
            </Animated.View>
            <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
               {filter.label}
            </Animated.Text>
            <Animated.Text style={[styles.count, countStyle]} numberOfLines={1}>
               {filter.count} {filter.count === 1 ? 'store' : 'stores'}
            </Animated.Text>
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
         // The rail floats over the map, so it must not eat vertical pans.
         directionalLockEnabled>
         {filters.map((filter) => (
            <CityCard
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
      alignItems: 'flex-start',
   },
   card: {
      width: CITY_CARD.width,
      padding: CITY_CARD.padding,
      gap: 2,
      borderRadius: Radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      alignItems: 'center',
   },
   /**
    * The square slot. Painted `Surface.tint` because the real renders arrive
    * with that mint baked in as their background — a card that paints anything
    * else here gets a visible square inside a square the day they land.
    */
   tile: {
      width: CITY_CARD.tile,
      height: CITY_CARD.tile,
      borderRadius: Radius.md,
      backgroundColor: Surface.tint,
      overflow: 'hidden',
   },
   label: {
      ...TextStyles.bodySmStrong,
      marginTop: Space.xs,
   },
   count: {
      ...TextStyles.micro,
   },
});
