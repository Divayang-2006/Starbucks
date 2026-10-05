import { Card, Divider, StoreRow, Theme } from 'starbucks';

/**
 * Which shop — the block the whole ordering flow hangs off.
 *
 * This is Home's header band verbatim: the default `inverse` tone on House
 * Green, the default "Collecting from" lead-in, the store name in the screen's
 * one serif moment, and "Change" as a text action. The meta reads "ready in 6
 * mins" rather than a bare `6 mins`, because a number next to a locality reads
 * as a distance or a closing time.
 */
export function Default() {
   return (
      <div
         style={{
            width: 380,
            padding: 20,
            borderRadius: Theme.Radius.xl,
            background: Theme.Surface.inverse,
         }}
      >
         <StoreRow name="Koregaon Park" area="North Main Road" etaMins={6} onChange={() => {}} />
      </div>
   );
}

/**
 * `tone="light"` on a card — the confirm sheet after you pick a store off the
 * map. Same row, cream palette, and the serif still lands on the name because
 * this is the one store on screen rather than one of twelve.
 */
export function Light() {
   return (
      <div style={{ width: 380 }}>
         <Card>
            <StoreRow
               tone="light"
               kicker="Ordering from"
               name="Phoenix Marketcity"
               area="Viman Nagar"
               etaMins={12}
               distanceKm={4.8}
               onChange={() => {}}
            />
         </Card>
      </div>
   );
}

/**
 * The meta line is built as a list and joined, so an absent field leaves no
 * orphan separator. Nearest fact first: where it is, then whether it is open,
 * then when your order is ready, then how far — the last of which only matters
 * once the first three have been read.
 *
 * The last row passes `kicker=""`, which is how Order suppresses the lead-in
 * when the header band above already says "Ordering from".
 */
export function Meta() {
   return (
      <div
         style={{
            width: 380,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            padding: 20,
            borderRadius: Theme.Radius.xl,
            background: Theme.Surface.inverse,
         }}
      >
         <StoreRow name="Khan Market" />
         <StoreRow name="Khan Market" area="Rabindra Nagar" />
         <StoreRow name="Khan Market" area="Rabindra Nagar" etaMins={5} />
         <StoreRow name="Khan Market" area="Rabindra Nagar" etaMins={5} distanceKm={1178.9} />
         <StoreRow kicker="" name="Select Citywalk" area="Saket District Centre" isOpen={false} etaMins={15} />
      </div>
   );
}

/**
 * `display={false}` inside a list of stores. The serif budget is one store name
 * per screen — spent five times over in a picker it stops being an accent — so
 * the name drops to `bodyStrong` and `city` comes on, because a list that spans
 * cities is exactly when "Fort" alone stops locating anything.
 */
export function InList() {
   return (
      <div style={{ width: 380 }}>
         <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               <StoreRow
                  tone="light"
                  display={false}
                  kicker=""
                  name="Koregaon Park"
                  area="North Main Road"
                  city="Pune"
                  etaMins={6}
                  distanceKm={1.2}
               />
               <Divider />
               <StoreRow
                  tone="light"
                  display={false}
                  kicker=""
                  name="Horniman Circle"
                  area="Fort"
                  city="Mumbai"
                  etaMins={14}
                  distanceKm={118.6}
               />
               <Divider />
               <StoreRow
                  tone="light"
                  display={false}
                  kicker=""
                  name="Select Citywalk"
                  area="Saket District Centre"
                  city="New Delhi"
                  isOpen={false}
                  distanceKm={1174.6}
               />
            </div>
         </Card>
      </div>
   );
}

/**
 * No store yet. Home and Order share these two strings so the pair cannot
 * disagree again — the row keeps its shape, the meta line simply has nothing to
 * join, and "Change" is still the way out.
 */
export function NoStore() {
   return (
      <div
         style={{
            width: 380,
            padding: 20,
            borderRadius: Theme.Radius.xl,
            background: Theme.Surface.inverse,
         }}
      >
         <StoreRow kicker="No store yet" name="Pick a store to start" onChange={() => {}} />
      </div>
   );
}

/**
 * A long name truncates rather than wrapping or pushing "Change" off the edge:
 * the text column shrinks, the action does not. Both lines are capped at one
 * line, so this row is the same height as every other one.
 */
export function LongName() {
   return (
      <div
         style={{
            width: 300,
            padding: 20,
            borderRadius: Theme.Radius.xl,
            background: Theme.Surface.inverse,
         }}
      >
         <StoreRow
            name="Koramangala 5th Block"
            area="80 Feet Road"
            etaMins={11}
            onChange={() => {}}
         />
      </div>
   );
}
