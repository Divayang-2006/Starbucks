import { MenuBackdrop, MenuRow } from 'starbucks';

import { MENU_ITEMS } from '@/components/fluid-menu/items';

/**
 * `progress` pinned at one point of the 0 → 1 travel.
 *
 * A row's entrance is *derived* from progress rather than played back from it,
 * so a value that never moves is a real frame of the animation and not a mock
 * of one — it is exactly what the row sees when a finger stops mid-drag and
 * holds. Only `get()` is ever read while the value is still.
 */
const progressAt = (p: number) =>
   ({
      value: p,
      get: () => p,
      set: () => {},
      addListener: () => {},
      removeListener: () => {},
      modify: () => {},
   }) as never;

/** The account rows, minus the two groups that follow — those get their own cell. */
const ACCOUNT_ROWS = MENU_ITEMS.filter((item) => item.group === 1);

/**
 * The green field the rows are drawn on. `MenuRow` paints white-on-nothing, so
 * the real backdrop is the only honest place to read it.
 */
function Field({
   width = 380,
   height = 400,
   children,
}: {
   width?: number;
   height?: number;
   children: React.ReactNode;
}) {
   return (
      <div style={{ position: 'relative', width, height, overflow: 'hidden', display: 'flex' }}>
         <MenuBackdrop />
         <div
            style={{
               position: 'relative',
               flex: 1,
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center',
            }}
         >
            {children}
         </div>
      </div>
   );
}

/**
 * Arrived: `progress` at 1, every row at full opacity and no offset left.
 *
 * The six rows of the account group, in list order — `index` is the position in
 * the whole menu, not within the group, because the stagger is global.
 */
export function Settled() {
   const progress = progressAt(1);
   return (
      <Field>
         {ACCOUNT_ROWS.map((item, index) => (
            <MenuRow key={item.id} item={item} index={index} progress={progress} onPress={() => {}} />
         ))}
      </Field>
   );
}

/**
 * The same six rows with the drag stopped and held at 38% — the reason the
 * entrance is a function of `progress` and not a `withDelay` chain.
 *
 * Row 0 is most of the way in, row 5 has barely started, and each label trails
 * its own icon by a few points. Nothing here is a timeline: let go and every row
 * springs home together, reverse and the whole ramp runs backwards.
 */
export function HeldMidDrag() {
   const progress = progressAt(0.38);
   return (
      <Field>
         {ACCOUNT_ROWS.map((item, index) => (
            <MenuRow key={item.id} item={item} index={index} progress={progress} onPress={() => {}} />
         ))}
      </Field>
   );
}

/**
 * `destructive` swaps the row's tint for `Status.errorOnDark` — the one warm
 * red that survives House Green. Shown against the row above it, which is where
 * the difference is actually read.
 */
export function Destructive() {
   const progress = progressAt(1);
   const rows = MENU_ITEMS.filter((item) => item.group > 1);
   return (
      <Field height={200}>
         {rows.map((item) => (
            <MenuRow
               key={item.id}
               item={item}
               // The real position in the whole list — 6, 7, 8 — not 0, 1, 2.
               index={MENU_ITEMS.indexOf(item)}
               progress={progress}
               onPress={() => {}}
            />
         ))}
      </Field>
   );
}
