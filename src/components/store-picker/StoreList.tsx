import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
   useAnimatedStyle,
   useSharedValue,
   withTiming,
} from 'react-native-reanimated';

import type { Store } from '@/lib/session';
import {
   Border,
   Gutter,
   Radius,
   Sizes,
   Space,
   Status,
   Surface,
   TextColor,
   TextStyles,
   Type,
} from '@/theme';

import { CupMark } from './CupMark';
import { CloseGlyph, SearchGlyph } from './Glyphs';
import { formatHours, formatKm } from './geo';
import { NOTABLE_SERVICES, ServicePills } from './ServicePills';
import { COLLAPSE_TIMING } from './stage';

/**
 * The browse face of the sheet: search, then rows.
 *
 * The list is the screen's floor. Every path through this feature — no token, no
 * map on web, a style that failed, a search with two hits — ends up able to pick
 * a store from here, which is why it is the face that shows on arrival rather
 * than something hidden behind a "view list" toggle.
 *
 * Store names are set in the brand sans here, not Fraunces. The design system
 * rations the serif to one appearance per screen and this screen spends it on the
 * store you have actually chosen, in `StoreDetail`.
 */

type Props = {
   /** Already filtered by city and query, already sorted by distance. */
   stores: readonly Store[];
   query: string;
   onQueryChange: (query: string) => void;
   distanceFor: (store: Store) => number;
   onSelect: (store: Store) => void;
   /** One quiet line about location, when there is something to say. */
   note: string | null;
   /**
    * False while the sheet is only a lip. See the note on the animation below —
    * the field stays mounted either way, so the query survives a collapse.
    */
   searchVisible: boolean;
   /** Bottom padding so the last row clears the home indicator. */
   bottomInset: number;
};

function StatusDot({ open }: { open: boolean }) {
   return (
      <View style={[styles.dot, { backgroundColor: open ? Status.success : TextColor.tertiary }]} />
   );
}

function StoreRow({
   store,
   distanceKm,
   onSelect,
}: {
   store: Store;
   distanceKm: number;
   onSelect: (store: Store) => void;
}) {
   const notable = store.services.filter((service) => NOTABLE_SERVICES.includes(service));

   return (
      <Pressable
         style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
         onPress={() => onSelect(store)}
         accessibilityRole="button"
         accessibilityLabel={`${store.name}, ${store.area}, ${formatKm(distanceKm)} away, ${formatHours(store)}`}>
         <View style={[styles.rowDisc, !store.isOpen && styles.rowDiscClosed]}>
            <CupMark size={15} color={Surface.app} opacity={store.isOpen ? 1 : 0.5} />
         </View>

         <View style={styles.rowBody}>
            <Text style={styles.rowName} numberOfLines={1} maxFontSizeMultiplier={1.3}>
               {store.name}
            </Text>
            <Text style={styles.rowArea} numberOfLines={1} maxFontSizeMultiplier={1.3}>
               {store.area}, {store.city}
            </Text>
            <View style={styles.rowMeta}>
               <StatusDot open={store.isOpen} />
               <Text style={[styles.rowHours, !store.isOpen && styles.rowHoursClosed]}>
                  {formatHours(store)}
               </Text>
               <ServicePills services={notable} size="sm" />
            </View>
         </View>

         <View style={styles.rowRight}>
            <Text style={styles.rowDistance}>{formatKm(distanceKm)}</Text>
            <Text style={styles.rowEta}>{store.isOpen ? `~${store.etaMins} min` : '—'}</Text>
         </View>
      </Pressable>
   );
}

function NoMatches({ query, onClear }: { query: string; onClear: () => void }) {
   return (
      <View style={styles.empty}>
         <CupMark size={40} color={TextColor.tertiary} opacity={0.35} />
         <Text style={styles.emptyTitle}>Nothing here by that name</Text>
         <Text style={styles.emptyBody}>
            Nothing came up for “{query}”. Try the neighbourhood instead, or the city.
         </Text>
         <Pressable
            onPress={onClear}
            hitSlop={Space.sm}
            accessibilityRole="button"
            accessibilityLabel="Clear the search">
            <Text style={styles.emptyAction}>Start over</Text>
         </Pressable>
      </View>
   );
}

