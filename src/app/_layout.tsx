/**
 * The root layout, and the whole of the Stage-1 flow.
 *
 *   map ──▶ membership ──▶ tabs
 *
 * The three screens below are **mutually exclusive guards**, not a sequence of
 * pushes. Exactly one of the three is reachable at any moment, because the three
 * conditions partition the two booleans in the session:
 *
 *   no store                → store-picker
 *   store, not a member     → membership
 *   store and a member      → (tabs)
 *
 * That invariant is what lets every screen stay dumb. Nothing calls
 * `router.push` to cross a gate; a screen updates the session and the router
 * settles on whichever gate is now open. Picking a store advances you; signing
 * out drops you back to the map; "Change store" from Home rewinds one gate. No
 * screen has to know what comes after it, and there is no way to end up behind a
 * gate you have already cleared by pressing Back.
 *
 * Order matters here and is load-bearing: when the focused route is guarded away
 * the navigator falls back to the *first* screen still in the list, so the gates
 * are declared in flow order and `lab/` is declared last so it is never a
 * fallback target.
 *
 * This Stack is also where the app's modals will go — the cart, the scanner and
 * the Account stack — with `presentation: 'modal'`, because a modal declared
 * here covers the tab bar and one declared inside a tab does not. See
 * `docs/NAVIGATION.md` §4 for which screen belongs where. None of them exist
 * yet, and there are deliberately no stubs standing in for them.
 *
 * `GestureHandlerRootView` is the outermost thing this file *renders* — outside
 * the theme and outside the session, because it is neither. It is the arena
 * every gesture in the app is resolved in, and a gesture handler mounted outside
 * it is one that silently never fires. It lived in `lab/fluid-menu.tsx` while
 * that route was the only consumer; the account menu now wraps the tab shell, so
 * the root is the only place left that contains every consumer.
 *
 * It is not the outermost thing in the file, which is what this used to claim.
 * The font gate's `return null` sits above it and renders nothing at all — see
 * the comment there for why that is the right order and not an oversight.
 */

import { useFonts } from 'expo-font';
import { Stack, ThemeProvider, DefaultTheme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { initMapbox } from '@/lib/mapbox';
import { SessionProvider, useSession } from '@/lib/session';
import { APP_FONTS, Action, Border, Surface, TextColor } from '@/theme';

SplashScreen.preventAutoHideAsync();

// Module scope, not an effect: the token must be set before the first MapView
// attaches, and a layout effect can run after a child screen has already mounted.
// The map is now the very first screen, so there is no slack at all here.
initMapbox();

/**
 * Light only — see DESIGN_SYSTEM §2. The one thing this overrides that matters is
 * `background`: React Navigation paints it between screens, and its default
 * white flashes against cream on every transition.
 *
 * It is now load-bearing for a second reason. A `NativeTabs` tree without an
 * explicit `ThemeProvider` flashes white on iOS 26 while the tab controller
 * settles — this is the documented fix, and it pairs with `userInterfaceStyle`
 * being pinned to `"light"` in `app.json`. A real `UITabBar` would otherwise
 * render its dark appearance against a cream app the moment the device is in
 * dark mode, which is the point at which "light only" stopped being a claim we
 * could make purely in tokens.
 */
const NavTheme = {
   ...DefaultTheme,
   colors: {
      ...DefaultTheme.colors,
      background: Surface.app,
      card: Surface.app,
      text: TextColor.primary,
      border: Border.hair,
      primary: Action.primary,
   },
};

/**
 * The map screens' chrome — **none from UIKit**, because the app has its own.
 *
 * This was a transparent, blurred `UINavigationBar` with `Pick your store` in
 * it. Two problems, one of them structural. A `UINavigationBar` cannot carry the
 * siren, cannot carry the caps kicker, and sets its title in the system face, so
 * the one screen every user meets first was the one screen not wearing the app's
 * header band. And the title itself named a database row rather than asking
 * about coffee.
 *
 * So the bar is off and `store-picker/PickerHeader` floats `ScreenHeader` over
 * the map instead — same band as Home, Order, Pay, Gift and Rewards. It is
 * absolutely positioned, so the map still runs edge to edge underneath it, which
 * is what `headerTransparent` was buying.
 *
 * `contentStyle` stays: it is the colour the screen is painted before the map's
 * first tiles arrive, and white there flashes against House Green.
 */
const MAP_SCREEN = {
   headerShown: false,
   contentStyle: { backgroundColor: Surface.inverse },
} as const;

export default function RootLayout() {
   /**
    * Loaded once, here, for the whole app. It used to happen inside the
    * onboarding route, which meant every other screen was one route away from
    * rendering Urbanist as system sans for a frame.
    */
   const [fontsLoaded, fontError] = useFonts(APP_FONTS);

   useEffect(() => {
      // Hand the screen over on either outcome. A missing font file is a wrong
      // typeface; sitting on the splash forever is a broken app.
      if (fontsLoaded || fontError) {
         SplashScreen.hideAsync().catch(() => {
            // Already hidden, or no splash to hide. Nothing to recover from.
         });
      }
   }, [fontsLoaded, fontError]);

   // Held behind the native splash rather than a coloured View, so there is no
   // seam between the launch image and the first screen. The gate is above the
   // root view rather than inside it: nothing is on screen to keep alive, and a
   // gesture arena with no tree in it has nothing to arbitrate.
   if (!fontsLoaded && !fontError) return null;

   return (
      // `flex: 1` explicitly. It is a plain View underneath, and one that hugs
      // its content gives the whole app zero height with no error to read.
      <GestureHandlerRootView style={styles.root}>
         <ThemeProvider value={NavTheme}>
            <SessionProvider>
               <FlowStack />
            </SessionProvider>
         </ThemeProvider>
      </GestureHandlerRootView>
   );
}

const styles = StyleSheet.create({
   root: {
      flex: 1,
   },
});

function FlowStack() {
   const { store, member } = useSession();

   return (
      <Stack screenOptions={{ headerShown: false }}>
         {/* Gate one. Also the launch screen. */}
         <Stack.Protected guard={!store}>
            <Stack.Screen name="store-picker" options={MAP_SCREEN} />
         </Stack.Protected>

         {/*
          * Gate two. Fades rather than slides: you have not gone anywhere, the
          * store you just chose is still the subject — the app is asking who you
          * are before it will show you its menu.
          */}
         <Stack.Protected guard={!!store && !member}>
            <Stack.Screen name="membership" options={{ animation: 'fade' }} />
         </Stack.Protected>

         {/* Both gates cleared. `(tabs)/index` is what answers `/`. */}
         <Stack.Protected guard={!!store && !!member}>
            <Stack.Screen name="(tabs)" />
         </Stack.Protected>

         {/*
          * Changing a store you already have. Unguarded, because the whole point
          * is that it stays reachable while gate one is closed — `router.push` to
          * a guarded-away name is silently dropped, so this is the only way for a
          * screen inside the tabs to get back to the map.
          *
          * `fullScreenModal` rather than `modal`: `modal` is a UIKit pageSheet,
          * and this screen presents its own `.sheet` for the store list. A sheet
          * inside a sheet has its detents bounded by the outer card and makes
          * dismissal ordering fragile.
          */}
         <Stack.Screen
            name="change-store"
            options={{ ...MAP_SCREEN, presentation: 'fullScreenModal' }}
         />

         {/*
          * Unguarded, and deliberately outside the flow: prototypes need to be
          * openable without walking the gates first. Declared last so it can
          * never become the fallback when a gate closes.
          */}
         <Stack.Screen name="lab/fluid-menu" options={{ animation: 'none' }} />
      </Stack>
   );
}
