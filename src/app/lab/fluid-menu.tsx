/**
 * The account menu's tuning harness.
 *
 * The mechanism itself has shipped: `@/components/fluid-menu` wraps the tab
 * shell in `(tabs)/_layout.tsx` and Home's avatar opens it. This route is what
 * is left over, and it is worth keeping for one reason — it wraps `StageMock`
 * instead of the real tabs, so the motion can be judged on a reload rather than
 * on a dev build with a store chosen and a membership claimed. A route outside
 * the flow guards opens cold; the shipped one, by definition, does not.
 *
 * `StageMock` is the same shared components Home is built from, so what shrinks
 * here is what shrinks there. The one thing it draws for itself is the tab
 * pill, because the real bar is a `UITabBarController` this screen is not
 * inside — and a card with no bar in it does not look like the app.
 *
 * Two ways in, on purpose:
 *
 * - **Tap** the hamburger in the header. The obvious one.
 * - **Drag** from the left edge. The reason the panel is worth building this way —
 *   the stagger tracks your thumb rather than replaying at you. Stop halfway and
 *   it holds halfway. Details in `FluidMenu.tsx`.
 *
 * `gestureEnabled` is left at its default here. The app gates the edge swipe to
 * Home at its stack root because the other tabs are rails and a pushed screen
 * owns that edge already; this harness is one screen with nothing to collide
 * with, and gating it would only make the thing being tuned harder to reach.
 *
 * **This route is pushed over the tabs, not instead of them.** While it is open
 * the tab shell is still mounted underneath, so there are two `FluidMenu`s
 * alive — two panels, two `Gesture.Pan()`s, both inside the single
 * `GestureHandlerRootView` at the app root. The only thing that stops them
 * arbitrating for the same left-edge drag is that the shell's copy has
 * `gestureEnabled={false}` here: `HOME_ROOT` in `(tabs)/_layout.tsx` compares
 * the whole focused path, and this route's segments are not Home's. That is a
 * dependency in the other direction — loosen the route test there and this
 * screen stops working.
 *
 * `openMenu` comes from `useAppMenu()` rather than being handed down, and that
 * is on purpose even though the hamburger is one component away. `FluidMenu`
 * mounts `AppMenuProvider` around its children, and this is the only harness in
 * the repo — a lab that exercised the motion but skipped the seam next to it
 * could not catch a regression in the seam. Wiring it the same way the app does
 * means the app's way is the way that gets tuned.
 *
 * Rows echo their label back into the sheet rather than navigating, which is
 * still right: the real destinations belong to the layout that mounts the real
 * menu, and half of them do not exist yet anyway. What this screen is for is
 * whether the movement is right.
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';

import { FluidMenu, MENU_ITEMS, useAppMenu, type MenuItem } from '@/components/fluid-menu';
import { StageMock } from '@/components/fluid-menu/StageMock';
import { useSession } from '@/lib/session';

export default function FluidMenuLab() {
   const router = useRouter();
   const { member, store } = useSession();
   const [picked, setPicked] = useState<string>();

   /**
    * Real session data when the route was reached through the app, placeholders
    * when it was opened cold. The prototype has to work standalone — that is most
    * of why it is a route of its own.
    */
   const initials = member
      ? `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase()
      : undefined;
   const greeting = member ? `Hi, ${member.firstName}` : 'Hi there';
   const storeName = store?.name ?? 'Koregaon Park';

   const handleSelect = useCallback((item: MenuItem) => setPicked(item.label), []);
   const handleProfile = useCallback(() => setPicked('Account'), []);
   const handleExit = useCallback(() => router.back(), [router]);

   return (
      <>
         {/* Light throughout — the panel is House Green and so is the card's header. */}
         <StatusBar style="light" />

         <FluidMenu
            items={MENU_ITEMS}
            initials={initials}
            caption={`Collecting from ${storeName}`}
            onSelect={handleSelect}
            onProfile={handleProfile}
         >
            <Stage greeting={greeting} storeName={storeName} picked={picked} onExit={handleExit} />
         </FluidMenu>
      </>
   );
}

/**
 * A component rather than the mock inline, for one reason: `useAppMenu()` has to
 * be called *below* `FluidMenu`, and this screen is above it. That is the same
 * position Home is in — the hook is the only way across — so putting the harness
 * in it is what makes the harness a harness.
 */
function Stage({
   greeting,
   storeName,
   picked,
   onExit,
}: {
   greeting: string;
   storeName: string;
   picked?: string;
   onExit: () => void;
}) {
   const { openMenu } = useAppMenu();

   return (
      <StageMock
         greeting={greeting}
         storeName={storeName}
         picked={picked}
         onMenu={openMenu}
         onExit={onExit}
      />
   );
}
