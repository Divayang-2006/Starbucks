import { MenuBackdrop, MenuPanel } from 'starbucks';

import { MENU_ITEMS } from '@/components/fluid-menu/items';

/** `progress` held at one point of the 0 → 1 travel. See `MenuRow`'s preview. */
const progressAt = (p: number) =>
   ({
      value: p,
      get: () => p,
      set: () => {},
      addListener: () => {},
      removeListener: () => {},
      modify: () => {},
   }) as never;

/**
 * `MenuBackdrop` is `absoluteFill`, so every cell gives it a positioned box the
 * size of the surface it is meant to cover.
 */
function Stage({
   width,
   height,
   children,
}: {
   width: number;
   height: number;
   children?: React.ReactNode;
}) {
   return (
      <div style={{ position: 'relative', width, height, overflow: 'hidden', display: 'flex' }}>
         <MenuBackdrop />
         {children}
      </div>
   );
}

/**
 * The field alone, at phone size.
 *
 * Flat House Green over this much area goes dead, so two gradients sit on top of
 * it: a radial bloom offset left and high — centred roughly where the Account
 * and Close controls land — and a linear deepening toward the bottom edge, so
 * the rows have something to sit on. The panel reads as lit from the top left,
 * which is also the corner the rows enter from.
 */
export function Field() {
   return <Stage width={390} height={600} />;
}

/**
 * What it is actually for: the same field with `MenuPanel` over it, open.
 *
 * The bloom sits under the two round controls and the top of the list; the floor
 * gradient carries the weight below the last row. Neither is animated — while
 * the menu is shut the app card covers all of this, so the reveal *is* the
 * animation.
 */
export function UnderThePanel() {
   return (
      <Stage width={390} height={600}>
         <MenuPanel
            items={MENU_ITEMS}
            progress={progressAt(1)}
            initials="DM"
            caption="Collecting from Koregaon Park"
            onSelect={() => {}}
            onProfile={() => {}}
            onClose={() => {}}
         />
      </Stage>
   );
}

/**
 * The bloom's radius is in viewport units, so it re-proportions with the box
 * rather than staying a circle. At a wide aspect it spills past the right edge
 * on purpose — a bloom whose edge lands on screen reads as a drawn circle
 * instead of light.
 */
export function WideAspect() {
   return <Stage width={720} height={320} />;
}
