/**
 * Mapbox Search Box + Places API response shapes.
 *
 * **These are typed from real responses, not from the documentation.** The
 * Places API is in Public Preview and its own docs say the "API contract and
 * response shape are subject to change without prior notice", so several
 * documented fields do not actually arrive and a couple of arriving ones are not
 * documented. Everything below was observed on live Starbucks records in Pune and
 * San Francisco on 2026-08-13.
 *
 * What that means in practice, and why the UI is shaped the way it is:
 *
 * | Documented | Reality |
 * |---|---|
 * | `photos` | never present — needs the partner photo network via Mapbox sales |
 * | `telemetry.activity_score` | never present — checked four US venues including high-traffic ones |
 * | `phone` | US only. Absent on the Pune store |
 * | `accommodation_wheelchair_accessible_*` | US only. Absent on Indian stores |
 * | `price_level` | never present |
 * | rating / reviews / verified | do not exist in this API at all |
 *
 * Hence every field here is optional unless it was present on *every* record
 * observed. Treat a missing field as normal, never as an error.
 */

/** Days are 0 = Sunday, matching `Date.prototype.getDay()`. */
export type OpenPeriod = {
   open: { day: number; time: string };
   close: { day: number; time: string };
};

/**
 * One result from `GET /search/searchbox/v1/forward`.
 *
 * This endpoint is billed **per request**, not per record, and does not count
 * against the Places API's monthly record quota — which is why the map's pins
 * come from here and only an opened sheet costs a record.
 */
export type SearchBoxFeature = {
   geometry: { coordinates: [number, number] };
   properties: {
      name: string;
      mapbox_id: string;
      feature_type: string;
      full_address?: string;
      place_formatted?: string;
      /** Metres from the `proximity` point. Absent when no proximity was sent. */
      distance?: number;
      /** Localised brand names. We match on `brand_id` instead. */
      brand?: string[];
      brand_id?: string[];
      poi_category_ids?: string[];
      coordinates?: {
         latitude: number;
         longitude: number;
         /** Where a car should actually stop — the door, not the polygon centre. */
         routable_points?: { name: string; latitude: number; longitude: number }[];
      };
      context?: {
         country?: { name?: string };
         place?: { name?: string };
         postcode?: { name?: string };
         street?: { name?: string };
         address?: { name?: string; street_name?: string; address_number?: string };
      };
      metadata?: {
         website?: string;
         /** Structured, unlike the Places API's OSM-style string. Preferred. */
         open_hours?: { periods?: OpenPeriod[] };
      };
   };
};

export type SearchBoxResponse = { features?: SearchBoxFeature[] };

/**
 * The attribute bag from `GET /places/v1/details/retrieve/{id}`.
 *
 * Around thirty booleans, all optional, all sparse — the SF store carries
 * `feature_wi_fi` and the Pune one does not, and neither implies the amenity is
 * absent in the world. Only ever render a `true`; never render "no wifi" from a
 * missing key.
 */
export type PlaceAttributes = {
   accommodation_wheelchair_accessible_entrance?: boolean;
   accommodation_wheelchair_accessible_restroom?: boolean;
   accommodation_wheelchair_accessible_seating?: boolean;
   accommodation_wheelchair_accessible_parking?: boolean;
   accommodation_high_chairs?: boolean;

   service_dine_in?: boolean;
   service_takeout?: boolean;
   service_delivery?: boolean;
   service_drive_through?: boolean;
   service_no_contact_delivery?: boolean;
   service_quick_bite?: boolean;
   service_fast_service?: boolean;

   feature_wi_fi?: boolean;
   feature_restroom?: boolean;
   feature_outdoor_seating?: boolean;

   payment_type_credit_card?: boolean;
   payment_type_debit_card?: boolean;
   payment_type_mobile_nfc?: boolean;

   laptop_work_friendly?: boolean;
   group_friendly?: boolean;
   solo_dining_friendly?: boolean;
   student_friendly?: boolean;
   family_friendly?: boolean;
   children_friendly?: boolean;
   tourist_friendly?: boolean;
   transgender_friendly?: boolean;

   known_for_coffee?: boolean;
   known_for_tea?: boolean;
   known_for_dessert?: boolean;

   offering_breakfast?: boolean;
   offering_brunch?: boolean;
   offering_lunch?: boolean;
   offering_coffee?: boolean;
   offering_dessert?: boolean;
   offering_vegetarian_options?: boolean;

   wait_expected?: boolean;
   cuisine?: string;
   [key: string]: boolean | string | undefined;
};

export type PlaceDetails = {
   mapbox_id: string;
   name: string;
   brand?: string;
   full_address?: string;
   primary_category?: string;
   categories?: string[];
   /** OSM syntax: `"Mo 07:00-23:00; Tu 07:00-23:00; …"`. Not an object. */
   opening_hours?: string;
   permanently_closed?: boolean;
   status?: string;
   website?: string;
   /** US records only, in E.164. */
   phone?: string;
   coordinates?: {
      latitude: number;
      longitude: number;
      routable_points?: { name: string; latitude: number; longitude: number }[];
   };
   address?: {
      address_line_1?: string;
      street_name?: string;
      /** The neighbourhood. Present in India, `null` on the SF record. */
      locality?: string | null;
      city?: string;
      postcode?: string;
      country?: string;
      country_code?: string;
   };
   /**
    * Undocumented but present on every record seen. `popularity` and `reality`
    * are 0–1 confidence-ish scores; `reality` is Mapbox's "this place exists"
    * signal, which is the closest thing the API has to a verified flag.
    */
   score?: { closed?: number; popularity?: number; reality?: number };
   /** Only `mapbox_id` and an empty `tags` object in practice. */
   building?: { mapbox_id?: string; tags?: Record<string, unknown> };
   attributes?: PlaceAttributes;
};
