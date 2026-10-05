import {
   Button,
   Chip,
   Glyph,
   ListRow,
   PlaceholderBlock,
   ProductCard,
   Rail,
   Section,
   Theme,
   Tile,
} from 'starbucks';

const app = {
   width: 390,
   background: Theme.Surface.app,
   paddingTop: 16,
   paddingBottom: 16,
} as const;

/**
 * A titled block with a text action, and `gutter` on so the content is inset
 * with the header.
 *
 * Order's "Just arrived". `gap: Space.md` between a header and the thing it
 * labels, because those two are one object and want to sit closer than two
 * sections do.
 */
export function Titled() {
   return (
      <div style={app}>
         <Section kicker="New Launch" title="Just arrived" action="View all" gutter>
            <ProductCard
               variant="row"
               name="Tiramisu Frappuccino"
               meta="TALL · 354 ml · 655 kcal"
               price={588}
               veg
               onAdd={() => {}}
            />
            <ProductCard
               variant="row"
               name="Apricot Iced Shaken Espresso"
               meta="TALL · 354 ml · 140 kcal"
               price={414.75}
               veg
               onAdd={() => {}}
            />
            <ProductCard
               variant="row"
               name="Black Palm Jaggery Latte"
               meta="SHORT · 237 ml · 197 kcal"
               price={393.75}
               veg
               onAdd={() => {}}
            />
         </Section>
      </div>
   );
}

/**
 * `gutter={false}` (the default) with a full-bleed child.
 *
 * This is the alternation the component exists for: the header keeps the
 * gutter so the title lines up with the first card, while the rail underneath
 * runs off both edges. A `gutter` prop on the section's *content* is the only
 * way to have both.
 */
export function FullBleedRail() {
   return (
      <div style={{ ...app, overflow: 'hidden' }}>
         <Section title="Learn more about the World of Coffee" action="Discover More">
            <Rail snap itemWidth={Theme.RailCard.feature}>
               <Tile
                  width={Theme.RailCard.feature}
                  media={<PlaceholderBlock height={120} />}
                  badge={<Chip label="Coffee Culture" selected />}
                  title="The Art & Science of Coffee Brewing"
                  action="Learn More"
               />
               <Tile
                  width={Theme.RailCard.feature}
                  media={<PlaceholderBlock height={120} />}
                  badge={<Chip label="Sourcing" selected />}
                  title="Where Your Beans Come From"
                  action="Learn More"
               />
            </Rail>
         </Section>
      </div>
   );
}

/**
 * `kicker` above the title — a caps lead-in that names the *kind* of section,
 * where the title names this one.
 *
 * Rewards' milestone track: "MILESTONES" is the label, "What your Stars buy"
 * is the sentence.
 */
export function WithKicker() {
   return (
      <div style={{ ...app, overflow: 'hidden' }}>
         <Section kicker="Milestones" title="What your Stars buy">
            <Rail snap itemWidth={Theme.RailCard.standard}>
               <Tile
                  width={Theme.RailCard.standard}
                  media={<PlaceholderBlock height={84} />}
                  title="Free Customization"
                  sub="Redeem this for 200★"
                  footer={<Button label="Unlock Reward" variant="secondary" size="sm" full disabled />}
               />
               <Tile
                  width={Theme.RailCard.standard}
                  media={<PlaceholderBlock height={84} />}
                  title="Handcrafted Drink"
                  sub="Redeem this for 300★"
                  footer={<Button label="Unlock Reward" variant="secondary" size="sm" full disabled />}
               />
            </Rail>
         </Section>
      </div>
   );
}

/**
 * No title at all — the section is pure rhythm.
 *
 * Home's promo stack. Without a header the component is just the vertical gap
 * plus the gutter, which is still worth having: it is the rule that drifted to
 * three different values across six copy-pasted StyleSheets.
 */
export function Untitled() {
   return (
      <div style={app}>
         <Section gutter>
            <Tile
               media={<PlaceholderBlock label="Campaign artwork" height={120} />}
               title="Beverage Subscription"
               sub="One coffee a day, one price a month."
               action="Know More"
            />
            <Tile
               media={<PlaceholderBlock label="Campaign artwork" height={120} />}
               title="Dots Doodles × Starbucks"
               sub="Back to campus, in colour."
               action="Get Now"
            />
         </Section>
      </div>
   );
}

/**
 * `tone="inverse"` — the header on House Green.
 *
 * Only the header carries the tone; the section itself draws nothing, so the
 * surface underneath is whatever the caller put there.
 */
export function Inverse() {
   return (
      <div style={{ ...app, background: Theme.Surface.inverse }}>
         <Section tone="inverse" kicker="Nearby" title="Pick a store" action="See all" gutter>
            <div
               style={{
                  background: Theme.Surface.onDarkFill,
                  borderRadius: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
               }}
            >
               <ListRow
                  tone="inverse"
                  leading={<Glyph id="pin" size={22} color={Theme.TextColor.onDarkMuted} />}
                  title="Koregaon Park"
                  subtitle="North Main Road · 1.2 km · Ready in 6 min"
                  onPress={() => {}}
               />
               <ListRow
                  tone="inverse"
                  divided
                  leading={<Glyph id="pin" size={22} color={Theme.TextColor.onDarkMuted} />}
                  title="Phoenix Marketcity"
                  subtitle="Viman Nagar · 4.8 km · Ready in 12 min"
                  onPress={() => {}}
               />
            </div>
         </Section>
      </div>
   );
}
