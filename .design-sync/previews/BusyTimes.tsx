import { BusyTimes, Theme } from 'starbucks';

/** The white sheet the store detail is drawn on — where this card actually lives. */
const sheet = {
   width: 358,
   background: Theme.Surface.raised,
   padding: 16,
   display: 'flex',
   flexDirection: 'column',
} as const;

/**
 * The card as it ships: a deliberately empty chart.
 *
 * Mapbox documents `telemetry.activity_score` and has never once returned it,
 * so the card is built and left flat. The bars are uniform and low **on
 * purpose** — a varying row would read as real busyness at a glance, and a
 * busyness chart is the kind of fiction someone acts on by driving somewhere.
 * The note under it says out loud that the data is missing rather than absent.
 */
export function Default() {
   return (
      <div style={sheet}>
         <BusyTimes />
      </div>
   );
}

/**
 * The same card on the app's cream, rather than on the sheet's white.
 *
 * `Surface.sunken` has to keep reading as *recessed* against both, which is the
 * whole reason the card also carries a hairline border — on cream the fill
 * alone is only four hex points of separation.
 */
export function OnCream() {
   return (
      <div style={{ ...sheet, background: Theme.Surface.app }}>
         <BusyTimes />
      </div>
   );
}

/**
 * At the narrowest the sheet ever gets — a 320pt phone, less both gutters.
 *
 * Fourteen bars and five tick labels have to survive the squeeze without the
 * ticks colliding; the bars are `flex: 1` with a fixed 3pt gap so they take the
 * loss and the labels do not.
 */
export function Narrow() {
   return (
      <div style={{ ...sheet, width: 288 }}>
         <BusyTimes />
      </div>
   );
}
