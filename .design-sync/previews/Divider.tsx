import { Divider, Glyph, ListRow, Stat, Theme } from 'starbucks';

/**
 * The default rule: `Border.hair` at `StyleSheet.hairlineWidth`, stretched to
 * its container. Deliberately quieter than `Border.strong`, which is a chip and
 * card *outline* — used as a separator it makes a list look like a table.
 */
export function Horizontal() {
   return (
      <div style={{ width: 420, background: Theme.Surface.raised }}>
         <ListRow title="UPI" chevron onPress={() => {}} />
         <Divider />
         <ListRow title="Credit / Debit Card" chevron onPress={() => {}} />
         <Divider />
         <ListRow title="Net Banking" chevron onPress={() => {}} />
      </div>
   );
}

/**
 * `inset` indents the rule from the leading edge so it starts under the text
 * rather than under the glyph — the standard treatment for a list whose rows
 * carry a leading mark.
 */
export function Inset() {
   const mark = (id: 'pin' | 'crown' | 'article') => (
      <Glyph id={id} size={Theme.IconSize.lg} color={Theme.TextColor.secondary} />
   );

   return (
      <div style={{ width: 420, background: Theme.Surface.raised }}>
         <ListRow leading={mark('pin')} title="Store Locator" chevron onPress={() => {}} />
         <Divider inset={54} />
         <ListRow leading={mark('crown')} title="Beverage Subscription" chevron onPress={() => {}} />
         <Divider inset={54} />
         <ListRow leading={mark('article')} title="Coffee Stories" chevron onPress={() => {}} />
      </div>
   );
}

/**
 * `orientation="vertical"` with a `length` — the rule between cells in a stat
 * strip. 34 is short of the cell height on purpose: a full-height rule turns
 * three figures into a table.
 */
export function Vertical() {
   return (
      <div
         style={{
            width: 420,
            background: Theme.Surface.app,
            padding: 20,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
         }}
      >
         <Stat label="Stars" value="248" />
         <div style={{ marginLeft: 12, marginRight: 12, display: 'flex' }}>
            <Divider orientation="vertical" length={34} />
         </div>
         <Stat label="Rewards" value="2" />
         <div style={{ marginLeft: 12, marginRight: 12, display: 'flex' }}>
            <Divider orientation="vertical" length={34} />
         </div>
         <Stat label="Pay" value="₹1,240" />
      </div>
   );
}

/**
 * `tone="inverse"` on House Green. The two tones are the only two — a hairline
 * is either `Border.hair` on light or `Border.hairOnDark` on green, and there
 * is no third.
 */
export function Inverse() {
   return (
      <div style={{ width: 420, background: Theme.Surface.inverse, paddingTop: 8, paddingBottom: 8 }}>
         <ListRow tone="inverse" title="Profile" chevron onPress={() => {}} />
         <Divider tone="inverse" />
         <ListRow tone="inverse" title="Help &amp; Support" chevron onPress={() => {}} />
         <Divider tone="inverse" />
         <ListRow tone="inverse" title="Log Out" destructive chevron={false} onPress={() => {}} />
      </div>
   );
}
