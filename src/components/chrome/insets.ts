/**
 * Screen chrome geometry — the one place that knows how much of a screen the
 * system has already spent.
 *
 * All of this used to be arithmetic. The tab bar was a pill we drew ourselves,
 * so its height was a constant and every screen added it back as padding. The
 * bar is a real `UITabBarController` now: UIKit folds it, and the home indicator
 * beneath it, into the screen's own safe area — and on iOS 26 it changes height
 * as it minimizes. A constant is therefore not merely redundant, it is wrong for
 * most of the scroll.
 *
 * So the rule this file exists to enforce: **ask, never compute.** Nothing below
 * adds one number to another.
 *
 * `useSafeAreaInsets()` reports the *screen's* insets rather than the window's
 * because `NativeTabs` mounts a fresh `SafeAreaProvider` inside every tab screen
 * — that is the whole reason the bottom number already contains the tab bar.
 * Read outside a tab screen (a root-level modal, say) it degrades to the plain
 * window insets, which is the right answer there too.
 *
 * Three shapes, because there are three situations:
 *
 *   - a **scrolling** screen wants none of this: iOS insets the first nested
 *     ScrollView by itself, and `screen-scroll.tsx` lets it;
 *   - content that **does not scroll** wants `BottomChrome`, which reserves the
 *     space with a native view rather than a measured number;
 *   - anything positioning **by hand** — a sticky bar, an absolutely-placed
 *     control — wants the raw numbers.
 *
 * This is a `.ts` file rather than `.tsx` because it is two hooks and one
 * component whose entire body is a single element; one `createElement` call is
 * cheaper than making the module a JSX module for it.
 */

import { HeaderHeightContext } from 'expo-router/react-navigation';
import { createElement, use, type ReactElement, type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-screens/experimental';

/** Top safe-area inset — the status bar the header band paints behind. */
export function useTopInset(): number {
   return useSafeAreaInsets().top;
}

/**
 * Height of the native header, when there is one.
 *
 * Only a screen with `headerTransparent: true` needs this — a transparent header
 * floats over content that runs edge to edge beneath it, so the content has to
 * clear the whole bar rather than just the status bar `useTopInset()` reports.
 *
 * Reads the context directly rather than calling react-navigation's
 * `useHeaderHeight()`, for two reasons: that hook is marked `@deprecated` with a
 * note to copy it locally, and it *throws* when the context is absent — which is
 * every screen in this app that has no header. Returning 0 lets a caller ask
 * unconditionally, which is the same "ask, never compute" bargain as the rest of
 * this file.
 */
export function useHeaderInset(): number {
   return use(HeaderHeightContext) ?? 0;
}

/**
 * Bottom inset clearing the native tab bar AND the home indicator.
 *
 * One number for both because UIKit gives one number for both: the tab bar sits
 * over the home indicator and absorbs it, so a screen inside the tab controller
 * sees a single bottom inset that already covers the pair. Adding them would
 * double-count the indicator.
 */
export function useBottomChromeInset(): number {
   return useSafeAreaInsets().bottom;
}

/**
 * `SafeAreaView` insets only the edges named here and leaves the rest at zero,
 * so the top and the sides stay full-bleed the way the header band needs.
 */
const BOTTOM_EDGE = { bottom: true } as const;

type BottomChromeProps = {
   children?: ReactNode;
   style?: StyleProp<ViewStyle>;
};

/**
 * Reserves the bottom inset around children. For content that does not scroll.
 *
 * Uses the `SafeAreaView` from `react-native-screens/experimental` rather than
 * `useBottomChromeInset()` plus padding, because this one is resolved natively:
 * when the iOS 26 bar minimizes mid-gesture the view re-lays out on the same
 * frame the bar does, where a JS-measured number arrives a frame or two late and
 * the last row visibly hops.
 *
 * `insetType` is checked against the installed source, not the docs: the codegen
 * spec at `react-native-screens/src/fabric/safe-area/SafeAreaViewNativeComponent.ts`
 * marks it **Android-only**, defaulting to `'all'`. It is passed explicitly
 * anyway — `'all'` means system bars *and* interface chrome such as the tab bar,
 * which is exactly what this component promises, and stating it keeps the intent
 * readable on the platform where it is inert.
 *
 * Note that `SafeAreaView` carries `flex: 1` of its own; `style` is merged after
 * it, so a caller that wants to hug its content can say so.
 */
export function BottomChrome({ children, style }: BottomChromeProps): ReactElement {
   return createElement(SafeAreaView, { edges: BOTTOM_EDGE, insetType: 'all', style }, children);
}
