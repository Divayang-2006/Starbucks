/**
 * Web stand-ins for React Native community packages whose real web builds
 * can't serve a standalone preview card.
 *
 * Note what is deliberately NOT here: react-native-svg, react-native-reanimated,
 * react-native-worklets and react-native-gesture-handler all ship genuine web
 * implementations, and the `resolveExtensions` override in
 * `.design-sync/overrides/bundle.mjs` lets esbuild find their `.web.js` files.
 * Those render for real. Only what follows is substituted.
 */

import type { ReactNode } from 'react';
import { View } from 'react-native';

/* ── react-native-safe-area-context ───────────────────────────────────────
   The real `useSafeAreaInsets` throws without a <SafeAreaProvider> ancestor
   ("No safe area value available"), which would fail every card that renders a
   Screen. Zero insets are also the truthful answer: a preview card is not a
   notched device, and a component padded for a 47pt status bar would read as a
   spacing bug rather than as the device chrome it actually is. */
const ZERO = { top: 0, right: 0, bottom: 0, left: 0 };

export const useSafeAreaInsets = () => ZERO;
export const useSafeAreaFrame = () => ({ x: 0, y: 0, width: 390, height: 844 });
export const initialWindowMetrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: ZERO };

export function SafeAreaProvider({ children }: { children?: ReactNode }) {
   return <>{children}</>;
}

export function SafeAreaView({ children, style, ...rest }: { children?: ReactNode; style?: unknown; [k: string]: unknown }) {
   return (
      <View style={style as never} {...rest}>
         {children}
      </View>
   );
}

/* ── expo-sensors ─────────────────────────────────────────────────────────
   `HoloTilt` drives its sheen from DeviceMotion attitude. A browser has no
   such sensor, and the real module's web build throws
   `this._nativeModule.addListener is not a function` — three page errors that
   flag an otherwise perfectly good card as failing.

   `isAvailableAsync` resolves FALSE, which is the truthful answer here and the
   branch HoloTilt already handles: it renders its children at rest, exactly as
   it does on a device held still. Reporting `true` and then never emitting a
   reading would leave it waiting for motion that never arrives. */
export const DeviceMotion = {
   isAvailableAsync: async () => false,
   setUpdateInterval: () => {},
   addListener: () => ({ remove: () => {} }),
   removeAllListeners: () => {},
};
