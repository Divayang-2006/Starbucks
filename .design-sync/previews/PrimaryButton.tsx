import { PrimaryButton } from 'starbucks';

const CREAM = '#F2F0EB';
const GREEN = '#006241';
const noop = () => {};

/** The flow's footer gutter is 22pt either side of a 390pt screen. */
const CTA_WIDTH = 346;

/**
 * `onCream` — the collection screen. The disabled fill is `Palette.disabled`
 * with ink at 38%, and the flip between the two is a 280ms colour fade rather
 * than a style swap, which is what makes the form feel answerable.
 */
export function OnCream() {
   return (
      <div
         style={{
            background: CREAM,
            padding: 32,
            width: CTA_WIDTH,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
         }}
      >
         <PrimaryButton label="CONTINUE" onPress={noop} />
         <PrimaryButton label="CONTINUE" onPress={noop} enabled={false} />
      </div>
   );
}

/**
 * `onGreen` — the welcome screen, after the background has turned. The fill
 * inverts to cream with ink type; disabled recesses to 22% white.
 */
export function OnGreen() {
   return (
      <div
         style={{
            background: GREEN,
            padding: 32,
            width: CTA_WIDTH,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
         }}
      >
         <PrimaryButton label="LET'S GO" onPress={noop} variant="onGreen" />
         <PrimaryButton label="LET'S GO" onPress={noop} variant="onGreen" enabled={false} />
      </div>
   );
}

/**
 * The three calls this flow actually makes. `CREATE MY CARD` is the last
 * question's label — the same button, relabelled, never a second component.
 */
export function FlowLabels() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
         <div
            style={{
               background: CREAM,
               padding: 32,
               width: CTA_WIDTH,
               display: 'flex',
               flexDirection: 'column',
               gap: 16,
            }}
         >
            <PrimaryButton label="CONTINUE" onPress={noop} />
            <PrimaryButton label="CREATE MY CARD" onPress={noop} />
         </div>
         <div style={{ background: GREEN, padding: 32, width: CTA_WIDTH }}>
            <PrimaryButton label="LET'S GO" onPress={noop} variant="onGreen" />
         </div>
      </div>
   );
}

/**
 * No intrinsic width: the pill is 50pt tall with a 25pt radius and takes
 * whatever its column gives it. The footer gives it the full gutter.
 */
export function Widths() {
   return (
      <div
         style={{
            background: CREAM,
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'flex-start',
         }}
      >
         <div style={{ width: CTA_WIDTH, display: 'flex', flexDirection: 'column' }}>
            <PrimaryButton label="CONTINUE" onPress={noop} />
         </div>
         <div style={{ width: 200, display: 'flex', flexDirection: 'column' }}>
            <PrimaryButton label="CONTINUE" onPress={noop} />
         </div>
      </div>
   );
}
