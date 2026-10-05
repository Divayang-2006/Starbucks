import {
   Button,
   Chip,
   PlaceholderBlock,
   PlaceholderRail,
   ProductCard,
   Theme,
   Tile,
} from 'starbucks';

/**
 * A phone-width viewport, so the peek of the next card is visible — that peek
 * is the affordance that says "this scrolls", and it only reads at a real
 * screen width.
 */
const viewport = {
   width: 390,
   background: Theme.Surface.app,
   paddingTop: 8,
   paddingBottom: 8,
   overflow: 'hidden',
} as const;

/**
 * The reward teasers from Home's "Redeem your Stars" — the rail this component
 * was named for, before it was doing duty for content that was not a
 * placeholder at all.
 *
 * `PlaceholderRail` is `Rail` with its defaults: one gutter, one gap, and the
 * vertical padding that stops a horizontal scroller clipping every card shadow.
 * New code should reach for `Rail`, which can also snap.
 */
export function Default() {
   return (
      <div style={viewport}>
         <PlaceholderRail>
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
         </PlaceholderRail>
      </div>
   );
}

/**
 * Products, at `RailCard.compact` — the densest rail, two and a bit to a
 * 375pt screen.
 */
export function Products() {
   return (
      <div style={viewport}>
         <PlaceholderRail>
            <ProductCard
               name="Tiramisu Frappuccino"
               meta="TALL · 354 ml · 655 kcal"
               price={588}
               veg
               width={Theme.RailCard.compact}
               onAdd={() => {}}
            />
            <ProductCard
               name="Iced Coconut Matcha"
               meta="TALL · 354 ml · 117 kcal"
               price={472.5}
               veg
               width={Theme.RailCard.compact}
               onAdd={() => {}}
            />
            <ProductCard
               name="Malabar Coconut Flat White"
               meta="SHORT · 237 ml · 257 kcal"
               price={456.75}
               veg
               width={Theme.RailCard.compact}
               onAdd={() => {}}
            />
         </PlaceholderRail>
      </div>
   );
}

/**
 * Articles, at `RailCard.feature` — an image head with a two-line title under
 * it, and a badge above the title.
 */
export function Articles() {
   return (
      <div style={viewport}>
         <PlaceholderRail>
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
         </PlaceholderRail>
      </div>
   );
}
