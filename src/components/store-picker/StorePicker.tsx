import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { HeaderButton, useBottomChromeInset, useTopInset } from '@/components/chrome';
import { SirenLogo } from '@/components/onboarding/SirenLogo';
import { CloseGlyph, CrosshairGlyph } from '@/components/store-picker/Glyphs';
import { MapPlate } from '@/components/store-picker/MapPlate';
import { PickerHeader } from '@/components/store-picker/PickerHeader';
import { StoreMap, type CameraTarget } from '@/components/store-picker/StoreMap';
import { StoreSheet } from '@/components/store-picker/StoreSheet';
import { commitFeedback, pinFeedback } from '@/components/store-picker/feedback';
import { ALL_CITIES, buildCityFilters, matchesQuery, type CityFilter } from '@/components/store-picker/geo';
import { MAP_UNAVAILABLE } from '@/components/store-picker/mapAvailability';
import { CAMERA, SHEET, headerBlock, headerChrome, sheetHeight } from '@/components/store-picker/stage';
import type { SheetStage } from '@/components/store-picker/StoreSheet.shared';
import { useNearby, type NearbyStatus } from '@/components/store-picker/useNearby';
import { useStores, type StoresSource } from '@/components/store-picker/useStores';
import { STORES } from '@/data/stores';
import { useSession, type Store } from '@/lib/session';
import { IconSize, Surface, TextColor } from '@/theme';

/**
 * The store picker, in both of the places it is used.
 *
 * The screen composes; the pieces in `src/components/store-picker/` do the work.
 *
 * ## Two modes, because there are two ways to arrive
 *
 * - `gate` — the launch screen, behind the `!store` guard in `_layout.tsx`.
 *   Confirming calls `selectStore` and **stops there**: the guard reads the
 *   session and moves the user on. Pushing a route as well would navigate twice.
 * - `change` — the same screen presented as a modal from `/change-store` while a
 *   store is already chosen. Here the guard is not involved at all, because
 *   `store` never becomes null, so the screen has to dismiss itself.
 *
 * The mode exists because of a hard router constraint rather than a preference:
 * `router.push('/store-picker')` from inside the tabs is **silently dropped** —
 * expo-router returns null for a PUSH whose name is not in `state.routeNames`,
 * and a closed `Stack.Protected` guard removes it from exactly that list. So
 * "change my store" cannot reuse the gate route and needs an unguarded twin.
 *
 * Everything else about the two is identical, which is the point: one screen,
 * one set of behaviours, one place to fix a bug in either.
 *
 * Every state the map can be in leaves the screen usable: no token, no dev build
 * on web, a style that failed to load. The list is the floor, which is why it is
 * the face the sheet shows on arrival.
 *
 * **The one screen that positions by hand, and the only one allowed to.** It is
 * a full-bleed map with a sheet that travels, so `Screen` — which lays content
 * out in a column over the cream background — would take away the thing this
 * screen is made of. `ScreenHeader` is a different matter and this screen does
 * use it, floated over the map by `PickerHeader`: the band is the app's, and a
 * map is still a screen. What this file is *not* allowed to do is have its own
 * opinion about insets — it reads them from `@/components/chrome`, the same
 * module the band reads, so the app tells one story about screen geometry
 * (`docs/COMPONENTS.md` §2 rule 4).
 *
 * Note this is a **root** route, outside the tab navigator, so
 * `useBottomChromeInset()` here reports the home indicator alone — there is no
 * tab bar under the sheet to clear. That is the right answer and it is why the
 * hook asks rather than computes: the same call inside a tab would include the
 * bar, and neither caller has to know which it is.
 */

/**
 * The rail is derived from the **seed**, at module scope, even though the pins
 * themselves are now live.
 *
 * That is deliberate rather than lazy. These filters are geographic anchors — a
 * label and a camera position per city — and anchors have to be stable: derived
 * from the live response instead, the rail would reshuffle as results arrived,
 * and the city you are currently looking at supplies the proximity for the very
 * request whose results would redraw it. Stable anchors break that cycle.
 */
const CITY_FILTERS = buildCityFilters(STORES);

/**
 * Pune, because that is where the seed's `distanceKm` values are measured from
 * (see `src/data/stores.ts`). Opening on "All stores" would show the whole
 * country and no store closer than a hundred kilometres.
 */
