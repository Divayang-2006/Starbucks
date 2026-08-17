/**
 * Turning Mapbox's attribute bag into things worth putting on screen.
 *
 * **The one rule: only ever render a `true`.** These attributes are sparse, not
 * exhaustive — the SF store carries `feature_wi_fi` and the Pune one does not,
 * and that says nothing about whether Pune has wifi. So a missing key is
 * "unknown" and gets omitted; it never becomes "no wifi", and an empty result
 * never becomes "not accessible". Rendering absence as a negative would be
 * inventing data, and on the accessibility list it would be actively harmful.
 */

import type { StoreService } from '@/lib/session';

import type { GlyphId } from '@/components/chrome/glyphs';

import type { PlaceAttributes } from './types';

export type Fact = { id: string; label: string };

/**
 * The four rows the reference UI shows. Parking is in the schema but was absent
 * on every record observed, so in practice this list renders three.
 */
const ACCESSIBILITY: { key: keyof PlaceAttributes; label: string }[] = [
   { key: 'accommodation_wheelchair_accessible_entrance', label: 'Wheelchair accessible' },
   { key: 'accommodation_wheelchair_accessible_restroom', label: 'Accessible restroom' },
   { key: 'accommodation_wheelchair_accessible_parking', label: 'Accessible parking' },
   { key: 'accommodation_wheelchair_accessible_seating', label: 'Accessible seating' },
];

export function accessibilityFacts(attributes: PlaceAttributes | undefined): Fact[] {
   if (!attributes) return [];
   return ACCESSIBILITY.filter((row) => attributes[row.key] === true).map((row) => ({
      id: String(row.key),
      label: row.label,
   }));
}

/**
 * Amenities, ordered by how much they'd change your mind about walking there.
 * Capped at six by the caller — the full set runs to a dozen on a US store and
 * becomes wallpaper.
 */
const AMENITIES: { key: keyof PlaceAttributes; label: string; glyph: GlyphId }[] = [
   { key: 'feature_wi_fi', label: 'Free Wi-Fi', glyph: 'scan' },
   { key: 'laptop_work_friendly', label: 'Laptop friendly', glyph: 'article' },
   { key: 'payment_type_mobile_nfc', label: 'Tap to pay', glyph: 'pay' },
   { key: 'feature_outdoor_seating', label: 'Outdoor seating', glyph: 'pin' },
   { key: 'offering_breakfast', label: 'Breakfast', glyph: 'order' },
   { key: 'offering_vegetarian_options', label: 'Vegetarian options', glyph: 'heart' },
   { key: 'group_friendly', label: 'Good for groups', glyph: 'person' },
   { key: 'solo_dining_friendly', label: 'Good solo', glyph: 'person' },
   { key: 'known_for_coffee', label: 'Known for coffee', glyph: 'rewards' },
   { key: 'accommodation_high_chairs', label: 'High chairs', glyph: 'crown' },
];

export function amenityFacts(attributes: PlaceAttributes | undefined) {
   if (!attributes) return [];
   return AMENITIES.filter((row) => attributes[row.key] === true).map((row) => ({
      id: String(row.key),
      label: row.label,
      glyph: row.glyph,
   }));
}

/**
 * Real service modes, replacing the hand-written ones the seeded stores carry.
 *
 * `reserve` has no Mapbox equivalent — Starbucks Reserve is a brand tier, not a
 * POI attribute — so it only ever appears on seeded stores. Drive-through is in
 * the schema but was absent everywhere observed, which matches reality for urban
 * Indian stores.
 */
export function servicesFromAttributes(
   attributes: PlaceAttributes | undefined,
): StoreService[] | undefined {
   if (!attributes) return undefined;

   const services: StoreService[] = [];
   if (attributes.service_dine_in) services.push('dineIn');
   if (attributes.service_takeout) services.push('takeaway');
   if (attributes.service_drive_through) services.push('driveThru');

   return services.length ? services : undefined;
}

/**
 * The category line under the store name — "Coffee shop · Café" in the reference.
 *
 * `primary_category` is unreliable as a display value: it came back `"food"` for
 * the Pune store and `"teahouse"` for the SF one, neither of which is what you'd
 * write on a Starbucks. So the specific categories are preferred and
 * `primary_category` is only the last resort.
 */
const CATEGORY_LABELS: Record<string, string> = {
   coffee_shop: 'Coffee shop',
   coffee: 'Coffee',
   cafe: 'Café',
   teahouse: 'Teahouse',
   food_and_drink: 'Food & drink',
   food: 'Food',
   bakery: 'Bakery',
   restaurant: 'Restaurant',
};

function pretty(id: string): string {
   return CATEGORY_LABELS[id] ?? id.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

export function categoryLine(
   categories: string[] | undefined,
   primary: string | undefined,
): string | null {
   const preferred = ['coffee_shop', 'cafe', 'bakery', 'restaurant', 'teahouse'];
   const picked = preferred.filter((id) => categories?.includes(id)).slice(0, 2);

   if (picked.length) return picked.map(pretty).join(' · ');
   if (categories?.length) return categories.slice(0, 2).map(pretty).join(' · ');
   return primary ? pretty(primary) : null;
}

/**
 * Mapbox's `score.reality` is its own confidence that the place exists and its
 * record is sound — the nearest honest equivalent of the reference UI's
 * "Verified" badge, which is not a field in this API.
 *
 * 0.9 was the value on both records observed, so the threshold sits at 0.9 rather
 * than above it. The badge says "Mapbox verified" and not a bare "Verified" so
 * the claim stays attributable to whoever actually made it.
 */
export const REALITY_VERIFIED = 0.9;

export function isVerified(reality: number | undefined): boolean {
   return typeof reality === 'number' && reality >= REALITY_VERIFIED;
}
