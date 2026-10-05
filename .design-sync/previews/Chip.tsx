import { Chip, PlaceholderBlock, Theme, Tile } from 'starbucks';

const row = {
   display: 'flex',
   gap: 8,
   alignItems: 'center',
   flexWrap: 'wrap',
} as const;

/**
 * The chip doing its control job: a filter you can select.
 *
 * Selected fills with `Action.selected` — House Green, not the CTA green. The
 * distinction is the whole point: green-for-state, brighter green for
 * do-the-thing.
 */
export function Control() {
   return (
      <div style={row}>
         <Chip label="New Launch" selected onPress={() => {}} />
         <Chip label="Best Seller" onPress={() => {}} />
         <Chip label="Drinks" onPress={() => {}} />
         <Chip label="At Home Coffee" onPress={() => {}} />
      </div>
   );
}

/**
 * The chip doing its badge job: `size="sm"` plus a tone.
 *
 * A badge states a fact, so it takes no press handler and ignores `selected`.
 * Gold is the Stars family; success is the mint tint with House Green type,
 * because `Status.success` only reaches 4.3:1 on mint.
 */
export function Badges() {
   return (
      <div style={row}>
         <Chip label="★ Reward redeemed" tone="gold" size="sm" />
         <Chip label="150 Stars" tone="gold" size="sm" />
         <Chip label="Order placed" tone="success" size="sm" />
         <Chip label="Veg" tone="success" size="sm" />
      </div>
   );
}

/**
 * The two sizes side by side. `md` is `Sizes.chipHeight` (36) with a real tap
 * target and sentence-case label; `sm` hugs its caps label and has no border.
 */
export function Sizes() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
         <div style={row}>
            <Chip label="Takeaway" onPress={() => {}} />
            <Chip label="Delivery" selected onPress={() => {}} />
         </div>
         <div style={row}>
            <Chip label="Takeaway" size="sm" />
            <Chip label="Delivery" selected size="sm" />
         </div>
      </div>
   );
}

/**
 * Where a selected chip actually lands: Home's article rail passes one into
 * `Tile`'s `badge` slot as the category stamp over the artwork.
 */
export function InTile() {
   return (
      <div style={{ background: Theme.Surface.app, padding: 24, width: 340 }}>
         <Tile
            width={Theme.RailCard.feature}
            media={<PlaceholderBlock height={110} />}
            badge={<Chip label="Coffee Culture" selected />}
            title="What makes a Malabar bean taste like the coast"
            action="Learn More"
         />
      </div>
   );
}
