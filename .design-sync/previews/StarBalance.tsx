import { Card, ListRow, ProgressTrack, StarBalance, Theme } from 'starbucks';

/**
 * A gold star and a number — the app's currency, wherever it appears.
 *
 * Three sizes cover the four places that want it: `sm` in a strip or the tab
 * bar's accessory, `md` beside other content, `lg` as the subject of a screen.
 * The glyph tracks the cap height of the text next to it, not the font size, so
 * the star sits on the digits' baseline at every step.
 */
export function Sizes() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
         <StarBalance stars={180} size="sm" />
         <StarBalance stars={640} size="md" />
         <StarBalance stars={1250} size="lg" />
      </div>
   );
}

/**
 * `unit` appends "Stars" for the sites where the mark alone is ambiguous — a
 * bare number next to a star in a stats strip could be a rating. Off in the
 * accessory, where the width is not there to spend.
 */
export function WithUnit() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
         <StarBalance stars={180} size="sm" unit />
         <StarBalance stars={640} size="md" unit />
         <StarBalance stars={1250} size="lg" unit />
      </div>
   );
}

/**
 * On House Green — the Home header band and the session strip. The gold mark is
 * unchanged in both tones: gold on glass is nowhere near a text contrast ratio,
 * which is fine, because the mark is decoration and the balance beside it
 * carries the meaning.
 */
export function Inverse() {
   return (
      <div
         style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'flex-start',
            padding: 20,
            borderRadius: Theme.Radius.xl,
            background: Theme.Surface.inverse,
         }}
      >
         <StarBalance stars={180} size="sm" tone="inverse" />
         <StarBalance stars={640} size="md" tone="inverse" unit />
         <StarBalance stars={1250} size="lg" tone="inverse" unit />
      </div>
   );
}

/**
 * Indian grouping, which is the reason the number is not just interpolated.
 * A balance reaches four digits inside a year and `1250` stops reading as a
 * quantity; a lakh groups `1,20,400`, not `120,400`.
 */
export function Grouping() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
         <StarBalance stars={0} size="md" unit />
         <StarBalance stars={640} size="md" unit />
         <StarBalance stars={24850} size="md" unit />
         <StarBalance stars={120400} size="md" unit />
      </div>
   );
}

/**
 * `lg` as the subject: the Rewards hero, where the balance is what the screen is
 * about and the track under it says how far Gold still is.
 */
export function AsSubject() {
   return (
      <div style={{ width: 320 }}>
         <Card>
            <StarBalance stars={640} size="lg" unit />
            <div style={{ marginTop: Theme.Space.base, display: 'flex', flexDirection: 'column' }}>
               <ProgressTrack value={0.64} color={Theme.Tier.gold} label="Progress to Gold tier" />
            </div>
         </Card>
      </div>
   );
}

/**
 * `sm` in the trailing slot of a row — a milestone list, where the cost of each
 * reward is the thing being compared and the star mark is what makes the column
 * scan as one unit.
 */
export function InRow() {
   return (
      <div style={{ width: 380 }}>
         <Card>
            <ListRow
               inset={false}
               chevron={false}
               title="Free customisation"
               subtitle="An extra shot, a syrup, oat milk"
               trailing={<StarBalance stars={200} size="sm" />}
            />
            <ListRow
               inset={false}
               divided
               chevron={false}
               title="Handcrafted drink"
               subtitle="Any size, any customisation"
               trailing={<StarBalance stars={300} size="sm" />}
            />
            <ListRow
               inset={false}
               divided
               chevron={false}
               title="Whole bean coffee"
               subtitle="250 g bag, any roast"
               trailing={<StarBalance stars={600} size="sm" />}
            />
         </Card>
      </div>
   );
}
