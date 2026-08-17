import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
   accessibilityFacts,
   amenityFacts,
   categoryLine,
   isVerified,
   servicesFromAttributes,
} from '@/lib/places';
import type { Store } from '@/lib/session';
import {
   Accent,
   Border,
   Gutter,
   Radius,
   Space,
   Status,
   TextColor,
   TextStyles,
} from '@/theme';

import { BusyTimes } from './BusyTimes';
import { ConfirmButton } from './ConfirmButton';
import { ChevronGlyph } from './Glyphs';
import { Accessibility, Amenities, ContactRows, PlacesAttribution } from './PlaceFacts';
import { formatHours, formatKm } from './geo';
import { ServicePills } from './ServicePills';
import { usePlaceDetail } from './usePlaceDetail';

/**
 * The store face of the sheet.
 *
 * **This is the screen's one licensed use of Fraunces.** The design system
 * rations the serif to a handful of jobs, store names among them, and warns that
 * two on a screen means one is wrong — so the list rows opposite are set in the
 * brand sans and the name only turns into display type once you have picked it
 * out. The switch is the reward.
 *
 * The body re-enters whenever the id changes, so tapping a second pin while this
 * face is already up reads as the card being replaced rather than the text
 * silently swapping underneath itself.
 */

const BODY_IN = FadeInDown.duration(280);

type Props = {
   store: Store;
   distanceKm: number;
   onConfirm: (store: Store) => void;
   bottomInset: number;
   /**
    * Renders an "All stores" row above the name when supplied.
    *
    * Only the native sheet passes it. The Reanimated sheet draws its own header
    * with the back control in it, because it also owns a collapse chevron that
    * has to sit on the same line; a native sheet has no such header — UIKit owns
    * that strip and puts a grabber in it — so the affordance has to live in the
    * content instead.
    */
   onBack?: () => void;
};

function Metric({ value, label }: { value: string; label: string }) {
   return (
      <View style={styles.metric}>
         <Text style={styles.metricValue} maxFontSizeMultiplier={1.2}>
            {value}
         </Text>
         <Text style={styles.metricLabel}>{label}</Text>
      </View>
   );
}

