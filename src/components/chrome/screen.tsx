/**
 * The root every route renders. Its job is that five screens start identically.
 *
 * Before this, "a screen" was a convention: each file remembered to return a
 * `ScreenScroll`, remembered the app background, and said nothing at all about
 * the status bar — which meant the status bar was whatever the last mounted
 * screen happened to leave it as. Conventions drift; a component does not.
 *
 * What it owns:
 *
 * - **The status-bar style.** `tone` is a statement about what the *top* of the
 *   screen is: `inverse` means the first thing under the clock is House Green, so
 *   the clock has to be light. It is not a theme — the app is light-only
 *   (DESIGN_SYSTEM §2) and the body of an `inverse` screen is still cream.
 * - **The first-descendant rule.** `NativeTabs` finds a tab screen's first
 *   nested ScrollView and hands it the automatic content inset that keeps the
 *   last row clear of the tab bar. Wrapping that ScrollView in a plain `View`
 *   breaks the chain, so the wrapper here is `collapsable={false}`. Getting this
 *   wrong fails silently and looks like a padding bug three screens later.
 * - **The footer.** Rendered inside `BottomChrome`, so it clears the native tab
 *   bar and the home indicator without anyone doing arithmetic.
 *
 * What it deliberately does not own: bottom padding for the tab bar. That is a
 * content inset now, applied by iOS. See `screen-scroll.tsx`.
 */

import { StatusBar } from 'expo-status-bar';
import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { BottomChrome } from './insets';
import { ScreenScroll } from './screen-scroll';

import { Surface } from '@/theme';

type Props = {
   /** What sits under the clock. `inverse` for a House Green header band. */
   tone?: 'light' | 'inverse';
   /** Off for a screen that manages its own scrolling, or one that does not scroll. */
   scroll?: boolean;
   /** Sticky bottom content — an `ActionBar`. Drawn over the scroll, above the tab bar. */
   footer?: ReactNode;
   children: ReactNode;
   contentContainerStyle?: StyleProp<ViewStyle>;
};

export function Screen({
   tone = 'light',
   scroll = true,
   footer,
   children,
   contentContainerStyle,
}: Props) {
   /**
    * The footer floats over the scroll, so the scroll has to end early enough
    * that its last row is not permanently hidden behind it. Measured rather than
    * assumed because the footer is a slot — a one-button bar and a bar with a
    * total above it are different heights.
    *
    * The measured node is *inside* `BottomChrome`, so this is the footer's own
    * height with the safe-area part excluded. That part is already covered by
    * the scroll view's automatic bottom inset; counting it here would count the
    * tab bar twice.
    */
   const [footerHeight, setFooterHeight] = useState(0);

   return (
      <View style={styles.root} collapsable={false}>
         {/*
          * Renders no native view — RN's `StatusBar` returns null and only
          * applies a side effect — so the ScrollView below is still the first
          * descendant that matters.
          */}
         <StatusBar style={tone === 'inverse' ? 'light' : 'dark'} />

         {scroll ? (
            <ScreenScroll contentContainerStyle={contentContainerStyle}>
               {children}
               {/*
                * A spacer rather than an override of the scroll's own bottom
                * padding: adding to that file's air is composable, replacing it
                * means restating a constant this file does not own.
                */}
               {footerHeight > 0 ? <View style={{ height: footerHeight }} /> : null}
            </ScreenScroll>
         ) : (
            children
         )}

         {footer ? (
            <BottomChrome style={styles.footer}>
               <View onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}>
                  {footer}
               </View>
            </BottomChrome>
         ) : null}
      </View>
   );
}

const styles = StyleSheet.create({
   root: {
      flex: 1,
      backgroundColor: Surface.app,
   },
   /**
    * `flex: 0` cancels the `flex: 1` `BottomChrome` carries by default, so the
    * bar hugs its content instead of filling the screen behind it.
    */
   footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      flex: 0,
   },
});
