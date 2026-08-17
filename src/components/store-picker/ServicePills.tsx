import { StyleSheet, Text, View } from 'react-native';

import type { StoreService } from '@/lib/session';
import { Border, Radius, Space, Surface, TextColor, TextStyles } from '@/theme';

/**
 * What a store can actually do for you. Pills, per the design system, on the
 * sunken cream fill rather than outlined — an outline this small next to the
 * search field's outline starts to look like a form.
 *
 * `sm` exists for the list rows, which only surface the two services worth
 * scanning for. Showing all four on every row would be noise.
 */

const LABELS: Record<StoreService, string> = {
   dineIn: 'Dine in',
   takeaway: 'Takeaway',
   driveThru: 'Drive-thru',
   reserve: 'Reserve bar',
};

/** The two that change where you drive to. The other two are table stakes. */
export const NOTABLE_SERVICES: readonly StoreService[] = ['driveThru', 'reserve'];

type Props = {
   services: readonly StoreService[];
   size?: 'md' | 'sm';
};

export function ServicePills({ services, size = 'md' }: Props) {
   if (services.length === 0) return null;

   return (
      <View style={styles.row}>
         {services.map((service) => (
            <View key={service} style={[styles.pill, size === 'sm' && styles.pillSm]}>
               <Text style={[styles.label, size === 'sm' && styles.labelSm]}>
                  {LABELS[service]}
               </Text>
            </View>
         ))}
      </View>
   );
}

const styles = StyleSheet.create({
   row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Space.sm,
   },
   pill: {
      paddingHorizontal: Space.md,
      height: 30,
      borderRadius: Radius.pill,
      backgroundColor: Surface.sunken,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Border.hair,
      alignItems: 'center',
      justifyContent: 'center',
   },
   pillSm: {
      height: 22,
      paddingHorizontal: Space.sm,
   },
   label: {
      ...TextStyles.label,
      color: TextColor.secondary,
   },
   labelSm: {
      ...TextStyles.micro,
      color: TextColor.secondary,
   },
});
