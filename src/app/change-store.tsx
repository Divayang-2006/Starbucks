/**
 * Changing your store once you already have one.
 *
 * The same map as gate one, presented as a modal from anywhere in the app. It
 * exists as a second route rather than as a link back to `/store-picker` because
 * of a router constraint that is easy to trip over and gives no error when you
 * do: `router.push('/store-picker')` from inside the tabs is **silently
 * dropped**. expo-router returns null for a PUSH whose name is not in
 * `state.routeNames`, and a `Stack.Protected` whose guard is closed removes the
 * name from exactly that list. Once you have a store, gate one is closed — so
 * the route you would push is the one route you cannot reach.
 *
 * Presented as `fullScreenModal`, not `modal`. `modal` is a UIKit `pageSheet`,
 * and this screen presents a real `.sheet` of its own for the store list —
 * presenting a sheet from inside a sheet bounds the inner one's detents by the
 * outer card and makes dismissal ordering fragile. A full-screen VC hosts it
 * exactly the way the root route does.
 */

import { StorePicker } from '@/components/store-picker/StorePicker';

export default function ChangeStoreScreen() {
   return <StorePicker mode="change" />;
}
