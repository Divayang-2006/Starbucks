/**
 * The Places detail for whichever store is selected.
 *
 * **One record of monthly quota per cache miss**, so the trigger is deliberately
 * narrow: a `mapboxId` arrives here only when a store sheet is actually open.
 * Nothing prefetches, nothing warms, and a store reopened later in the session is
 * served from the module cache in `@/lib/places` for free.
 *
 * Seeded stores have no `mapboxId` at all, so they resolve to `status: 'none'`
 * without a request — the sheet then shows what it knows and says the rest is
 * unavailable, which is the truth rather than a failure.
 *
 * **The status is derived, not stored.** Three of the four states are knowable at
 * render time — no id, a cache hit, or neither — so the effect's only job is to
 * record that a fetch came back empty. Keeping a `status` in state as well would
 * mean writing it synchronously from the effect, and would flash `loading` for one
 * frame over a record already paid for and cached.
 */

import { useEffect, useState } from 'react';

import { cachedDetails, fetchPlaceDetails, type PlaceDetails } from '@/lib/places';

export type DetailStatus = 'none' | 'loading' | 'ready' | 'unavailable';

export type DetailState = {
   status: DetailStatus;
   details: PlaceDetails | null;
};

export function usePlaceDetail(mapboxId: string | undefined): DetailState {
   /** Set only when a fetch has *settled*. `null` details means Mapbox had none. */
   const [settled, setSettled] = useState<{ id: string; details: PlaceDetails | null } | null>(null);

   useEffect(() => {
      if (!mapboxId || cachedDetails(mapboxId)) return;

      let live = true;
      fetchPlaceDetails(mapboxId).then((details) => {
         if (live) setSettled({ id: mapboxId, details });
      });

      return () => {
         // The request is already paid for; letting it finish puts it in the cache
         // for next time. Only the state write is abandoned.
         live = false;
      };
   }, [mapboxId]);

   if (!mapboxId) return { status: 'none', details: null };

   /**
    * Read during render on purpose. It is a plain map lookup, stable within a
    * render pass, and the effect above guarantees a re-render once it can start
    * returning a value — so a cache hit renders the full sheet on the first frame.
    */
   const cached = cachedDetails(mapboxId);
   if (cached) return { status: 'ready', details: cached };

   if (settled?.id === mapboxId) {
      return settled.details
         ? { status: 'ready', details: settled.details }
         : { status: 'unavailable', details: null };
   }

   return { status: 'loading', details: null };
}
