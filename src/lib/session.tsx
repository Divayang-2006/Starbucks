/**
 * Session — the two facts that decide which screen you're looking at.
 *
 * Stage 1 of the concept flow is a gate with two locks:
 *
 *   1. a store must be chosen (the map), because in India the menu, the ETA
 *      and the pricing are all per-store;
 *   2. you must be a member (the card flow), because the card *is* the
 *      account.
 *
 * Both live here rather than in the screens so the router can read them.
 * `src/app/_layout.tsx` wraps the whole tree in `<Stack.Protected>` guards fed
 * by this hook — a screen never navigates the user past a gate itself, it just
 * updates the session and lets the router settle.
 *
 * Deliberately in-memory. This is a UI concept with no backend, and a rehydrate
 * step would mean a splash-blocking async read for state that resets on every
 * reload anyway. When persistence lands it goes behind `hydrated` below, which
 * exists now so callers are already written for it.
 */

import {
   createContext,
   useCallback,
   useContext,
   useMemo,
   useState,
   type ReactNode,
} from 'react';

/** Services a store can offer. Drives the pills on the confirm sheet. */
export type StoreService = 'dineIn' | 'takeaway' | 'driveThru' | 'reserve';

export type Store = {
   id: string;
   /**
    * Mapbox POI id, present only on stores that came from the live Search Box
    * response. Its absence is what marks a seeded fallback row — and it is the
    * key the Places detail fetch needs, so a seeded store simply has no detail
    * to show rather than a failed request.
    */
   mapboxId?: string;
   /** "Koregaon Park", not "Starbucks Koregaon Park" — the brand is implied. */
   name: string;
   /** Locality line under the name. */
   area: string;
   city: string;
   /** Mapbox order: [longitude, latitude]. */
   coordinate: [number, number];
   /** Straight-line distance, pre-computed for the concept. */
   distanceKm: number;
   /** Minutes until an order would be ready. */
   etaMins: number;
   opensAt: string;
   closesAt: string;
   isOpen: boolean;
   services: StoreService[];
};

export type Member = {
   firstName: string;
   lastName: string;
   phone: string;
   /** Which card face they picked in the membership flow. */
   cardStyleId: string;
   stars: number;
   tier: 'green' | 'gold' | 'reserve';
};

type SessionValue = {
   /** Null until the map gate is cleared. */
   store: Store | null;
   /** Null until the membership gate is cleared. */
   member: Member | null;
   /** False only while a future rehydrate is in flight. Always true today. */
   hydrated: boolean;
   selectStore: (store: Store) => void;
   /** Called by the membership flow once the card has been claimed. */
   joinMembership: (member: Member) => void;
   signOut: () => void;
   /** Back to the map without losing the membership. */
   changeStore: () => void;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
   const [store, setStore] = useState<Store | null>(null);
   const [member, setMember] = useState<Member | null>(null);

   const selectStore = useCallback((next: Store) => setStore(next), []);
   const joinMembership = useCallback((next: Member) => setMember(next), []);
   const changeStore = useCallback(() => setStore(null), []);
   const signOut = useCallback(() => {
      setMember(null);
      setStore(null);
   }, []);

   const value = useMemo<SessionValue>(
      () => ({
         store,
         member,
         hydrated: true,
         selectStore,
         joinMembership,
         signOut,
         changeStore,
      }),
      [store, member, selectStore, joinMembership, signOut, changeStore],
   );

   return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
   const value = useContext(SessionContext);
   if (!value) {
      throw new Error('useSession must be used inside <SessionProvider>. It is mounted in src/app/_layout.tsx.');
   }
   return value;
}