export function StoreDetail({ store, distanceKm, onConfirm, bottomInset, onBack }: Props) {
   /**
    * One record of Places quota, spent here and only here — a sheet being open is
    * the app's proof that the user wants this store's details. Seeded stores carry
    * no `mapboxId`, so they resolve without a request.
    */
   const { status, details } = usePlaceDetail(store.mapboxId);

   const category = categoryLine(details?.categories, details?.primary_category);
   const verified = isVerified(details?.score?.reality);
   const accessibility = accessibilityFacts(details?.attributes);
   const amenities = amenityFacts(details?.attributes);
   // Real service modes replace the assumed dine-in/takeaway once they arrive.
   const services = servicesFromAttributes(details?.attributes) ?? store.services;

   return (
      <View style={styles.face}>
         <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}>
            <Animated.View key={store.id} entering={BODY_IN} style={styles.block}>
               {onBack ? (
                  <Pressable
                     style={styles.back}
                     onPress={onBack}
                     hitSlop={Space.sm}
                     accessibilityRole="button"
                     accessibilityLabel="Back to all stores"
                  >
                     <View style={styles.backChevron}>
                        <ChevronGlyph size={16} color={TextColor.secondary} />
                     </View>
                     <Text style={styles.backLabel}>All stores</Text>
                  </Pressable>
               ) : null}

               <Text style={styles.name} maxFontSizeMultiplier={1.2}>
                  {store.name}
               </Text>

               {/*
                * Category and the verified chip share a row under the name, as in
                * the reference. Both are detail-only, so the row is absent until
                * the record lands rather than reserving empty space.
                */}
               {category || verified ? (
                  <View style={styles.metaRow}>
                     {category ? <Text style={styles.category}>{category}</Text> : null}
                     {verified ? (
                        <View style={styles.verified}>
                           <Text style={styles.verifiedLabel}>MAPBOX VERIFIED</Text>
                        </View>
                     ) : null}
                  </View>
               ) : null}

               <Text style={styles.area} maxFontSizeMultiplier={1.3}>
                  {details?.full_address ?? `${store.area}${store.city ? `, ${store.city}` : ''}`}
               </Text>

               <View style={styles.status}>
                  <View
                     style={[
                        styles.dot,
                        { backgroundColor: store.isOpen ? Status.success : TextColor.tertiary },
                     ]}
                  />
                  <Text style={[styles.hours, !store.isOpen && styles.hoursClosed]}>
                     {formatHours(store)}
                  </Text>
               </View>

               <View style={styles.metrics}>
                  <Metric value={formatKm(distanceKm)} label="AWAY" />
                  <View style={styles.rule} />
                  <Metric value={`~${store.etaMins} min`} label="READY IN" />
               </View>

               <ServicePills services={services} />

               {/*
                * Everything below comes from the Places record. While it is in
                * flight the sheet deliberately shows nothing rather than
                * skeletons — the half above is already complete and useful, and a
                * shimmer under it would imply the store is only half-loaded.
                */}
               {status === 'ready' ? (
                  <View style={styles.places}>
                     <BusyTimes />
                     <Accessibility facts={accessibility} />
                     <Amenities facts={amenities} />
                     <ContactRows phone={details?.phone} website={details?.website} />
                     <PlacesAttribution />
                  </View>
               ) : null}

               {status === 'unavailable' ? (
                  <Text style={styles.unavailable}>
                     Mapbox has no detail record for this store yet.
                  </Text>
               ) : null}
            </Animated.View>
         </ScrollView>

         <View style={[styles.footer, { paddingBottom: bottomInset + Space.base }]}>
            {store.isOpen ? null : (
               <Text style={styles.caution}>
                  Closed right now — you can still set it as your store and browse.
               </Text>
            )}
            <ConfirmButton
               label={store.isOpen ? 'Order from here' : 'Set as my store'}
               onPress={() => onConfirm(store)}
            />
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   face: {
      flex: 1,
   },
   scroll: {
      flex: 1,
   },
   body: {
      paddingHorizontal: Gutter,
      paddingBottom: Space.base,
   },
   block: {
      gap: Space.sm,
   },
   name: {
      ...TextStyles.titleSerif,
      color: TextColor.primary,
   },
   back: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.xs,
      alignSelf: 'flex-start',
      minHeight: Space.xxl,
      paddingRight: Space.sm,
   },
   backChevron: {
      transform: [{ rotate: '90deg' }],
   },
   backLabel: {
      ...TextStyles.bodySmStrong,
      color: TextColor.secondary,
   },
   metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
      marginTop: -Space.xs,
   },
   category: {
      ...TextStyles.bodySmStrong,
      color: TextColor.secondary,
   },
   /** Gold rather than green: it is a data-provenance claim, not an action. */
   verified: {
      paddingHorizontal: Space.sm,
      paddingVertical: 3,
      borderRadius: Radius.pill,
      backgroundColor: Accent.goldSoft,
   },
   verifiedLabel: {
      ...TextStyles.caps,
      fontSize: 9,
      color: '#6B4E16',
   },
   area: {
      ...TextStyles.bodySm,
      color: TextColor.secondary,
   },
   places: {
      gap: Space.xl,
      marginTop: Space.sm,
   },
   unavailable: {
      ...TextStyles.micro,
      color: TextColor.tertiary,
      marginTop: Space.sm,
   },
   status: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
   },
   dot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
   },
   hours: {
      ...TextStyles.bodySmStrong,
      color: Status.success,
   },
   hoursClosed: {
      color: TextColor.tertiary,
   },
   metrics: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.lg,
      paddingVertical: Space.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: Border.hair,
   },
   metric: {
      gap: Space.xxs,
   },
   metricValue: {
      ...TextStyles.bodyStrong,
      color: TextColor.primary,
   },
   metricLabel: {
      ...TextStyles.caps,
      color: TextColor.tertiary,
      textTransform: 'uppercase',
   },
   rule: {
      width: StyleSheet.hairlineWidth,
      alignSelf: 'stretch',
      backgroundColor: Border.hair,
   },
   /**
    * No fill. This was `Surface.raised`, which on the glass sheet painted an
    * opaque white bar across the bottom third — the sheet's material stopped at
    * the footer's top edge and the map stopped showing through, so it read as a
    * white band clipping the card. A hairline is enough to separate a sticky
    * footer from content that scrolls under it, and it is what the rest of the
    * app already uses for the same job.
    */
   footer: {
      paddingHorizontal: Gutter,
      paddingTop: Space.md,
      gap: Space.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Border.hair,
   },
   caution: {
      ...TextStyles.micro,
      color: TextColor.secondary,
      textAlign: 'center',
   },
});
