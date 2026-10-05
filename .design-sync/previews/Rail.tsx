import {
   Button,
   Card,
   PlaceholderBlock,
   ProductCard,
   Rail,
   Section,
   Theme,
   Tile,
} from 'starbucks';

/**
 * A phone-width viewport. The rail's whole affordance is the peek of the next
 * card past the right edge, and that only reads at a real screen width — which
 * is also why `RailCard` widths are absolute rather than a fraction.
 */
const viewport = {
   width: 390,
   background: Theme.Surface.app,
   overflow: 'hidden',
} as const;

/**
 * The uniform rail, snapping.
 *
 * `snap` needs `itemWidth` to be honest: the interval is `itemWidth + gap`, and
 * a rail of mixed-width children snapped to a made-up interval fights the
 * finger. Products are uniform, so they snap.
 */
export function Snapped() {
   return (
      <div style={viewport}>
         <Rail snap itemWidth={Theme.RailCard.compact}>
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
               name="Black Palm Jaggery Latte"
               meta="SHORT · 237 ml · 197 kcal"
               price={393.75}
               veg
               width={Theme.RailCard.compact}
               onAdd={() => {}}
            />
         </Rail>
      </div>
   );
}

/**
 * The composition it is actually written for: a `Section` header that keeps the
 * gutter while the rail under it runs full-bleed.
 *
 * The title lines up with the first card and the last card runs off the edge —
 * that mismatch is deliberate, and it is why `Section` insets its content
 * separately from its header.
 */
export function InSection() {
   return (
      <div style={{ ...viewport, paddingTop: 8, paddingBottom: 8 }}>
         <Section title="Redeem your Stars" action="View all">
            <Rail snap itemWidth={Theme.RailCard.standard}>
               <Tile
                  width={Theme.RailCard.standard}
                  media={<PlaceholderBlock height={84} />}
                  title="Free Customization"
                  sub="Redeem this for 200★"
                  footer={
                     <Button label="Unlock Reward" variant="secondary" size="sm" full disabled />
                  }
               />
               <Tile
                  width={Theme.RailCard.standard}
                  media={<PlaceholderBlock height={84} />}
                  title="Handcrafted Drink"
                  sub="Redeem this for 300★"
                  footer={
                     <Button label="Unlock Reward" variant="secondary" size="sm" full disabled />
                  }
               />
            </Rail>
         </Section>
      </div>
   );
}

/**
 * A ragged rail, deliberately not snapping.
 *
 * Home's curation discs: the children are all the same width here but the
 * *labels* are not, and the rule the docs give is that a rail only snaps when
 * its cards are uniform. Category marks scroll freely.
 */
export function Ragged() {
   return (
      <div style={{ ...viewport, paddingTop: 8, paddingBottom: 8 }}>
         <Rail gap={Theme.Space.base}>
            {['New Launch', 'Best Seller', 'Drinks', 'Food', 'Merch', 'At Home Coffee'].map(
               (name) => (
                  <Tile
                     key={name}
                     width={112}
                     media={
                        <PlaceholderBlock
                           height={72}
                           radius={Theme.Radius.pill}
                           style={{ width: 72, alignSelf: 'center' }}
                        />
                     }
                     title={name}
                  />
               ),
            )}
         </Rail>
      </div>
   );
}

/**
 * `gutter={false}`, for a rail already inside a gutter or a card.
 *
 * The cards start flush with the card's own padding instead of being inset a
 * second time — a rail that gutters itself inside a padded parent reads as a
 * spacing bug.
 */
export function NoGutter() {
   return (
      <div style={{ ...viewport, padding: 16 }}>
         <Card>
            <Rail gutter={false} gap={Theme.Space.sm}>
               {(
                  [
                     ['order', 'Order'],
                     ['pay', 'Pay'],
                     ['gift', 'Gift'],
                     ['rewards', 'Rewards'],
                     ['scan', 'Scan'],
                  ] as const
               ).map(([id, label]) => (
                  <Button key={label} label={label} glyph={id} variant="secondary" size="sm" />
               ))}
            </Rail>
         </Card>
      </div>
   );
}
