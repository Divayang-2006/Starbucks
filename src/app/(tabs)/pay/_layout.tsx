/**
 * Pay's stack.
 *
 * Native `Stack`, headers off — see `(home)/_layout.tsx` for the argument.
 *
 * What lands here: transaction history and add-money. The scanner does not — a
 * scan is a full-screen interruption that must cover the tab bar, so it is a
 * root-level modal like the cart.
 */

import { Stack } from 'expo-router';

export default function PayStack() {
   return <Stack screenOptions={{ headerShown: false }} />;
}
