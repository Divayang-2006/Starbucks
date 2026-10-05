import { Stat, Theme } from 'starbucks';

/**
 * A cell is `flex: 1`, so it needs a row to divide up. On its own it wants a
 * width, which is what these wrappers supply.
 */
const cell = { width: 140, display: 'flex' as const };

/**
 * Value over label, never the other way round. The number is what the cell is
 * for; the caps line under it is a caption on that number. Reversing them makes
 * the cell read as a form field.
 */
export function Default() {
   return (
      <div style={cell}>
         <Stat label="Stars" value="1,250" />
      </div>
   );
}

/**
 * The three figures Home's band actually counts. Rupees and Indian digit
 * grouping both come from the formatters, so the cell never sees a raw number.
 */
export function Figures() {
   return (
      <div style={{ width: 380, display: 'flex', gap: Theme.Space.xl }}>
         <Stat label="Stars" value="1,250" />
         <Stat label="Rewards" value="3" />
         <Stat label="Pay" value="₹1,240.00" />
      </div>
   );
}

/**
 * The tone axis. `light` on the cream app background, `inverse` on House Green —
 * which is where the cell mostly lives, since the strip it belongs to sits
 * inside the header band.
 */
export function Tones() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
         <div
            style={{
               ...cell,
               backgroundColor: Theme.Surface.app,
               borderRadius: 12,
               padding: Theme.Space.base,
               width: 172,
            }}
         >
            <Stat label="Stars to Gold" value="750" />
         </div>
         <div
            style={{
               ...cell,
               backgroundColor: Theme.Surface.inverse,
               borderRadius: 12,
               padding: Theme.Space.base,
               width: 172,
            }}
         >
            <Stat tone="inverse" label="Stars to Gold" value="750" />
         </div>
      </div>
   );
}
