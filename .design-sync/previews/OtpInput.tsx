import { OtpInput } from 'starbucks';

/**
 * The six cells live on the wallet screen, after the background has turned deep
 * green and the scrim has dropped everything but the code out of focus. They
 * are white-on-transparent, so that surface has to come from the cell.
 */
const DEEP = '#003322';

const REF = { current: null };
const noop = () => {};

function Screen({ children }: { children: React.ReactNode }) {
   return (
      <div style={{ background: DEEP, padding: '48px 40px', width: 380 }}>{children}</div>
   );
}

/** Nothing typed yet. Idle borders at 26% white over a 9% fill. */
export function Empty() {
   return (
      <Screen>
         <OtpInput value="" onChange={noop} status="idle" inputRef={REF} />
      </Screen>
   );
}

/** Mid-entry. Nobody edits between the digits of a one-time code — six go in, it resolves. */
export function Partial() {
   return (
      <Screen>
         <OtpInput value="482" onChange={noop} status="idle" inputRef={REF} />
      </Screen>
   );
}

/** All six in, still unjudged: the frame between the last keystroke and the verdict. */
export function Complete() {
   return (
      <Screen>
         <OtpInput value="482913" onChange={noop} status="idle" inputRef={REF} />
      </Screen>
   );
}

/**
 * The row is centred and gapped at 8, so it keeps its own width whatever
 * column it lands in — here the flow's own 22pt gutters.
 *
 * `status="ok"` and `status="fail"` are deliberately absent: both are reached
 * only by running an animation (a 780ms staggered green sweep, and a 140ms red
 * wash with a decaying shake), and neither lands inside a static capture. See
 * `.design-sync/learnings/onboarding.md`.
 */
export function InTheGutter() {
   return (
      <div style={{ background: DEEP, padding: '48px 22px', width: 390 }}>
         <OtpInput value="4829" onChange={noop} status="idle" inputRef={REF} />
      </div>
   );
}
