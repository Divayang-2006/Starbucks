import { ActivityChart, Card, Theme } from 'starbucks';

/**
 * The shape Mapbox documents for `telemetry.activity_score`: 24 integers,
 * 0–100, indexed by hour, for one weekday.
 *
 * A Koregaon Park Tuesday — the 8am commute, a lunch peak at 1, the long
 * afternoon lull that every Indian café has, and the 6–8pm evening rush that is
 * the real peak.
 */
const TUESDAY = [
   0, 0, 0, 0, 0, 0, 0, 8, 26, 41, 52, 58, 64, 78, 66, 49, 44, 57, 82, 91, 74, 55, 33, 14,
];

/** Saturday: no commute spike, a broad plateau from noon, a later peak. */
const SATURDAY = [
   0, 0, 0, 0, 0, 0, 0, 4, 12, 24, 43, 61, 72, 76, 79, 81, 77, 80, 88, 100, 93, 78, 52, 26,
];

const sheet = {
   width: 358,
   background: Theme.Surface.app,
   padding: 16,
   display: 'flex',
   flexDirection: 'column',
} as const;

/**
 * The renderer `BusyTimes` is waiting on, fed the data it was written for.
 *
 * `hour` highlights the bar you are standing in — House Green against the
 * hairline cream of every other bar, so "now" is a fill change rather than a
 * marker floating above the row. Here it is 1pm, which happens to be the lunch
 * peak.
 */
export function Weekday() {
   return (
      <div style={sheet}>
         <Card>
            <ActivityChart scores={TUESDAY} hour={13} />
         </Card>
      </div>
   );
}

/**
 * A different day, same component — the variant axis is the data.
 *
 * Bars are scaled against the window's own peak rather than a fixed 100, so a
 * quiet store still fills the frame and the curve stays readable. Saturday's
 * 7pm hits 100 and sets the ceiling for the rest.
 */
export function Saturday() {
   return (
      <div style={sheet}>
         <Card>
            <ActivityChart scores={SATURDAY} hour={19} />
         </Card>
      </div>
   );
}

/**
 * `from` / `to` — the window, narrowed to the store's real hours.
 *
 * Koregaon Park opens at 08:00 and closes at 23:00, so drawing the default
 * 7–23 window spends a bar on an hour the store is shut. Above is the default,
 * below is the same day clipped to 8–23.
 */
export function OpeningHoursWindow() {
   return (
      <div style={{ ...sheet, gap: 12 }}>
         <Card>
            <ActivityChart scores={TUESDAY} hour={18} />
         </Card>
         <Card>
            <ActivityChart scores={TUESDAY} hour={18} from={8} to={23} />
         </Card>
      </div>
   );
}

/**
 * The zero floor, which is the detail that keeps the row from looking broken.
 *
 * Widened to 5–23 so the three shut hours are in frame. A score of 0 still
 * draws a 6pt tick rather than a gap — an empty column reads as missing data,
 * and the whole point of this chart is that missing and zero are different
 * claims. 6am is `hour`, so the highlight lands on one of them.
 */
export function ZeroHours() {
   return (
      <div style={sheet}>
         <Card>
            <ActivityChart scores={TUESDAY} hour={6} from={5} to={23} />
         </Card>
      </div>
   );
}
