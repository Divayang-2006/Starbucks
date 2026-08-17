/**
 * The lower half of the store sheet: accessibility, amenities, contact.
 *
 * Every section here renders only when it has something true to say. That is not
 * tidiness — it is the same rule stated in `@/lib/places/attributes`: these
 * attributes are sparse rather than exhaustive, so a missing key means unknown and
 * never means no. An absent accessibility list is "Mapbox has no accessibility
 * data for this store", which is what the empty state says, and emphatically not
 * "this store is not accessible".
 *
 * In practice that means Indian stores show fewer sections than US ones — the Pune
 * record carries no phone and no accessibility attributes at all. The sheet has to
 * look deliberate at both extremes, which is why the sections are independent
 * blocks rather than a fixed layout with holes in it.
 */

import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Glyph, type GlyphId } from '@/components/chrome';
import {
   Border,
   Radius,
   Sizes,
   Space,
   Status,
   Surface,
   TextColor,
   TextStyles,
} from '@/theme';

import type { Fact } from '@/lib/places';

/** A section heading with its glyph, matching the reference's row rhythm. */
function SectionTitle({ glyph, title }: { glyph: GlyphId; title: string }) {
   return (
      <View style={styles.sectionHead}>
         <Glyph id={glyph} size={17} color={TextColor.secondary} strokeWidth={1.7} />
         <Text style={styles.sectionTitle}>{title}</Text>
      </View>
   );
}

export function Accessibility({ facts }: { facts: readonly Fact[] }) {
   return (
      <View style={styles.section}>
         <SectionTitle glyph="person" title="Accessibility" />

         {facts.length ? (
            <View style={styles.checks}>
               {facts.map((fact) => (
                  <View key={fact.id} style={styles.checkRow}>
                     {/* Green tick, per the reference. Colour is not the only cue —
                         the row is also the only place this glyph appears. */}
                     <Glyph id="chevronRight" size={13} color={Status.success} strokeWidth={2.4} />
                     <Text style={styles.checkLabel}>{fact.label}</Text>
                  </View>
               ))}
            </View>
         ) : (
            <Text style={styles.empty}>
               No accessibility details published for this store. That means unknown,
               not unavailable — call ahead if it matters.
            </Text>
         )}
      </View>
   );
}

export function Amenities({ facts }: { facts: readonly { id: string; label: string; glyph: GlyphId }[] }) {
   if (!facts.length) return null;

   return (
      <View style={styles.section}>
         <SectionTitle glyph="rewards" title="Good to know" />
         <View style={styles.pills}>
            {/* Six is the cap: a US store returns a dozen and the set stops being
                read once it wraps to a third row. */}
            {facts.slice(0, 6).map((fact) => (
               <View key={fact.id} style={styles.pill}>
                  <Glyph id={fact.glyph} size={14} color={TextColor.primary} strokeWidth={1.7} />
                  <Text style={styles.pillLabel}>{fact.label}</Text>
               </View>
            ))}
         </View>
      </View>
   );
}

/**
 * Contact rows. Both are links, and both fail silently — `Linking.openURL`
 * rejects when no app can handle the scheme (a tablet with no dialler, say), and
 * an unhandled rejection there would be a crash for something that is not worth
 * one.
 */
export function ContactRows({ phone, website }: { phone?: string; website?: string }) {
   if (!phone && !website) return null;

   return (
      <View style={styles.contact}>
         {phone ? (
            <LinkRow
               glyph="pay"
               label={formatPhone(phone)}
               onPress={() => Linking.openURL(`tel:${phone}`).catch(() => {})}
            />
         ) : null}
         {website ? (
            <LinkRow
               glyph="article"
               label={hostOf(website)}
               onPress={() => Linking.openURL(website).catch(() => {})}
            />
         ) : null}
      </View>
   );
}

function LinkRow({
   glyph,
   label,
   onPress,
}: {
   glyph: GlyphId;
   label: string;
   onPress: () => void;
}) {
   return (
      <Pressable
         accessibilityRole="link"
         accessibilityLabel={label}
         onPress={onPress}
         style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}
      >
         <Glyph id={glyph} size={17} color={TextColor.action} strokeWidth={1.7} />
         <Text style={styles.linkLabel} numberOfLines={1}>
            {label}
         </Text>
      </Pressable>
   );
}

/** `+14155587715` → `+1 415 558 7715`. E.164 in, readable out. */
function formatPhone(raw: string): string {
   const digits = raw.replace(/[^\d+]/g, '');
   const match = digits.match(/^(\+\d{1,3})(\d{3})(\d{3})(\d{4})$/);
   return match ? `${match[1]} ${match[2]} ${match[3]} ${match[4]}` : raw;
}

/** Bare host — the full store-locator URL is 60 characters and unreadable. */
function hostOf(url: string): string {
   const match = url.match(/^https?:\/\/([^/]+)/i);
   return (match?.[1] ?? url).replace(/^www\./, '');
}

/**
 * Attribution. Mapbox's terms require the source to be credited where its data is
 * displayed, and the reference shot carries the same line — so this is compliance
 * as much as it is honesty about where the facts came from.
 */
export function PlacesAttribution() {
   return (
      <Text style={styles.attribution}>
         Hours, accessibility and contact details from the Mapbox Places API
      </Text>
   );
}

const styles = StyleSheet.create({
   section: {
      gap: Space.md,
   },
   sectionHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
   },
   sectionTitle: {
      ...TextStyles.bodySmStrong,
      color: TextColor.primary,
   },

   checks: {
      gap: Space.sm,
      paddingLeft: Space.xs,
   },
   checkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.md,
   },
   checkLabel: {
      ...TextStyles.bodySm,
      color: TextColor.secondary,
      flexShrink: 1,
   },
   empty: {
      ...TextStyles.micro,
      color: TextColor.tertiary,
      lineHeight: 16,
   },

   pills: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Space.sm,
   },
   pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.xs,
      height: Sizes.chipHeight,
      paddingHorizontal: Space.md,
      borderRadius: Radius.pill,
      backgroundColor: Surface.sunken,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Border.hair,
   },
   pillLabel: {
      ...TextStyles.label,
      color: TextColor.primary,
   },

   contact: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Border.hair,
      paddingTop: Space.md,
   },
   linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.md,
      minHeight: Sizes.tap,
   },
   linkLabel: {
      ...TextStyles.bodySmStrong,
      color: TextColor.action,
      flexShrink: 1,
   },
   pressed: {
      opacity: 0.6,
   },

   attribution: {
      ...TextStyles.micro,
      color: TextColor.tertiary,
      textAlign: 'center',
      paddingTop: Space.sm,
   },
});
