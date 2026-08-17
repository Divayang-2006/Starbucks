/**
 * Membership — gate two. "Are you a member?" answered by becoming one.
 *
 * There is no separate login screen and no sign-up/sign-in fork, because the
 * card *is* the account: you fill the card in, the OTP claims it, and you are a
 * member. A returning user never reaches this route at all — the router's guard
 * in `_layout.tsx` skips straight past it.
 *
 * The flow itself lives in `@/components/onboarding` and is deliberately
 * self-contained; this file is only the seam between it and the session.
 *
 * **It does not use `Screen`, and that was checked rather than overlooked.**
 * `Screen` earns its place by owning a background, a scroll container and the
 * status bar for a screen that has none of its own. `OnboardingFlow` has all
 * three: it paints a full-bleed background that *animates* from cream to House
 * Green as the card drops into the wallet, it does not scroll, and it manages
 * its own safe area and keyboard avoidance. Wrapping it would add an invisible
 * cream layer under an opaque animated one and a `scroll={false}` that exists
 * only to be turned off — a shared root that owns nothing is worse than no
 * shared root, because the next reader has to prove it is inert.
 *
 * The `StatusBar` stays here for the same reason it would have moved: it is the
 * one thing on this route nobody else declares.
 */

import { StatusBar } from 'expo-status-bar';

import { OnboardingFlow, type MembershipResult } from '@/components/onboarding/OnboardingFlow';
import { useSession } from '@/lib/session';

/**
 * The flow asks for one name because a card face has room for one line. Split
 * on the last space so "Divayang Malseda" and "Ana Maria Santos Silva" both put
 * something sensible in each half, and a single word keeps the surname empty
 * rather than duplicating.
 */
function splitName(full: string) {
   const parts = full.split(/\s+/).filter(Boolean);
   if (parts.length < 2) return { firstName: parts[0] ?? '', lastName: '' };
   return {
      firstName: parts.slice(0, -1).join(' '),
      lastName: parts[parts.length - 1],
   };
}

export default function MembershipScreen() {
   const { joinMembership } = useSession();

   const handleComplete = ({ name, phone, styleId }: MembershipResult) => {
      joinMembership({
         ...splitName(name),
         phone,
         cardStyleId: styleId,
         // A new member starts empty. The Rewards screen is built to show a zero
         // balance honestly rather than seeded with stars nobody earned.
         stars: 0,
         tier: 'green',
      });
   };

   return (
      <>
         <StatusBar style="dark" />
         <OnboardingFlow onComplete={handleComplete} />
      </>
   );
}
