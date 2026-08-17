/**
 * Order's stack. The deepest of the five, and the reason the restructure had to
 * happen before any of the minor screens could be written.
 *
 * Native `Stack`, headers off — see `(home)/_layout.tsx` for the argument.
 *
 * What lands here: category listings and the PDP, with its customisation groups.
 * The cart does *not*: it has to cover the tab bar, so it is a root-level modal.
 * The rule is worth stating because the PDP's Add-to-Cart button makes the wrong
 * one look natural — a push would leave the bar visible under a screen that is
 * asking you to commit.
 */

import { Stack } from 'expo-router';

export default function OrderStack() {
   return <Stack screenOptions={{ headerShown: false }} />;
}
