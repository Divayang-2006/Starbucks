import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Store } from '@/lib/session';

import { haversineKm } from './geo';

/**
 * Location, as an enhancement and never as a gate.
 *
 * Two rules this hook exists to enforce:
 *
 * 1. **It never prompts on mount.** Landing on a permission dialog before you
 *    have seen the screen is the thing every store picker gets wrong. On mount
 *    it only *reads* the existing grant, so a returning user gets their position
 *    silently and a new one gets an untouched map.
 * 2. **Every failure is a shrug.** Denied, services off, a rejected fix — all of
 *    them land in a status the UI can label, and `distanceFor` quietly falls
 *    back to the seeded distance. Nothing about the screen stops working.
 */

export type NearbyStatus =
   /** Never asked. The button is an invitation. */
   | 'idle'
   | 'asking'
   | 'locating'
   | 'granted'
   | 'denied'
   /** Granted, but the device could not produce a fix. */
   | 'unavailable';

export type Nearby = {
   status: NearbyStatus;
   coords: [number, number] | null;
   /** Real distance once there is a fix, the seeded one until then. */
   distanceFor: (store: Store) => number;
   /**
    * `onFix` fires once, with the first usable position. The camera needs to
    * move the moment a fix lands, and a callback says that directly — the
    * alternative is parking a "fly when ready" flag in state and watching for
    * it in an effect, which is a cascading render for something that is really
    * just a completion.
    */
   request: (onFix?: (coords: [number, number]) => void) => void;
};

export function useNearby(): Nearby {
   const [status, setStatus] = useState<NearbyStatus>('idle');
   const [coords, setCoords] = useState<[number, number] | null>(null);
   const live = useRef(true);

   useEffect(() => {
      live.current = true;
      return () => {
         live.current = false;
      };
   }, []);

   const read = useCallback(async (onFix?: (coords: [number, number]) => void) => {
      if (live.current) setStatus('locating');
      // Guards `onFix` to the first position of the two below, so a camera move
      // isn't interrupted by the refined fix landing a second later.
      let announced = false;
      const announce = (next: [number, number]) => {
         setCoords(next);
         setStatus('granted');
         if (!announced) {
            announced = true;
            onFix?.(next);
         }
      };

      try {
         // The last known fix is instant and usually good enough to sort a list
         // of stores, so it is shown first and refined afterwards rather than
         // leaving the button spinning on a cold GPS lock.
         const cached = await Location.getLastKnownPositionAsync();
         if (cached && live.current) {
            announce([cached.coords.longitude, cached.coords.latitude]);
         }

         const fresh = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
         });
         if (!live.current) return;
         announce([fresh.coords.longitude, fresh.coords.latitude]);
      } catch {
         if (!live.current) return;
         // Services switched off, airplane mode, a timeout — all the same story
         // as far as this screen is concerned.
         setStatus((current) => (current === 'granted' ? current : 'unavailable'));
      }
   }, []);

   useEffect(() => {
      let cancelled = false;
      Location.getForegroundPermissionsAsync()
         .then((permission) => {
            if (cancelled || !permission.granted) return;
            return read();
         })
         .catch(() => {
            // No permissions module at all (web without geolocation). Stay idle;
            // the button will ask and fail visibly if the user wants it to.
         });
      return () => {
         cancelled = true;
      };
   }, [read]);

   const request = useCallback(
      (onFix?: (coords: [number, number]) => void) => {
         setStatus('asking');
         Location.requestForegroundPermissionsAsync()
            .then((permission) => {
               if (!live.current) return;
               if (!permission.granted) {
                  setStatus('denied');
                  return;
               }
               return read(onFix);
            })
            .catch(() => {
               if (live.current) setStatus('unavailable');
            });
      },
      [read],
   );

   const distanceFor = useCallback(
      (store: Store) => (coords ? haversineKm(coords, store.coordinate) : store.distanceKm),
      [coords],
   );

   return { status, coords, distanceFor, request };
}
