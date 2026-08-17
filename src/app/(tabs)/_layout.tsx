/**
 * The tab shell: Home · Gift · Order · Pay · Rewards, on the real iOS tab bar,
 * with the account menu wrapped around the whole thing.
 *
 * This used to be a floating dark pill drawn in JS — `Tabs` from
 * `expo-router/js-tabs` with a `tabBar` render prop and a hand-animated capsule.
 * It looked right and it was a forgery: no scroll-edge behaviour, no minimize,
 * no VoiceOver rotor, no state restoration, and a `TAB_BAR_HEIGHT` constant that
 * every screen had to know about. What we wanted from the pill was that it
 * floats clear of the content; iOS 26 gives that away for free with
 * `minimizeBehavior`, and gives it *correctly*. So this is a real
 * `UITabBarController` now, and the argument in `docs/NAVIGATION.md` §3 for the
 * pill is superseded rather than merely out of date.
 *
 * **Exactly five tabs, and five is the ceiling.** Android's Material bottom
 * navigation caps at five and collapses the rest into an overflow that looks
 * nothing like the rest of the app. Account is already deliberately not a tab
 * (it lives behind the avatar in Home's header) — anything else that wants to be
 * one has to displace one of these.
 *
 * **What we style, and what we do not.** On iOS 26 the bar is Liquid Glass:
 * UIKit derives its appearance from whatever is scrolling underneath, and it
 * discards `backgroundColor`, `blurEffect`, `shadowColor` and
 * `disableTransparentOnScrollEdge` outright. Setting them would leave four props
 * in this file that read like decisions and are in fact dead. So the only colour
 * we pass is `tintColor` — the selected-item tint, which does land — and we let
 * the platform own the rest. Note this is also why `app.json` pins
 * `userInterfaceStyle` to `"light"`: a system bar with a dark appearance under a
 * cream app is the one mismatch we could not paint over while every pixel was
 * still ours.
 *
 * Labels are the system font on purpose, not Urbanist. A tab bar that uses the
 * platform's type is the platform's tab bar; one that doesn't is a pill again.
 *
 * Icons are SF Symbols with distinct filled variants for the selected state,
 * which is the UITabBar convention and not something our own stroke-only set can
 * express. The custom `Glyph` set is unaffected and still the source of every
 * in-screen icon — the two answer different questions. The `sf` names below are
 * typechecked against `sf-symbols-typescript`, so a symbol that does not exist
 * is a build error rather than an invisible tab.
 *
 * Each trigger points at a folder with its own `Stack`, so a PDP, a cart or a
 * gift-card detail pushes *inside* its tab and the bar stays put. Home is the
 * group `(home)` rather than a segment, so it still answers `/` while owning a
 * stack like the rest.
 *
 * ---
 *
 * **The account menu wraps the shell, not a screen.** `FluidMenu` takes the
 * whole tab tree as its children, so the card that scales down and slides right
 * carries the native bar with it. That is the deliberate reading of the effect:
 * the thing being set aside is *the app*, and an app is five tabs plus the bar
 * that switches between them. A bar left standing while the screen above it slid
 * away would say the menu is another screen, when the point is that it is a
 * layer underneath the whole app. `StageMock` has drawn a mock pill inside the
 * card since the first prototype frame for exactly this reason.
 *
 * Wrapping Home alone was considered and rejected. It puts the panel inside one
 * tab, so switching tabs leaves it behind — and this panel is the entrance to
 * everything outside the five, which makes "only reachable from one tab" the
 * wrong shape as well as the wrong picture.
 *
 * The cost is real and cannot be settled here: the bar inside that card is a
 * live `UITabBarController` in a scaled, clipped, shadow-casting view, and iOS
 * 26 derives its glass from what is behind it. `docs/NAVIGATION.md` §7 carries
 * the list of what only a device can answer.
 *
 * `openMenu` reaches Home's avatar through `useAppMenu`, because a navigator is
 * not something you thread a prop through. The left-edge pan is armed only on
 * Home at the root of its stack — `HOME_ROOT` below is that test, and says why.
 *
 * ---
 *
 * **The tab tree below is memoized, and that is not a micro-optimisation.**
 * `useSegments()` subscribes this component to *global* route information, so it
 * re-renders on every navigation anywhere in the app — a push inside Gift,
 * opening `/change-store`, a change of search params — and again on every open
 * and close of the panel, because `FluidMenu` re-renders its children's owner
 * when its own settled state flips. The tab shell has no business re-rendering
 * for any of that; before the menu wrapped it, it did not.
 *
 * `FluidMenu` used to take the tree as a render prop, which made that
 * unavoidable: a function child is re-invoked on every render of its owner, and
 * the value it returns is a new element every time, so `AppMenuProvider`,
 * `NativeTabs`, five triggers and both `SessionStrip` copies were rebuilt each
 * time. As a `useMemo`'d element with no dependencies, the *same element object*
 * is handed down on every one of those renders, and React compares
 * `oldProps === newProps` and skips the entire subtree. The provider in between
 * does not break the chain — its context value is memoized on an `openMenu` that
 * never changes identity, so it re-renders, publishes the same value, and its
 * own child bails out for the same reason.
 */