export function StoreList({
   stores,
   query,
   onQueryChange,
   distanceFor,
   onSelect,
   note,
   searchVisible,
   bottomInset,
}: Props) {
   const shown = useSharedValue(searchVisible ? 1 : 0);

   useEffect(() => {
      shown.set(withTiming(searchVisible ? 1 : 0, COLLAPSE_TIMING));
   }, [searchVisible, shown]);

   /**
    * Height *and* opacity, on a clipping wrapper.
    *
    * Height alone would slide the list down from behind a field that is already
    * fully drawn; opacity alone would leave a 48pt hole above the first row at a
    * peek, which is most of what a peek shows. Together the list closes over the
    * gap as the field fades into it.
    *
    * Animating a height re-lays-out the rows under it on every frame, which this
    * file's sheet is careful to avoid for exactly one reason: there the moving
    * thing is a scroll view mid-gesture. Here it is a 48pt box, once, while the
    * user is dragging something else — the sheet — and watching that instead.
    */
   const searchStyle = useAnimatedStyle(() => ({
      height: shown.get() * (Sizes.fieldHeight + Space.md),
      opacity: shown.get(),
   }));

   return (
      <View style={styles.face}>
         <Animated.View style={[styles.searchSlot, searchStyle]}>
            <View style={styles.search}>
               <SearchGlyph color={TextColor.tertiary} />
               <TextInput
                  style={styles.input}
                  value={query}
                  onChangeText={onQueryChange}
                  placeholder="Try a neighbourhood, or a city"
                  placeholderTextColor={TextColor.tertiary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="search"
                  // We draw our own, so iOS' native one would be a second button.
                  clearButtonMode="never"
                  maxFontSizeMultiplier={1.2}
                  accessibilityLabel="Search stores"
                  /*
                   * Not focusable while it is collapsed away. The wrapper clips
                   * it to zero height but the field is still mounted — without
                   * this, a "next field" keyboard traversal or VoiceOver swipe
                   * would land on a control nobody can see.
                   */
                  editable={searchVisible}
               />
               {query.length > 0 ? (
                  <Pressable
                     onPress={() => onQueryChange('')}
                     hitSlop={Space.md}
                     accessibilityRole="button"
                     accessibilityLabel="Clear the search">
                     <CloseGlyph color={TextColor.secondary} />
                  </Pressable>
               ) : null}
            </View>
         </Animated.View>

         {note ? <Text style={styles.note}>{note}</Text> : null}

         <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollBody, { paddingBottom: bottomInset + Space.lg }]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}>
            {stores.length === 0 ? (
               <NoMatches query={query} onClear={() => onQueryChange('')} />
            ) : (
               stores.map((store) => (
                  <StoreRow
                     key={store.id}
                     store={store}
                     distanceKm={distanceFor(store)}
                     onSelect={onSelect}
                  />
               ))
            )}
         </ScrollView>
      </View>
   );
}

const styles = StyleSheet.create({
   face: {
      flex: 1,
   },
   /**
    * Clips the field as it collapses. The bottom margin is inside the animated
    * height rather than on the field, so the gap under it closes at the same
    * rate — a fixed margin would leave 12pt of nothing at a peek.
    */
   searchSlot: {
      overflow: 'hidden',
      justifyContent: 'flex-start',
   },
   search: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
      marginHorizontal: Gutter,
      paddingHorizontal: Space.base,
      height: Sizes.fieldHeight,
      borderRadius: Radius.pill,
      backgroundColor: Surface.sunken,
   },
   input: {
      flex: 1,
      // fontFamily without fontWeight — every face here is a single static
      // weight, and asking for one it does not carry smears the glyphs.
      fontFamily: Type.regular,
      fontSize: 15,
      color: TextColor.primary,
      // Android inflates the intrinsic height of a TextInput; without this the
      // pill grows past its own borderRadius.
      paddingVertical: 0,
   },
   note: {
      ...TextStyles.micro,
      color: TextColor.secondary,
      marginTop: Space.sm,
      marginHorizontal: Gutter + Space.base,
   },
   scroll: {
      flex: 1,
      marginTop: Space.md,
   },
   scrollBody: {
      paddingHorizontal: Gutter,
   },
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.md,
      paddingVertical: Space.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Border.hair,
   },
   rowPressed: {
      backgroundColor: Surface.sunken,
   },
   rowDisc: {
      width: 34,
      height: 34,
      borderRadius: Radius.pill,
      backgroundColor: Surface.inverse,
      alignItems: 'center',
      justifyContent: 'center',
   },
   rowDiscClosed: {
      backgroundColor: Surface.inverseDeep,
      opacity: 0.55,
   },
   rowBody: {
      flex: 1,
      gap: 2,
   },
   rowName: {
      ...TextStyles.bodyStrong,
      color: TextColor.primary,
   },
   rowArea: {
      ...TextStyles.bodySm,
      color: TextColor.secondary,
   },
   rowMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
      marginTop: Space.xxs,
   },
   dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
   },
   rowHours: {
      ...TextStyles.micro,
      color: Status.success,
   },
   rowHoursClosed: {
      color: TextColor.tertiary,
   },
   rowRight: {
      alignItems: 'flex-end',
      gap: 2,
   },
   rowDistance: {
      ...TextStyles.bodySmStrong,
      color: TextColor.primary,
   },
   rowEta: {
      ...TextStyles.micro,
      color: TextColor.tertiary,
   },
   empty: {
      alignItems: 'center',
      gap: Space.sm,
      paddingTop: Space.xxl,
      paddingHorizontal: Space.lg,
   },
   emptyTitle: {
      ...TextStyles.bodyStrong,
      color: TextColor.primary,
   },
   emptyBody: {
      ...TextStyles.bodySm,
      color: TextColor.secondary,
      textAlign: 'center',
   },
   emptyAction: {
      ...TextStyles.bodySmStrong,
      color: TextColor.action,
      marginTop: Space.xs,
   },
});
