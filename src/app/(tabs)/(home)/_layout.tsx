/**
 * Home's stack. A group, not a segment, so this tab still answers `/`.
 *
 * `Stack` from `expo-router` is already the native one — never
 * `expo-router/js-stack`, and never `@react-navigation/*`, which SDK 56 dropped
 * as a dependency altogether.
 *
 * `headerShown: false` throughout: every screen draws its own `ScreenHeader`
 * band and that band owns the status bar. A native header on top of one would be
 * two headers.
 *
 * What lands here: the store switcher and whatever Home's modules push into
 * — an article reader, a curation listing. Anything that should cover the tab
 * bar (the cart, the scanner, the Account stack) belongs to the root Stack as a
 * modal instead, not to this one.
 */

import { Stack } from 'expo-router';

export default function HomeStack() {
   return <Stack screenOptions={{ headerShown: false }} />;
}
