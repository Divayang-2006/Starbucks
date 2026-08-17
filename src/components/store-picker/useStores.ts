/**
 * Live Starbucks pins, with the seeded list as a floor.
 *
 * The map must never be empty. Offline, tokenless, over quota, or simply in a
 * city with no Starbucks — in every one of those cases this returns the hand
 * -written `STORES` rather than nothing, and reports `source` so the UI can say
 * which it is looking at instead of pretending.
 *
 * Search Box is billed per request and does not touch the Places record quota, so
 * refetching per city is genuinely cheap. What it is *not* is free of latency, so
 * results are keyed and cached in `@/lib/places` and a city already visited comes
 * back instantly.
 *
 * **`loading` is derived, never stored.** The effect's only job is to start a
 * request and record its answer; whether we are waiting is a comparison between
 * the key we want and the key we have. Storing it too would mean a `setState` in
 * the effect body for something already knowable at render time.
 */

import { useEffect, useState } from 'react';

import { searchStarbucks, toStore } from '@/lib/places';
import type { Store } from '@/lib/session';
import { STORES } from '@/data/stores';

export type StoresSource = 'live' | 'seed' | 'mixed';

export type StoresState = {
   stores: readonly Store[];
   source: StoresSource;
   loading: boolean;
};

type Result = {
   /** Which `(place, city)` pair this answer is for. */
   key: string;
   stores: readonly Store[];
   source: StoresSource;
};

/**
 * Break ties between stores that derived the same display name.
 *
 * Observed on live Pune data: one store had no street context at all and fell
 * back to the city, so it came through as "Pune". Two of those in one list and the
 * user is choosing between identical rows. The area line's first segment is the
 * more specific address, so it becomes the qualifier.
 *
 * Deliberately not numbered. "Pune 1 / Pune 2" is worse than a duplicate, because
 * it looks like a decision someone made — if there is no better qualifier the
 * names are left alone and the distances tell them apart.
 */
function disambiguate(stores: readonly Store[]): Store[] {
   const counts = new Map<string, number>();
   for (const store of stores) counts.set(store.name, (counts.get(store.name) ?? 0) + 1);

   return stores.map((store) => {
      if ((counts.get(store.name) ?? 0) < 2) return store;

      const hint = store.area.split(',')[0]?.trim();
      if (!hint || hint.toLowerCase() === store.name.toLowerCase()) return store;

      return { ...store, name: `${store.name} · ${hint}` };
   });
}

/**
 * Live rows replace seeded ones in the same city rather than sitting alongside
 * them — otherwise a real store and my invented one appear as two pins a hundred
 * metres apart. Seeded rows elsewhere in the country are kept so the "All" filter
 * still shows a populated map.
 */
function merge(live: readonly Store[], city: string | undefined) {
   if (!live.length) return { stores: STORES, source: 'seed' as StoresSource };

   const normalised = city?.trim().toLowerCase();
   const kept = normalised
      ? STORES.filter((store) => store.city.trim().toLowerCase() !== normalised)
      : STORES;

   return {
      stores: [...live, ...kept],
      source: (kept.length === STORES.length ? 'live' : 'mixed') as StoresSource,
   };
}

export function useStores(proximity: [number, number], city?: string): StoresState {
   const [lng, lat] = proximity;
   /** Quantised to match the request cache in `@/lib/places` — ~1.1 km. */
   const key = `${lng.toFixed(2)},${lat.toFixed(2)}:${city ?? ''}`;

   const [result, setResult] = useState<Result | null>(null);

   useEffect(() => {
      let live = true;

      searchStarbucks({ proximity: [lng, lat], limit: 10 }).then((features) => {
         if (!live) return;
         // Stamped once for the whole batch rather than per row, so every store in
         // a response is judged open against the same instant.
         const now = new Date();
         const merged = merge(
            disambiguate(features.map((feature) => toStore(feature, now))),
            city,
         );
         setResult({ key, stores: merged.stores, source: merged.source });
      });

      return () => {
         // Abandons the state write, not the request — the response still lands in
         // the module cache, so flying back to this city is instant.
         live = false;
      };
      // `key` already encodes lng/lat/city; it is the dependency. The three are
      // listed because the effect body reads them.
   }, [key, lng, lat, city]);

   const fresh = result?.key === key;

   return {
      /**
       * The previous city's pins stay up while the next request is in flight.
       * Falling back to the seed mid-flight would flash a different set of pins on
       * every city change, which reads as the map glitching rather than loading.
       */
      stores: result?.stores ?? STORES,
      source: fresh ? result.source : 'seed',
      loading: !fresh,
   };
}
