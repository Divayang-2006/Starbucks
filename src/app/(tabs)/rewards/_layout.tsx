/**
 * Rewards' stack.
 *
 * Native `Stack`, headers off — see `(home)/_layout.tsx` for the argument.
 *
 * What lands here: reward detail, the full Stars activity timeline, and the tier
 * explainer. Also the destination of the bottom accessory's tap, which is the
 * one route in the app reachable from every other tab without a header control.
 */

import { Stack } from 'expo-router';

export default function RewardsStack() {
   return <Stack screenOptions={{ headerShown: false }} />;
}
