import { Balance, Card, ProgressTrack, Theme } from 'starbucks';

/**
 * A bar that fills. Generic on purpose — the tier gauge and an order's "we're
 * making it" are the same object underneath.
 *
 * 640 of the 1,000 Stars that Gold needs. It stretches to its container, so it
 * is shown at a card's width; `label` is what a screen reader announces, since
 * the bar itself says nothing out loud.
 */
export function Default() {
   return (
      <div style={{ width: 380, display: 'flex', flexDirection: 'column' }}>
         <ProgressTrack value={0.64} label="Progress to Gold tier" />
      </div>
   );
}

/**
 * The whole range, plus the reason `value` is clamped: a caller computing
 * `stars / threshold` hands this `1.4` the first time somebody overshoots a
 * milestone, and the last two bars have to be identical. An unclamped fill
 * wider than its own track is a bug you find in a screenshot.
 */
export function ValueSweep() {
   return (
      <div style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 16 }}>
         <ProgressTrack value={0} label="0 Stars" />
         <ProgressTrack value={0.25} label="250 Stars" />
         <ProgressTrack value={0.5} label="500 Stars" />
         <ProgressTrack value={0.75} label="750 Stars" />
         <ProgressTrack value={1} label="1,000 Stars — Gold reached" />
         <ProgressTrack value={1.4} label="Overshot, clamped to full" />
      </div>
   );
}

/**
 * `height` — 8 is `Sizes.trackHeight` and the default. A hairline 4 for a bar
 * riding under a list row, a 12 for an order tracker that is the subject of its
 * own card. The pill radius holds at every height.
 */
export function Heights() {
   return (
      <div style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 16 }}>
         <ProgressTrack value={0.64} height={4} label="Compact" />
         <ProgressTrack value={0.64} label="Default" />
         <ProgressTrack value={0.64} height={12} label="Order progress" />
      </div>
   );
}

/**
 * `tone="inverse"` swaps the empty track from `Surface.tint` to `Border.hairOnDark`
 * — on House Green the mint track is louder than the fill it is supposed to sit
 * behind. The fill colour is unchanged, which is the point of the split.
 */
export function Inverse() {
   return (
      <div
         style={{
            width: 380,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: 20,
            borderRadius: Theme.Radius.xl,
            background: Theme.Surface.inverse,
         }}
      >
         <ProgressTrack value={0.64} tone="inverse" label="Progress to Gold tier" />
         <ProgressTrack value={0.64} tone="inverse" color={Theme.Tier.gold} label="Gold" />
      </div>
   );
}

/**
 * The tier gauge, which is what the `color` escape hatch exists for: a Gold
 * gauge fills in `Tier.gold`, not `Action.primary`. Still a token at the call
 * site — the prop takes a colour, the caller does not invent one.
 */
export function TierGauge() {
   return (
      <div style={{ width: 320 }}>
         <Card>
            <Balance kicker="Balance" value="640" unit="Stars" align="center" />
            <div style={{ marginTop: Theme.Space.lg, display: 'flex', flexDirection: 'column' }}>
               <ProgressTrack value={0.64} color={Theme.Tier.gold} label="Progress to Gold tier" />
            </div>
         </Card>
      </div>
   );
}

/**
 * The three tiers side by side, so the fill reads as the tier rather than as
 * "progress". Green is where a new member starts, Gold is 1,000 Stars in a
 * rolling year, Reserve carries its metallic accent.
 */
export function TierColours() {
   return (
      <div style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 16 }}>
         <ProgressTrack value={0.2} color={Theme.Tier.green} height={12} label="Green tier" />
         <ProgressTrack value={0.64} color={Theme.Tier.gold} height={12} label="Gold tier" />
         <ProgressTrack value={0.9} color={Theme.Tier.reserveMetal} height={12} label="Reserve tier" />
      </div>
   );
}
