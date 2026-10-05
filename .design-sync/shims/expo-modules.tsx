/**
 * Web stand-ins for the Expo native modules this DS touches.
 *
 * Each is aliased individually in `tsconfig.sync.json`; they share a file
 * because every one of them is a handful of lines and keeping them together
 * makes the whole native surface auditable at a glance.
 *
 * The rule applied throughout: preserve the *shape* and the *layout*, drop the
 * device behaviour. A haptic tap has no visual output, so it becomes a no-op; a
 * `SymbolView` occupies space, so its stand-in occupies the same space rather
 * than collapsing and silently changing the composition around it.
 */

import type { ReactNode } from 'react';
import { Image as RNImage, View } from 'react-native';

/* ── expo-status-bar ──────────────────────────────────────────────────────
   Paints the OS status bar. There isn't one in a preview card. */
export function StatusBar() {
   return null;
}

/* ── expo-haptics ─────────────────────────────────────────────────────────
   Purely tactile — nothing to render, so no-ops are fully faithful. */
export const ImpactFeedbackStyle = { Light: 'light', Medium: 'medium', Heavy: 'heavy', Rigid: 'rigid', Soft: 'soft' } as const;
export const NotificationFeedbackType = { Success: 'success', Warning: 'warning', Error: 'error' } as const;
export const impactAsync = async () => {};
export const notificationAsync = async () => {};
export const selectionAsync = async () => {};

/* ── expo-location ────────────────────────────────────────────────────────
   Denied + a fixed coordinate. Store-picker components read this to decide
   between "near you" and the fallback list; denying is the deterministic
   branch, so previews don't depend on a browser geolocation prompt. */
export const Accuracy = { Lowest: 1, Low: 2, Balanced: 3, High: 4, Highest: 5, BestForNavigation: 6 } as const;
const DENIED = { status: 'denied' as const, granted: false, canAskAgain: false, expires: 'never' as const };
export const getForegroundPermissionsAsync = async () => DENIED;
export const requestForegroundPermissionsAsync = async () => DENIED;
export const getCurrentPositionAsync = async () => null;
export const getLastKnownPositionAsync = async () => null;

/* ── expo-splash-screen ───────────────────────────────────────────────────*/
export const preventAutoHideAsync = async () => {};
export const hideAsync = async () => {};

/* ── expo-web-browser ─────────────────────────────────────────────────────*/
export const WebBrowserPresentationStyle = {
   AUTOMATIC: 'automatic',
   FULL_SCREEN: 'fullScreen',
   PAGE_SHEET: 'pageSheet',
   FORM_SHEET: 'formSheet',
   OVER_FULL_SCREEN: 'overFullScreen',
} as const;
export const openBrowserAsync = async () => ({ type: 'cancel' as const });

/* ── expo-image ───────────────────────────────────────────────────────────
   react-native-web's Image is the real equivalent; only the prop names differ.
   `contentFit` is expo-image's name for what RN calls `resizeMode`. */
export function Image({
   source,
   style,
   contentFit,
   transition: _transition,
   placeholder: _placeholder,
   ...rest
}: {
   source?: unknown;
   style?: unknown;
   contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
   transition?: unknown;
   placeholder?: unknown;
   [k: string]: unknown;
}) {
   const resizeMode = contentFit === 'scale-down' ? 'contain' : (contentFit ?? 'cover');
   return <RNImage source={source as never} style={style as never} resizeMode={resizeMode as never} {...rest} />;
}

/* ── expo-symbols ─────────────────────────────────────────────────────────
   SF Symbols are an Apple system font; there is no web equivalent. Rendering
   nothing would collapse the layout around every call site, so this holds the
   symbol's exact footprint with a faint tinted mark — visibly a placeholder,
   never a phantom gap. Components using DS `Glyph` (real SVG) are unaffected. */
export function SymbolView({
   size = 24,
   tintColor = '#1E1E1E',
   style,
   ...rest
}: {
   name?: string;
   size?: number;
   tintColor?: string;
   style?: unknown;
   [k: string]: unknown;
}) {
   return (
      <View
         style={[
            { width: size, height: size, borderRadius: size * 0.24, backgroundColor: tintColor, opacity: 0.22 },
            style as never,
         ]}
         {...rest}
      />
   );
}

/* ── react-native-screens/experimental ────────────────────────────────────
   Only `SafeAreaView` is used, for the edge insets of a full screen. In a card
   there are no device insets, so this is a plain passthrough box. */
export function SafeAreaView({ children, style, ...rest }: { children?: ReactNode; style?: unknown; [k: string]: unknown }) {
   return (
      <View style={style as never} {...rest}>
         {children}
      </View>
   );
}

/* ── expo-router/react-navigation ─────────────────────────────────────────
   Only HeaderHeightContext is read. null = "no navigator above me", which is
   exactly true here, and consumers already handle that. */
import { createContext } from 'react';
export const HeaderHeightContext = createContext<number | undefined>(undefined);
