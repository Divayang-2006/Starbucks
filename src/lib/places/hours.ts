/**
 * Opening hours, from either of the two shapes Mapbox hands us.
 *
 * Search Box returns structured `open_hours.periods`; the Places API returns an
 * OSM-syntax string. Neither returns an `open_now` flag, so "Open now · Until
 * 11:00 pm" is computed here.
 *
 * **Timezone caveat, stated because it is a real limitation.** Mapbox gives wall
 * -clock times with no zone, and no field anywhere in either response says which
 * zone the store is in. So these functions compare against the *device's* local
 * time. For an India-market app on a device in India that is correct; for a
 * Mumbai store viewed from London it will be nine and a half hours out. Fixing it
 * needs a timezone lookup the API does not provide — until then this is the
 * honest approximation, and it is why nothing in the UI presents open/closed as
 * more than a hint.
 */

import type { OpenPeriod } from './types';

export type OpenState = {
   isOpen: boolean;
   /** "Until 11:00 pm" when open, "Opens 7:00 am" when shut. */
   detail: string;
   /** Today's window, e.g. "7:00 am – 11:00 pm". Null when unknown. */
   todayRange: string | null;
   /**
    * Today's window in 24-hour `"HH:MM"`.
    *
    * Exists because `Store.opensAt` / `closesAt` are 24-hour strings — that is the
    * contract the seeded rows established and what `formatHours` in
    * `store-picker/geo.ts` parses. Writing an already-formatted `"11:00 pm"` into
    * those fields makes it emit `"11:00 pm pm"`, which is exactly what happened
    * before these two were added. Presentation strings belong in `detail` and
    * `todayRange`; these are the machine-readable pair.
    */
   opens24: string;
   closes24: string;
};

export const UNKNOWN_HOURS: OpenState = {
   isOpen: false,
   detail: 'Hours unavailable',
   todayRange: null,
   opens24: '',
   closes24: '',
};

/** `"0700"` → minutes since midnight. */
function toMinutes(hhmm: string): number | null {
   if (!/^\d{4}$/.test(hhmm)) return null;
   const h = Number(hhmm.slice(0, 2));
   const m = Number(hhmm.slice(2));
   if (h > 23 || m > 59) return null;
   return h * 60 + m;
}

/** Minutes since midnight → `"07:00"`. The machine-readable half. */
function hhmm(minutes: number): string {
   const total = ((minutes % 1440) + 1440) % 1440;
   return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/** Minutes since midnight → "7:00 am". Lowercase meridiem, per the reference app. */
function label(minutes: number): string {
   const total = ((minutes % 1440) + 1440) % 1440;
   const h24 = Math.floor(total / 60);
   const m = total % 60;
   const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
   return `${h12}:${String(m).padStart(2, '0')} ${h24 < 12 ? 'am' : 'pm'}`;
}

/**
 * Resolve a set of periods against a moment.
 *
 * `now` is injected rather than read from the clock so this is testable and so a
 * caller can render a specific day. Days are 0 = Sunday in both Mapbox's payload
 * and `Date.getDay()`, which is the one lucky coincidence in this file.
 */
export function openStateFromPeriods(periods: OpenPeriod[] | undefined, now: Date): OpenState {
   if (!periods?.length) return UNKNOWN_HOURS;

   const today = now.getDay();
   const minutesNow = now.getHours() * 60 + now.getMinutes();

   let todayRange: string | null = null;
   let opens24 = '';
   let closes24 = '';
   let nextOpen: number | null = null;

   for (const period of periods) {
      const from = toMinutes(period.open?.time ?? '');
      const to = toMinutes(period.close?.time ?? '');
      if (from === null || to === null) continue;

      // A close time at or before the open time means the period runs past
      // midnight, so its real end is on the following day.
      const overnight = to <= from;
      const endsAt = overnight ? to + 1440 : to;

      if (period.open.day === today) {
         todayRange = `${label(from)} – ${label(to)}`;
         opens24 = hhmm(from);
         closes24 = hhmm(to);
         if (minutesNow >= from && minutesNow < endsAt) {
            return { isOpen: true, detail: `Until ${label(to)}`, todayRange, opens24, closes24 };
         }
         if (minutesNow < from && (nextOpen === null || from < nextOpen)) nextOpen = from;
      }

      // Yesterday's overnight period can still be running right now.
      if (overnight && period.open.day === (today + 6) % 7 && minutesNow < to) {
         return {
            isOpen: true,
            detail: `Until ${label(to)}`,
            todayRange: todayRange ?? `${label(from)} – ${label(to)}`,
            opens24: opens24 || hhmm(from),
            closes24: closes24 || hhmm(to),
         };
      }
   }

   return {
      isOpen: false,
      detail: nextOpen === null ? 'Closed today' : `Opens ${label(nextOpen)}`,
      todayRange,
      opens24,
      closes24,
   };
}

const OSM_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

/**
 * Parse the Places API's OSM string into the same periods shape.
 *
 * Deliberately narrow. Real OSM syntax supports day ranges, `24/7`, `off`,
 * public holidays and comments; every Starbucks record observed used only the
 * plain `Day HH:MM-HH:MM` form, semicolon-separated. Anything it does not
 * recognise is skipped rather than guessed at, so an unusual store degrades to
 * "Hours unavailable" instead of to a wrong answer.
 */
export function periodsFromOsm(spec: string | undefined): OpenPeriod[] | undefined {
   if (!spec) return undefined;

   const periods: OpenPeriod[] = [];
   for (const chunk of spec.split(';')) {
      const match = chunk.trim().match(/^([A-Za-z]{2})\s+(\d{2}):(\d{2})-(\d{2}):(\d{2})$/);
      if (!match) continue;

      const day = OSM_DAYS.findIndex((d) => d.toLowerCase() === match[1].toLowerCase());
      if (day < 0) continue;

      const close = `${match[4]}${match[5]}`;
      // An overnight window belongs to the next day in Mapbox's own shape, and
      // `openStateFromPeriods` reads `close.day` to detect the wrap.
      const closeDay = Number(match[4]) * 60 + Number(match[5]) <= Number(match[2]) * 60 + Number(match[3])
         ? (day + 1) % 7
         : day;

      periods.push({
         open: { day, time: `${match[2]}${match[3]}` },
         close: { day: closeDay, time: close },
      });
   }

   return periods.length ? periods : undefined;
}

/** Mon-first, for the expandable week list. */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

export const DAY_NAMES: Record<number, string> = {
   0: 'Sunday',
   1: 'Monday',
   2: 'Tuesday',
   3: 'Wednesday',
   4: 'Thursday',
   5: 'Friday',
   6: 'Saturday',
};

/** One line per day, for the hours expander. Days with no period read "Closed". */
export function weekRanges(periods: OpenPeriod[] | undefined) {
   return WEEK_ORDER.map((day) => {
      const period = periods?.find((p) => p.open?.day === day);
      const from = toMinutes(period?.open?.time ?? '');
      const to = toMinutes(period?.close?.time ?? '');
      return {
         day,
         name: DAY_NAMES[day],
         range: from === null || to === null ? 'Closed' : `${label(from)} – ${label(to)}`,
      };
   });
}