const DEFAULT_CITY = CITY_FILTERS[1] ?? CITY_FILTERS[0];

const HAS_MAP = MAP_UNAVAILABLE === null;

/**
 * Says so when the pins are not real.
 *
 * Takes priority over the location note because it is the more fundamental
 * caveat: knowing your distances are measured from Pune matters much less than
 * knowing the stores themselves are stand-ins. `mixed` says nothing — some rows
 * being live and some seeded is the normal steady state once one city has
 * resolved, and a permanent banner for the normal case is just noise.
 */
function sourceNote(source: StoresSource): string | null {
   return source === 'seed'
      ? 'These are stand-in stores — we can’t reach the real ones just now.'
      : null;
}

function locationNote(status: NearbyStatus): string | null {
   switch (status) {
      case 'asking':
      case 'locating':
         return 'Working out where you are…';
      case 'granted':
         return 'Distances are from where you’re standing.';
      case 'denied':
         return `Location’s off, so we’re counting from ${DEFAULT_CITY.label}. Tap the crosshair to fix that.`;
      case 'unavailable':
         return `No fix yet — we’re counting from ${DEFAULT_CITY.label}.`;
      default:
         return null;
   }
}

export type PickerMode = 'gate' | 'change';

/**
 * The band's words, per mode.
 *
 * The title used to be `Pick your store`, set by the navigation bar. That is a
 * label for a database row, not a question about coffee — the screen is asking
 * where you want to pick your coffee up from, so it asks that. The kicker is the
 * same in both modes on purpose: the subject never changes, only the question
 * does, and holding the label steady is what makes `change` read as a revision
 * of an answer rather than a different screen.
 */
const COPY = {
   gate: { kicker: 'Your Starbucks', title: 'Where are you picking up?' },
   change: { kicker: 'Your Starbucks', title: 'Somewhere else today?' },
} as const;

