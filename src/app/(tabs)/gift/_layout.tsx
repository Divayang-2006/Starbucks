/**
 * Gift's stack.
 *
 * Native `Stack`, headers off — see `(home)/_layout.tsx` for the argument, it is
 * the same one five times and is only written out once.
 *
 * What lands here: gift-card detail, and the amount / message / recipient steps
 * that follow it. Those are a browse-to-detail push, not a modal, which is
 * exactly why this tab needed a stack of its own.
 */

import { Stack } from 'expo-router';

export default function GiftStack() {
   return <Stack screenOptions={{ headerShown: false }} />;
}
