/**
 * Busy times — the card the data does not exist for yet.
 *
 * Mapbox documents `telemetry.activity_score` as an hourly 0–100 array per
 * weekday, and it is the centrepiece of their own Places API marketing shot. It
 * has never once arrived: absent on Starbucks in Pune, absent on Starbucks in San
 * Francisco, absent on Whole Foods and Blue Bottle in San Francisco. Their blog
 * says "available for select venues across North America and Western Europe",
 * which on this account resolves to none of them.
 *
 * So the card is built and left empty, and that is a deliberate choice over the
 * two alternatives. Synthesising a plausible curve from `score.popularity` would
 * look exactly like the marketing shot and be fiction — and a busyness chart is
 * the kind of fiction someone acts on, by driving somewhere. Dropping the card
 * would lose the shape of the screen and quietly hide that the integration is
 * incomplete. An empty card is the only version that is both honest and finished.
 *
 * The bars are **uniform and low on purpose.** Varying their heights would read as
 * real data at a glance, which is the exact failure mode being avoided; a flat row
 * reads unmistakably as "nothing here yet".
 *
 * `<ActivityChart>` at the bottom of this file is the renderer that will draw the
 * real thing. It is written, unused, and takes the array shape Mapbox documents —
 * so enabling this is a matter of passing `details.telemetry?.activity_score` in,
 * not of building a chart.
 */

import { StyleSheet, Text, View } from 'react-native';

import { Glyph } from '@/components/chrome';
import { Border, Radius, Space, Surface, TextColor, TextStyles } from '@/theme';

/** Matches the reference's tick labels: 9, 12, 15, 18, 21. */
const TICKS = [9, 12, 15, 18, 21];
const BAR_COUNT = 14;
const EMPTY_BAR_HEIGHT = 6;
const CHART_HEIGHT = 92;

export function BusyTimes() {
   return (
      <View style={styles.card}>
         <View style={styles.head}>
            <Glyph id="article" size={17} color={TextColor.secondary} strokeWidth={1.7} />
            <Text style={styles.title}>Busy times</Text>
         </View>

         <View style={styles.chart}>
            <View style={styles.bars}>
               {Array.from({ length: BAR_COUNT }, (_, index) => (
                  <View key={index} style={styles.bar} />
               ))}
            </View>

            <View style={styles.ticks}>
               {TICKS.map((tick) => (
                  <Text key={tick} style={styles.tick}>
                     {tick}
                  </Text>
               ))}
            </View>
         </View>

         <Text style={styles.note}>
            Mapbox doesn&apos;t publish busyness for this store. The chart fills in
            automatically if it ever does.
         </Text>
      </View>
   );
}

/**
 * The real renderer, for when `telemetry.activity_score` starts arriving.
 *
 * Kept deliberately: it is the part that would otherwise have to be rebuilt from
 * scratch, and writing it now is what makes the claim above — that this is a data
 * gap and not a missing feature — actually true.
 *
 * `scores` is 24 integers, 0–100, for one weekday. `hour` highlights the current
 * bar the way the reference does.
 */
export function ActivityChart({
   scores,
   hour,
   from = 7,
   to = 23,
}: {
   scores: readonly number[];
   hour?: number;
   from?: number;
   to?: number;
}) {
   const window = scores.slice(from, to);
   const peak = Math.max(1, ...window);

   return (
      <View style={styles.chart}>
         <View style={styles.bars}>
            {window.map((score, index) => {
               const isNow = hour === from + index;
               return (
                  <View
                     key={from + index}
                     style={[
                        styles.bar,
                        {
                           // Floored so a zero hour is still a visible tick rather
                           // than a gap in the row.
                           height: Math.max(EMPTY_BAR_HEIGHT, (score / peak) * CHART_HEIGHT),
                        },
                        isNow && styles.barNow,
                     ]}
                  />
               );
            })}
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   card: {
      backgroundColor: Surface.sunken,
      borderRadius: Radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Border.hair,
      padding: Space.base,
      gap: Space.md,
   },
   head: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
   },
   title: {
      ...TextStyles.bodySmStrong,
      color: TextColor.primary,
   },
   chart: {
      gap: Space.sm,
   },
   bars: {
      height: CHART_HEIGHT,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 3,
   },
   bar: {
      flex: 1,
      height: EMPTY_BAR_HEIGHT,
      borderRadius: Radius.xs,
      backgroundColor: Border.hair,
   },
   barNow: {
      backgroundColor: Surface.inverse,
   },
   ticks: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: Space.xs,
   },
   tick: {
      ...TextStyles.micro,
      color: TextColor.tertiary,
   },
   note: {
      ...TextStyles.micro,
      color: TextColor.tertiary,
   },
});