import { useRouter, useSegments, type Href } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useCallback, useMemo } from 'react';

import { SessionStrip } from '@/components/accessory';
import { FluidMenu, MENU_ITEMS, type MenuItem, type MenuItemId } from '@/components/fluid-menu';
import { useSession } from '@/lib/session';
import { Action } from '@/theme';

/** Declaration order is tab order. Route segment first, per §2 of the metadata. */
const TABS = [
   { name: '(home)', label: 'Home', sf: { default: 'house', selected: 'house.fill' } },
   { name: 'gift', label: 'Gift', sf: { default: 'gift', selected: 'gift.fill' } },
   {
      name: 'order',
      label: 'Order',
      sf: { default: 'cup.and.saucer', selected: 'cup.and.saucer.fill' },
   },
   { name: 'pay', label: 'Pay', sf: { default: 'creditcard', selected: 'creditcard.fill' } },
   { name: 'rewards', label: 'Rewards', sf: { default: 'star', selected: 'star.fill' } },
] as const;

/**
 * The one place the left-edge swipe arms: Home's stack, standing at its root.
 *
 * `useSegments()` reports the focused path from the root navigator down, groups
 * included and a trailing `index` dropped — so Home is exactly
 * `['(tabs)', '(home)']`, Gift is `['(tabs)', 'gift']`, and a screen pushed
 * inside a tab is longer than either. Comparing the *joined* path rather than
 * the first two entries is what puts depth in the test, and depth is half the
 * reason the test exists: a left-edge drag on a pushed screen is the system's
 * interactive pop, and fighting UIKit for that gesture is a fight we lose
 * loudly. Home has nothing pushed today; `order/product/[id]` and its friends
 * are coming, and this stays right when they arrive.
 *
 * The other half is the four sibling tabs, which are horizontal rails top to
 * bottom — the conflict `FluidMenu`'s own 44pt edge strip already exists to
 * dodge, avoided outright rather than narrowly.
 *
 * A root modal over the tabs (`change-store`) fails this too, and should: its
 * segments are its own, not the shell's.
 *
 * **`/lab/fluid-menu` fails it as well, and something depends on that.** The lab
 * route is pushed over the tabs rather than replacing them, so while it is open
 * there are two `FluidMenu`s mounted — two panels, two `Gesture.Pan()`s, both
 * inside the one `GestureHandlerRootView` at the root. The only thing keeping
 * them out of the same arena is this test going false for the shell's copy,
 * which disables that detector outright. Narrow the route test and the harness
 * starts fighting the shipped menu for the same left-edge drag.
 */
const HOME_ROOT = '(tabs)/(home)';

/**
 * Where each row goes.
 *
 * Four of them go nowhere yet, and they are written in as `null` rather than
 * left out of the table. The Account stack is still an open item in
 * `docs/NAVIGATION.md` §7 — §4 has decided it is a root modal, but not what is
 * inside it — so `Profile`, `Beverage Subscription`, `Coffee Stories` and
 * `Help & Support` have nothing to point at. Naming them here makes the gap
 * four lines you can count instead of a `default:` you have to notice, and
 * keying the record on `MenuItemId` means a tenth row in `items.ts` cannot be
 * added without this file refusing to compile.
 *
 * `logout` is absent because it is an action, not a route. See `handleSelect`.
 */
const MENU_ROUTES: Record<Exclude<MenuItemId, 'logout'>, Href | null> = {
   pay: '/pay',
   gift: '/gift',
   rewards: '/rewards',
   /** The map, as a full-screen modal — the same destination Home's "Change" uses. */
   stores: '/change-store',

   profile: null,
   subscription: null,
   stories: null,
   support: null,
};

/**
 * What a row with no destination does. Nothing on screen either way — but it
 * says so in a dev build, so the gap is found by the first person who taps it
 * and not only by the first person who reads `MENU_ROUTES`.
 */
