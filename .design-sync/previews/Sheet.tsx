import {
   Balance,
   Button,
   Card,
   Field,
   Gutter,
   ListRow,
   ListSection,
   PlaceholderBlock,
   ProductCard,
   Rail,
   ScreenHeader,
   Section,
   Sheet,
   Theme,
   Tile,
} from 'starbucks';

const phone = {
   width: 390,
   overflow: 'hidden',
   background: Theme.Surface.app,
} as const;

/**
 * The motif: a cream sheet riding up over the green header band.
 *
 * The sheet's negative top margin equals its corner radius, so the curve lands
 * fully inside the green and the two surfaces read as one passing behind the
 * other. `ScreenHeader sheetBelow` grows its bottom padding by the same
 * constant, which is why the title never ends up under the curve.
 */
export function OverHeader() {
   return (
      <div style={phone}>
         <ScreenHeader tone="inverse" sheetBelow kicker="Starbucks Pay" title="Pay" />

         <Sheet>
            <Gutter>
               <Card style={{ backgroundColor: Theme.Surface.inverse, padding: 20 }}>
                  <Balance kicker="Balance" value="₹0.00" tone="inverse" />
               </Card>
            </Gutter>

            <ListSection title="Other Payment Modes" action="Manage">
               <ListRow title="UPI" onPress={() => {}} />
               <ListRow title="Credit / Debit Card" onPress={() => {}} />
               <ListRow title="Net Banking" onPress={() => {}} />
            </ListSection>
         </Sheet>
      </div>
   );
}

/**
 * `SHEET_GAP` — 32pt between direct children, and why.
 *
 * Five screens wrote this rule out by hand and one of them said 20. A boundary
 * inside a sheet is usually a *subject* change (rewards → promos → the menu),
 * and 20pt reads as "these two things are related" where 32 reads as "these are
 * two things".
 */
export function Rhythm() {
   return (
      <div style={{ ...phone, paddingTop: 28 }}>
         <Sheet>
            <Section title="Redeem your Stars" action="View all">
               <Rail snap itemWidth={Theme.RailCard.standard}>
                  <Tile
                     width={Theme.RailCard.standard}
                     media={<PlaceholderBlock height={56} />}
                     title="Free Customization"
                     sub="Redeem this for 200★"
                  />
                  <Tile
                     width={Theme.RailCard.standard}
                     media={<PlaceholderBlock height={56} />}
                     title="Handcrafted Drink"
                     sub="Redeem this for 300★"
                  />
               </Rail>
            </Section>

            <ListSection title="Other Payment Modes" action="Manage">
               <ListRow title="UPI" onPress={() => {}} />
               <ListRow title="Credit / Debit Card" onPress={() => {}} />
            </ListSection>

            <Section title="Recent Transactions" gutter>
               <PlaceholderBlock
                  label="No transactions yet"
                  height={72}
                  radius={Theme.Radius.xl}
               />
            </Section>
         </Sheet>
      </div>
   );
}

/**
 * `gap` overridden to `Space.lg`, the denser rhythm a menu wants.
 *
 * Order's sections are one subject — the catalogue — split into shelves, and
 * that is the case where 20pt is arguably right. A screen that wants it passes
 * `gap` rather than restating the whole rule in its own StyleSheet.
 */
export function TightGap() {
   return (
      <div style={{ ...phone, paddingTop: 28 }}>
         <Sheet gap={Theme.Space.lg}>
            <Section kicker="New Launch" title="Just arrived" gutter>
               <ProductCard
                  variant="row"
                  name="Tiramisu Cold Brew"
                  meta="GRANDE · 473 ml · 462 kcal"
                  price={488.25}
                  veg
                  onAdd={() => {}}
               />
            </Section>
            <Section kicker="Best Seller" title="Always on the board" gutter>
               <ProductCard
                  variant="row"
                  name="Malabar Coconut Flat White"
                  meta="SHORT · 237 ml · 257 kcal"
                  price={456.75}
                  veg
                  onAdd={() => {}}
               />
            </Section>
            <Section kicker="Power Picks" title="Under 150 kcal" gutter>
               <ProductCard
                  variant="row"
                  name="Iced Coconut Matcha"
                  meta="TALL · 354 ml · 117 kcal"
                  price={472.5}
                  veg
                  onAdd={() => {}}
               />
            </Section>
         </Sheet>
      </div>
   );
}

/**
 * The literal white sheet, for a form screen.
 *
 * The default is cream, not white, because every tab screen fills the sheet
 * with white cards and white-on-white would need an outline on each one.
 * Personal Information has no cards, so it passes the background it wants.
 */
export function Form() {
   return (
      <div style={phone}>
         <ScreenHeader tone="inverse" sheetBelow kicker="Account" title="Personal Information" />

         <Sheet style={{ backgroundColor: Theme.Surface.raised }} gap={Theme.Space.xl}>
            <Gutter style={{ gap: 24 }}>
               <Field label="FIRST NAME" value="Divayang" />
               <Field label="LAST NAME" value="Malseda" />
               <Field label="MOBILE NUMBER" value="98765 43210" hint="We'll text a code to confirm." />
               <Field label="EMAIL" placeholder="you@example.com" />
               <Field label="MEMBER ID" value="SB-4471-0092" editable={false} hint="Issued when you joined." />
            </Gutter>

            <Gutter>
               <Button label="Save changes" full />
            </Gutter>
         </Sheet>
      </div>
   );
}
