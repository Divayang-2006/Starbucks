import {
   Button,
   Chip,
   EmptyState,
   Glyph,
   Gutter,
   ListRow,
   ListSection,
   PlaceholderBlock,
   ScreenHeader,
   ScreenScroll,
   Section,
   Sheet,
   Theme,
   Tile,
} from 'starbucks';

/**
 * A phone frame. `ScreenScroll` is the viewport itself (`flex: 1`), so it needs
 * a device-shaped box to be the viewport of.
 */
const phone = {
   width: 390,
   height: 540,
   display: 'flex',
   flexDirection: 'column',
   overflow: 'hidden',
   borderRadius: 20,
   border: `1px solid ${Theme.Border.hair}`,
} as const;

/**
 * The scroll container every tab screen uses, doing the one thing that is
 * invisible until it is wrong: the green header band keeps the status bar.
 *
 * The negative top `contentInset` is what buys that — iOS insets both ends of
 * an automatically-adjusted scroll view, and the top end belongs to
 * `ScreenHeader`, which paints behind the status bar and pads for it itself.
 */
export function Default() {
   return (
      <div style={phone}>
         <ScreenScroll>
            <ScreenHeader tone="inverse" sheetBelow kicker="Send a little something" title="Gift Cards" />

            <Sheet>
               <Section kicker="Featured" title="Cards to send today" gutter>
                  <Tile
                     media={<PlaceholderBlock height={104} />}
                     title="India Exclusive"
                     sub="Made here, for here."
                     action="Add Item"
                  />
                  <Tile
                     media={<PlaceholderBlock height={104} />}
                     title="U Keep Me Warm"
                     sub="For the person who does."
                     action="Add Item"
                  />
               </Section>
            </Sheet>
         </ScreenScroll>
      </div>
   );
}

/**
 * Content longer than the viewport, clipped at the bottom edge — which is what
 * a scroll view looks like when it is working.
 *
 * Note the absence at the end: this component adds no bottom padding of its
 * own. Air below content is the business of the surface the content sits on,
 * and every screen in the app ends its scroll with a `Sheet` that closes itself.
 */
export function LongContent() {
   return (
      <div style={phone}>
         <ScreenScroll>
            <ScreenHeader tone="inverse" sheetBelow kicker="Starbucks Pay" title="Pay" />

            <Sheet>
               <ListSection title="Other Payment Modes" action="Manage">
                  <ListRow title="UPI" onPress={() => {}} />
                  <ListRow title="Credit / Debit Card" onPress={() => {}} />
                  <ListRow title="Net Banking" onPress={() => {}} />
                  <ListRow title="Wallets" onPress={() => {}} />
               </ListSection>

               <ListSection title="Saved stores">
                  <ListRow
                     leading={<Glyph id="pin" size={22} color={Theme.TextColor.secondary} />}
                     title="Koregaon Park"
                     subtitle="North Main Road · Ready in 6 min"
                     onPress={() => {}}
                  />
                  <ListRow
                     leading={<Glyph id="pin" size={22} color={Theme.TextColor.secondary} />}
                     title="Phoenix Marketcity"
                     subtitle="Viman Nagar · Ready in 12 min"
                     trailing={<Chip label="Open" tone="success" size="sm" />}
                  />
                  <ListRow
                     leading={<Glyph id="pin" size={22} color={Theme.TextColor.secondary} />}
                     title="Wakad Highway"
                     subtitle="Mumbai–Bengaluru Expressway · Ready in 9 min"
                     onPress={() => {}}
                  />
               </ListSection>

               <Section title="Recent Transactions" gutter>
                  <PlaceholderBlock
                     label="No transactions yet · reloads and store payments appear here"
                     height={128}
                     radius={Theme.Radius.xl}
                  />
               </Section>
            </Sheet>
         </ScreenScroll>
      </div>
   );
}

/**
 * `contentContainerStyle` — the one hook a caller gets on the content itself.
 *
 * A short screen with nothing to scroll uses it to grow the content to the
 * viewport and centre it, rather than leaving an empty state pinned to the top.
 */
export function ContentStyle() {
   return (
      <div style={phone}>
         <ScreenScroll contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <Gutter>
               <EmptyState
                  glyph="order"
                  title="Nothing in your cart"
                  body="Add a drink from the menu and it will show up here."
                  action={<Button label="Browse the menu" variant="secondary" />}
               />
            </Gutter>
         </ScreenScroll>
      </div>
   );
}
