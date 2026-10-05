import { OnboardingFlow } from 'starbucks';

/**
 * The whole membership route, and the only screen in this system that owns its
 * own background, safe area and keyboard avoidance — which is why
 * `src/app/membership.tsx` deliberately does not wrap it in `Screen`.
 *
 * `onComplete` is its entire prop surface. Everything else — which question is
 * showing, which face is up, whether the card has dropped into the wallet — is
 * internal state driven by typing, so a still frame can only ever be step one:
 * cream screen, first question, card at -7deg, picker and CTA in the footer.
 */
const noop = () => {};

/** `root` is `flex: 1`, so the flow needs a device-sized box to fill. */
function Device({ width, height }: { width: number; height: number }) {
   return (
      <div
         style={{
            width,
            height,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(5,32,24,0.28)',
         }}
      >
         <OnboardingFlow onComplete={noop} />
      </div>
   );
}

/** Step one at handset size — the canonical frame this flow was tuned on. */
export function FirstQuestion() {
   return (
      <div style={{ background: '#DDD8CD', padding: 16 }}>
         <Device width={390} height={636} />
      </div>
   );
}

/**
 * The same step on a small handset. The card stage is the one band allowed to
 * give ground, and the footer is pinned with `marginTop: auto`, so the column
 * closes up from the middle rather than clipping the CTA.
 */
export function SmallScreen() {
   return (
      <div style={{ background: '#DDD8CD', padding: 16 }}>
         <Device width={320} height={568} />
      </div>
   );
}

/**
 * A large handset. The card stage and the 128pt question slot are both fixed,
 * so the extra width goes to the gutters and the extra height to the gap the
 * footer's `marginTop: auto` opens up above it.
 */
export function LargeScreen() {
   return (
      <div style={{ background: '#DDD8CD', padding: 16 }}>
         <Device width={430} height={636} />
      </div>
   );
}