export function StorePicker({ mode }: { mode: PickerMode }) {
   const topInset = useTopInset();
   const bottomInset = useBottomChromeInset();
   const { height: windowHeight } = useWindowDimensions();
   const { selectStore } = useSession();
   const router = useRouter();
   const nearby = useNearby();

   /**
    * How far the sheet is open, which is the one thing the chrome above it
    * reacts to: the header folds and the search field arrives together, and both
    * are the same decision — "is the user browsing yet?".
    *
    * Starts at `peek` because that is where both sheets start. On iOS that is
    * the initial detent; on Android `collapsed` below is seeded to match.
    */
   const [stage, setStage] = useState<SheetStage>('peek');
   const browsing = stage !== 'peek';

   /**
    * Two heights, not a measurement. The band animates, and a measured band
    * reports a new height on every frame of its own collapse — eighteen renders
    * to move a camera that only cares where it lands. See `stage.ts`.
    */
   const headerTotal = headerChrome(topInset) + (browsing ? 0 : headerBlock());

   const [cityId, setCityId] = useState(DEFAULT_CITY.id);
   const [query, setQuery] = useState('');
   const [selectedId, setSelectedId] = useState<string | null>(null);
   /**
    * The Reanimated sheet starts peeked when there is a map worth peeking at,
    * and open when there is not — with no map the sheet is the whole screen and
    * hiding its search field behind a chevron would be perverse. iOS ignores
    * this entirely; UIKit owns its detents and starts at `PEEK`.
    */
   const [collapsed, setCollapsed] = useState(HAS_MAP);
   const [camera, setCamera] = useState<CameraTarget>({
      center: DEFAULT_CITY.center,
      zoom: DEFAULT_CITY.zoom,
      duration: 0,
   });

   const sheetTotal = sheetHeight(windowHeight) + bottomInset;

   const trimmedQuery = query.trim();
   const searching = trimmedQuery.length > 0;
   const activeCity = CITY_FILTERS.find((filter) => filter.id === cityId) ?? DEFAULT_CITY;

   /**
    * Live Starbucks for whichever city is selected, seeded rows as the floor. The
    * proximity comes from the stable rail anchor rather than from the camera, so
    * panning the map does not fire a request per frame — the user changes cities
    * deliberately, and that is the right granularity to refetch on.
    */
   const { stores, source } = useStores(
      activeCity.center,
      activeCity.id === ALL_CITIES ? undefined : activeCity.id,
   );

   const { distanceFor } = nearby;

   /**
    * A search deliberately escapes the city filter — typing "bandra" while you
    * are looking at Pune should find Bandra rather than nothing. The rail reads
    * as "All stores" while that is true, so the widened scope is visible.
    */
   const listed = useMemo(() => {
      const scope = searching
         ? stores.filter((store) => matchesQuery(store, trimmedQuery))
         : stores.filter((store) => cityId === ALL_CITIES || store.city === cityId);
      return [...scope].sort((a, b) => distanceFor(a) - distanceFor(b));
   }, [stores, searching, trimmedQuery, cityId, distanceFor]);

   /** Null when nothing is being searched, so the pins know to stay at full strength. */
   const matchedIds = useMemo(
      () => (searching ? new Set(listed.map((store) => store.id)) : null),
      [searching, listed],
   );

   const selected = useMemo(
      () => stores.find((store) => store.id === selectedId) ?? null,
      [stores, selectedId],
   );

   /** Flattens as well as moves — browsing is always top-down. */
   const flyTo = useCallback((target: CityFilter) => {
      setCamera({
         center: target.center,
         zoom: target.zoom,
         duration: CAMERA.cityDuration,
         pitch: CAMERA.browsePitch,
      });
   }, []);

   const handleSelectCity = useCallback(
      (filter: CityFilter) => {
         setCityId(filter.id);
         setQuery('');
         setSelectedId(null);
         /**
          * Deliberately does *not* open the sheet, which it used to. Choosing a
          * city flies the camera somewhere, and opening the sheet on the same
          * tap covers the place you just asked to be taken to — and collapses
          * the rail you are still choosing from. You stay where you are and
          * watch the map move.
          */
         flyTo(filter);
      },
      [flyTo],
   );

   const handleQueryChange = useCallback(
      (next: string) => {
         const wasSearching = trimmedQuery.length > 0;
         const nowSearching = next.trim().length > 0;
         setQuery(next);
         if (wasSearching === nowSearching) return;
         // Only on the edges, never per keystroke — a camera that chases every
         // letter reads as a bug rather than as help.
         setSelectedId(null);
         flyTo(nowSearching ? CITY_FILTERS[0] : activeCity);
      },
      [trimmedQuery, activeCity, flyTo],
   );

   const handleSelectStore = useCallback((store: Store) => {
      pinFeedback();
      setSelectedId(store.id);
      setCollapsed(false);
      setCamera({
         center: store.coordinate,
         zoom: CAMERA.focusZoom,
         duration: CAMERA.focusDuration,
         // The tilt is the reward for choosing: it is what stands the extruded
         // store volume and the surrounding 3D buildings up off the map.
         pitch: CAMERA.focusPitch,
      });
   }, []);

   const handleBack = useCallback(() => {
      setSelectedId(null);
      flyTo(searching ? CITY_FILTERS[0] : activeCity);
   }, [searching, activeCity, flyTo]);

   const handleConfirm = useCallback(
      (store: Store) => {
         commitFeedback();
         selectStore(store);

         /**
          * In `gate` mode that is the whole contract — `store` goes from null to
          * set, the guard closes behind us and the router settles on whatever is
          * now reachable. Dismissing as well would navigate twice.
          *
          * In `change` mode the guard never moves, because `store` was already
          * set and stays set. Nothing else will dismiss this modal, so it has to
          * dismiss itself.
          */
         if (mode === 'change') router.back();
      },
      [mode, router, selectStore],
   );

   const handleLocate = useCallback(() => {
      /**
       * Guarded here rather than by disabling the control. The toolbar item this
       * replaced took a `disabled` prop; `HeaderButton` deliberately does not,
       * because a header control that greys out for the second and a half a fix
       * takes reads as broken. It stays live and the second tap is a no-op.
       */
      if (nearby.status === 'asking' || nearby.status === 'locating') return;

      const flyTo = (center: [number, number]) =>
         setCamera({
            center,
            zoom: CAMERA.cityZoom + 1.6,
            duration: CAMERA.cityDuration,
         });

      // Already have a fix: move now. Otherwise ask, and move when one lands.
      if (nearby.coords) {
         flyTo(nearby.coords);
         return;
      }
      nearby.request(flyTo);
   }, [nearby]);

   /**
    * How much of the screen bottom the sheet is currently covering.
    *
    * On iOS the native sheet reports this as the user drags between detents, so
    * the camera keeps a focused pin clear of whatever height they left it at.
    * Everywhere else nothing reports, the state stays null, and the arithmetic
    * falls back to the height the screen itself chose for the Reanimated sheet.
    */
   const [sheetCovered, setSheetCovered] = useState<number | null>(null);

   const mapInsets = useMemo(
      () => ({
         top: headerTotal,
         bottom: sheetCovered ?? (collapsed ? SHEET.peek : sheetTotal),
      }),
      [headerTotal, sheetCovered, collapsed, sheetTotal],
   );

   return (
      <View style={styles.screen}>
         <StatusBar style="light" />

         {HAS_MAP ? (
            <StoreMap
               /**
                * `stores`, never `STORES`. The live and seeded rows live in
                * disjoint id spaces — a live id is Mapbox's `mapbox_id`, a seeded
                * one is a slug like `pune-koregaon-park` — so handing the map the
                * seed while the sheet gets the live list means `selectedId` never
                * matches anything the map holds. That failure is silent and total:
                * `selectedStore` resolves to null, so the pin never highlights, the
                * building extrusion never mounts, and the detail face with the
                * Confirm button never appears. `STORES` is still imported because
                * `CITY_FILTERS` is derived from it at module scope, which is what
                * makes this an easy line to get wrong twice.
                */
               stores={stores}
               selectedId={selectedId}
               matchedIds={matchedIds}
               camera={camera}
               insets={mapInsets}
               showPuck={nearby.status === 'granted'}
               onSelect={handleSelectStore}
               onDeselect={handleBack}
            />
         ) : (
            <MapPlate reason={MAP_UNAVAILABLE ?? 'unsupported'} bottomInset={mapInsets.bottom} />
         )}

         {/*
          * The app's header band, not a bar of this screen's own invention — see
          * the note at the top of `PickerHeader`. It replaces both the
          * transparent `UINavigationBar` and the `EdgeFade` that used to darken
          * the map under it: the band is opaque House Green, so there is nothing
          * left for a gradient to rescue.
          *
          * The two controls that were `Stack.Toolbar` items are now the band's
          * own `left` and `right` slots. That is a small loss — UIKit was
          * handling their hit targets and VoiceOver ordering — and a larger win,
          * because `HeaderButton` is the control every other screen uses and it
          * is already a 44pt target with the same translucent fill.
          */}
         <PickerHeader
            filters={CITY_FILTERS}
            activeCityId={searching ? ALL_CITIES : cityId}
            onSelectCity={handleSelectCity}
            kicker={COPY[mode].kicker}
            title={COPY[mode].title}
            collapsed={browsing}
            left={
               mode === 'change' ? (
                  /*
                   * Only the modal needs a way out. The gate has nowhere to go
                   * back to — it is the first screen in the app, and leaving it
                   * without a store is not a state the router has, which is why
                   * the siren stands in that slot there instead.
                   */
                  <HeaderButton label="Keep the store I have" onPress={() => router.back()}>
                     <CloseGlyph size={IconSize.xs} color={TextColor.onDark} />
                  </HeaderButton>
               ) : (
                  <SirenLogo width={30} />
               )
            }
            right={
               <HeaderButton label="Find me on the map" onPress={handleLocate}>
                  <CrosshairGlyph size={IconSize.md} color={TextColor.onDark} />
               </HeaderButton>
            }
         />

         <StoreSheet
            height={sheetTotal}
            bottomInset={bottomInset}
            selected={selected}
            collapsed={collapsed}
            collapsible={HAS_MAP}
            onToggleCollapsed={() => setCollapsed((open) => !open)}
            onBack={handleBack}
            stores={listed}
            query={query}
            onQueryChange={handleQueryChange}
            distanceFor={distanceFor}
            onSelect={handleSelectStore}
            onConfirm={handleConfirm}
            note={sourceNote(source) ?? locationNote(nearby.status)}
            onDetentChange={setSheetCovered}
            onStageChange={setStage}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: Surface.inverse,
   },
});
