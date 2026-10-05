import { Button, ChipRow, Gutter, ListRow, PlaceholderBlock, Theme } from 'starbucks';

/**
 * `Gutter` is the screen's horizontal inset, so it only reads against a screen
 * edge. Every cell is a phone-width sheet on cream.
 */
const phone = {
   width: 390,
   boxSizing: 'border-box',
   background: Theme.Surface.app,
   paddingTop: 20,
   paddingBottom: 20,
   display: 'flex',
   flexDirection: 'column',
   gap: 16,
} as const;

/**
 * The inset itself: `Gutter` is `paddingHorizontal: Gutter` (16) and nothing
 * else. The full-bleed block above is the same component with no wrapper, so
 * the difference between the two is exactly what this component adds.
 */
export function Default() {
   return (
      <div style={phone}>
         <PlaceholderBlock label="Full bleed · no Gutter" height={64} />
         <Gutter>
            <PlaceholderBlock label="Inside a Gutter" height={64} />
         </Gutter>
      </div>
   );
}

/**
 * Why it is a component and not a style prop: screens alternate.
 *
 * A chip row and a rail must run off the edge; the card between them must not.
 * A wrapper reads that alternation better than a `gutter` flag on every other
 * child.
 */
export function Alternating() {
   return (
      <div style={phone}>
         <ChipRow items={['Featured', 'Anytime', 'Congratulations', 'Thank You']} selectedIndex={0} />
         <Gutter>
            <ListRow
               surface="card"
               title="Corporate Gifting"
               subtitle="Bulk cards for teams, clients and campaigns."
               chevron
            />
         </Gutter>
      </div>
   );
}

/**
 * `style` lands on the gutter itself, which is how a pair of equal-share
 * actions gets laid out without a second wrapper — Pay's "Scan to pay" /
 * "Add money" row.
 */
export function RowOfActions() {
   return (
      <div style={phone}>
         <Gutter style={{ flexDirection: 'row', gap: Theme.Space.md }}>
            <Button label="Scan to pay" glyph="scan" style={{ flex: 1 }} />
            <Button label="Add money" glyph="plus" variant="secondary" style={{ flex: 1 }} />
         </Gutter>
      </div>
   );
}
