import { ProgressDots } from 'starbucks';

/**
 * `field` is the animated field index — fractional while sliding between
 * questions — and `journey` is 0 while collecting, 1 once the card is in the
 * wallet. Both are shared values owned by `OnboardingFlow`; a preview pins
 * them, because every interesting state of this component is a resting one.
 */
const at = (v: number) =>
   ({
      value: v,
      get: () => v,
      set: () => {},
      addListener: () => {},
      removeListener: () => {},
      modify: () => {},
      _isReanimatedSharedValue: true,
   }) as never;

const COLLECTING = at(0);
const IN_WALLET = at(1);

const CREAM = '#F2F0EB';
const GREEN = '#006241';

/** The flow's header band: 40pt tall, 22pt gutters, dots centred. */
function Header({ bg, children }: { bg: string; children: React.ReactNode }) {
   return (
      <div style={{ background: bg, padding: 28 }}>
         <div
            style={{
               width: 346,
               height: 40,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
            }}
         >
            {children}
         </div>
      </div>
   );
}

/** Question one of three. The dot at the cursor stretches to 22pt; the rest sit at 6. */
export function FirstQuestion() {
   return (
      <Header bg={CREAM}>
         <ProgressDots field={at(0)} journey={COLLECTING} />
      </Header>
   );
}

/**
 * The three resting positions, stacked. There is no per-dot state — each dot
 * measures its own distance from `field` and reacts, so the count comes
 * straight off FIELDS.
 */
export function Sweep() {
   return (
      <div
         style={{
            background: CREAM,
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            alignItems: 'center',
            width: 346,
         }}
      >
         <ProgressDots field={at(0)} journey={COLLECTING} />
         <ProgressDots field={at(1)} journey={COLLECTING} />
         <ProgressDots field={at(2)} journey={COLLECTING} />
      </div>
   );
}

/**
 * `field` at 0.5 — the frame the slide actually spends its time in. Two dots
 * share the width and the opacity, which is why the row reads as one indicator
 * moving rather than two lights swapping.
 */
export function MidSlide() {
   return (
      <Header bg={CREAM}>
         <ProgressDots field={at(0.5)} journey={COLLECTING} />
      </Header>
   );
}

/**
 * `journey` at 1: the card is in the wallet, the screen has turned green, and
 * the dots have crossed from ink to white with it.
 */
export function InTheWallet() {
   return (
      <Header bg={GREEN}>
         <ProgressDots field={at(2)} journey={IN_WALLET} />
      </Header>
   );
}
