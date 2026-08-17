/**
 * Which shop. The block the whole ordering flow hangs off.
 *
 * In India the menu, the ETA and the pricing are all per-store, so this is
 * context for everything below it — which is why both Home and Order lead with
 * it, and why both wrote their own.
 *
 * **The wording disagreed and had to be resolved.** Home said
 * `{area} · ready in {n} mins`; Order said `{area}, {city} · {n} mins`. "ready
 * in" wins: a bare number next to a locality reads as a distance or a closing
 * time, and the one thing it actually means — how long until your order is
 * ready — is the one thing it did not say. The city is dropped from the default
 * meta because you are standing in it; pass it when the list spans cities, as
 * the store picker's does.
 *
 * The lead-in stays a prop. "Collecting from" and "Ordering from" are both
 * correct and they are correct on different screens, so this component supplies
 * the more common one and lets the other be typed.
 *
 * `display` spends the screen's serif on the store name — DESIGN_SYSTEM §1
 * sanctions store names, and on both Home and Order this is the one Fraunces
 * moment. In a *list* of stores that budget is blown five times over, so the
 * picker passes `display={false}`.
 */

import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { CapsKicker, TextAction } from '@/components/chrome';
import { Space, TextColor, TextStyles } from '@/theme';

type Props = {
   name: string;
   area?: string;
   /** Only when the surrounding list spans more than one city. */
   city?: string;
   distanceKm?: number;
   /** Minutes until an order would be ready. Prep time, not travel time. */
   etaMins?: number;
   /** `false` appends "Closed". Omit when it is not known. */
   isOpen?: boolean;
   /** ALL-CAPS lead-in above the name. */
   kicker?: string;
   tone?: 'light' | 'inverse';
   /** Sets the name in the display serif. Off inside a list of stores. */
   display?: boolean;
   /** Renders the "Change" affordance. */
   onChange?: () => void;
   style?: StyleProp<ViewStyle>;
};

export function StoreRow({
   name,
   area,
   city,
   distanceKm,
   etaMins,
   isOpen,
   kicker = 'Collecting from',
   tone = 'inverse',
   display = true,
   onChange,
   style,
}: Props) {
   const inverse = tone === 'inverse';

   /**
    * Built as a list and joined, so an absent field leaves no orphan separator.
    * Ordered nearest-fact-first: where it is, then when it is ready, then how
    * far — the last of which only matters once the first two have been read.
    */
   const meta = [
      [area, city].filter(Boolean).join(', ') || undefined,
      isOpen === false ? 'Closed' : undefined,
      etaMins !== undefined ? `ready in ${etaMins} mins` : undefined,
      distanceKm !== undefined ? `${distanceKm.toFixed(1)} km` : undefined,
   ]
      .filter(Boolean)
      .join(' · ');

   return (
      <View style={[styles.row, style]}>
         <View style={styles.text}>
            {kicker ? (
               <Text style={[styles.kicker, inverse && styles.kickerInverse]}>{kicker}</Text>
            ) : null}

            <Text
               style={[
                  display ? styles.nameDisplay : styles.name,
                  inverse && styles.nameInverse,
               ]}
               numberOfLines={1}
            >
               {name}
            </Text>

            {meta ? (
               <Text style={[styles.meta, inverse && styles.metaInverse]} numberOfLines={1}>
                  {meta}
               </Text>
            ) : null}
         </View>

         {onChange ? <TextAction label="Change" onPress={onChange} tone={tone} /> : null}
      </View>
   );
}

const styles = StyleSheet.create({
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Space.md,
   },
   text: {
      flexShrink: 1,
      gap: Space.xxs,
   },
   kicker: {
      ...CapsKicker,
      color: TextColor.secondary,
   },
   kickerInverse: {
      color: TextColor.onDarkMuted,
   },
   nameDisplay: {
      ...TextStyles.titleSerif,
      color: TextColor.primary,
   },
   name: {
      ...TextStyles.bodyStrong,
      color: TextColor.primary,
   },
   nameInverse: {
      color: TextColor.onDark,
   },
   meta: {
      ...TextStyles.bodySm,
      color: TextColor.secondary,
   },
   metaInverse: {
      color: TextColor.onDarkMuted,
   },
});