function noDestination(label: string) {
   if (__DEV__) {
      console.warn(`[app menu] "${label}" has no destination yet — see docs/NAVIGATION.md §7.`);
   }
}

export default function TabLayout() {
   const router = useRouter();
   const segments = useSegments();
   const { member, store, signOut } = useSession();

   const atHomeRoot = segments.join('/') === HOME_ROOT;

   /**
    * The panel's avatar disc.
    *
    * This used to pass `undefined` for the missing case, on the grounds that
    * `MenuPanel` already has an answer for "no initials" — the person glyph —
    * and "two fallbacks for one absence is how they end up disagreeing". Sound
    * reasoning, wrong conclusion: Home's `AvatarButton` was already answering the
    * same absence with `'★'`, one band away and for the same disc, so the two
    * fallbacks existed either way and *were* disagreeing. `AvatarButton` takes a
    * required string by design and cannot be handed `undefined`, so the star is
    * the answer both can give, and this is the one that had to move.
    *
    * The glyph is not dead — it is still what the lab harness gets when it is
    * opened cold with no member at all. It is only no longer a second answer to
    * a question this screen has already answered.
    *
    * The membership gate means there is always a member in here anyway.
    */
   const initials = member
      ? `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase()
      : '★';

   const handleSelect = useCallback(
      (item: MenuItem) => {
         /**
          * Log Out clears both session booleans, the guards in
          * `src/app/_layout.tsx` settle on `store-picker`, and this entire
          * subtree — panel included — is unmounted.
          *
          * This used to say that was safe because `FluidMenu.handleSelect` "has
          * already settled the panel closed before calling us". It has not: it
          * has *started* a 520 ms spring, and on this row the spring never gets
          * a second frame. Its state write batches with the two `signOut()`
          * setStates, `Stack.Protected` re-evaluates in that same commit, and
          * the tab shell — card, panel and spring together — is gone before the
          * close animation plays at all. The panel does not slide shut on Log
          * Out; it disappears with everything else.
          *
          * The ordering is still right and there is still nothing to duplicate
          * here: dismiss-then-notify is what makes every *other* row put the
          * panel away without its consumer remembering to. It just is not a
          * visual guarantee, and the correctness of this branch does not rest
          * on one.
          */
         if (item.id === 'logout') {
            signOut();
            return;
         }

         const href = MENU_ROUTES[item.id];
         if (href) router.navigate(href);
         else noDestination(item.label);
      },
      [router, signOut],
   );

   /**
    * The panel's profile header is the `Profile` row wearing a different hat, so
    * it gets the same answer. Two entrances to one screen that does not exist
    * yet must not disagree about whether it exists.
    */
   const handleProfile = useCallback(() => noDestination('Profile'), []);

   /**
    * Empty dependencies, and every one of the values inside is module scope or a
    * component — nothing here can go stale. That is the whole point: this element
    * has to survive a re-render of `TabLayout` unchanged, or React has no reason
    * to skip the subtree. See the note at the top of the file.
    */
   const tabs = useMemo(
      () => (
         <NativeTabs
            /** House CTA green on the selected item. The one colour Liquid Glass keeps. */
            tintColor={Action.primary}
            /**
             * The bar collapses to a pill on the way into content and expands on the
             * way back up. This is what the old floating pill was reaching for, done
             * by the compositor instead of by us, and it is the reason no screen may
             * hardcode a tab bar height any more — there isn't one.
             */
            minimizeBehavior="onScrollDown"
         >
            {/*
             * Above the bar, outside every tab, and therefore never unmounted by a
             * tab switch. See `@/components/accessory`. iOS 26 and up; below that
             * `react-native-screens` never mounts the subtree, and Android and web
             * drop non-trigger children entirely, so there is nothing to guard here
             * beyond keeping the component itself free of platform assumptions.
             */}
            <NativeTabs.BottomAccessory>
               <SessionStrip />
            </NativeTabs.BottomAccessory>

            {TABS.map((tab) => (
               <NativeTabs.Trigger key={tab.name} name={tab.name}>
                  <NativeTabs.Trigger.Icon sf={tab.sf} />
                  <NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
               </NativeTabs.Trigger>
            ))}
         </NativeTabs>
      ),
      [],
   );

   return (
      <FluidMenu
         items={MENU_ITEMS}
         initials={initials}
         caption={store ? `Collecting from ${store.name}` : undefined}
         gestureEnabled={atHomeRoot}
         onSelect={handleSelect}
         onProfile={handleProfile}
      >
         {tabs}
      </FluidMenu>
   );
}
