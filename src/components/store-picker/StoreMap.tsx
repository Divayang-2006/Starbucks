import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';

import { MAPBOX_STANDARD } from '@/lib/mapbox';
import type { Store } from '@/lib/session';
import { Accent, Surface } from '@/theme';

import { MapPlate } from './MapPlate';
import { MapboxSdk } from './mapAvailability';
import { StorePin } from './StorePin';
import { BASEMAP, CAMERA } from './stage';

/**
 * The map. Warm and light, labelled with streets and places, twelve custom pins.
 *
 * Everything it knows comes down as props — it owns no selection state, only the
 * one thing the parent cannot see, which is whether the style ever loaded.
 * `onMapLoadingError` fires for tile failures too, so an error after a
 * successful style load is not treated as fatal; otherwise a flaky connection
 * would replace a perfectly good map with a plate.
 */

export type CameraTarget = {
   center: [number, number];
   zoom: number;
   duration: number;
   /** Omitted while browsing; set when a store is focused. See `CAMERA`. */
   pitch?: number;
};

type Props = {
   stores: readonly Store[];
   selectedId: string | null;
   /** Ids the live search matches. Null when there is no search running. */
   matchedIds: ReadonlySet<string> | null;
   camera: CameraTarget;
   /** Keeps a focused pin clear of the header and the sheet. */
   insets: { top: number; bottom: number };
   showPuck: boolean;
   onSelect: (store: Store) => void;
   onDeselect: () => void;
};

type Status = 'loading' | 'ready' | 'error';

/** Bottom-centre: the pin's ground dot is what should sit on the coordinate. */
const PIN_ANCHOR = { x: 0.5, y: 1 } as const;

const PUCK_PULSE = { isEnabled: true, color: Accent.gold, radius: 'accuracy' } as const;

export function StoreMap({
   stores,
   selectedId,
   matchedIds,
   camera,
   insets,
   showPuck,
   onSelect,
   onDeselect,
}: Props) {
   const [status, setStatus] = useState<Status>('loading');

   const onStyleLoaded = useCallback(() => setStatus('ready'), []);
   const onLoadingError = useCallback(
      () => setStatus((current) => (current === 'ready' ? current : 'error')),
      [],
   );

   // Hooks are all above this line, so the branch can never change hook order —
   // `MapboxSdk` is fixed for the lifetime of the bundle.
   if (!MapboxSdk) {
      return <MapPlate reason="unsupported" bottomInset={insets.bottom} />;
   }
   const { Camera, LocationPuck, MapView, MarkerView, StyleImport } = MapboxSdk;

   return (
      <View style={styles.frame}>
         <MapView
            style={StyleSheet.absoluteFill}
            styleURL={MAPBOX_STANDARD}
            projection="mercator"
            scaleBarEnabled={false}
            compassEnabled={false}
            // Mapbox's terms require the attribution and the logo to stay
            // visible. They are only repositioned, never disabled — and out of
            // the sheet's way, which is why they carry the bottom inset.
            logoPosition={{ bottom: insets.bottom + 8, left: 10 }}
            attributionPosition={{ bottom: insets.bottom + 8, left: 92 }}
            /**
             * The camera drives pitch on selection, but the *gesture* stays off:
             * a two-finger drag that tilts the map is a well-known way to get
             * lost, and nothing here needs the user to aim a camera.
             */
            pitchEnabled={false}
            rotateEnabled={false}
            onDidFinishLoadingStyle={onStyleLoaded}
            onMapLoadingError={onLoadingError}
            onPress={onDeselect}>
            <StyleImport id="basemap" existing config={BASEMAP} />
            <Camera
               centerCoordinate={camera.center}
               zoomLevel={camera.zoom}
               pitch={camera.pitch ?? CAMERA.browsePitch}
               animationMode="easeTo"
               animationDuration={camera.duration}
               padding={{
                  paddingTop: insets.top + CAMERA.edgePadding,
                  paddingBottom: insets.bottom + CAMERA.edgePadding,
                  paddingLeft: CAMERA.edgePadding,
                  paddingRight: CAMERA.edgePadding,
               }}
            />
            {showPuck ? <LocationPuck puckBearing="heading" pulsing={PUCK_PULSE} /> : null}

            {stores.map((store) => (
               <MarkerView
                  key={store.id}
                  coordinate={store.coordinate}
                  anchor={PIN_ANCHOR}
                  allowOverlap>
                  <StorePin
                     store={store}
                     selected={store.id === selectedId}
                     dimmed={matchedIds !== null && !matchedIds.has(store.id)}
                     onPress={onSelect}
                  />
               </MarkerView>
            ))}
         </MapView>

         {status === 'ready' ? null : (
            // Fades rather than cuts, so a fast style load does not flash.
            <Animated.View style={StyleSheet.absoluteFill} exiting={FadeOut.duration(420)}>
               <MapPlate reason={status} bottomInset={insets.bottom} />
            </Animated.View>
         )}
      </View>
   );
}

const styles = StyleSheet.create({
   frame: {
      ...StyleSheet.absoluteFill,
      // Held under the map so the first frame is cream, not white — it now
      // matches the basemap's land colour, so the style load has nothing to
      // flash against.
      backgroundColor: Surface.app,
   },
});
