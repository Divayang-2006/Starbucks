import {
   ActionBar,
   BottomChrome,
   Button,
   Gutter,
   ListRow,
   ListSection,
   PlaceholderBlock,
   PriceTag,
   ProductCard,
   Screen,
   ScreenHeader,
   Section,
   Sheet,
   Theme,
   Tile,
} from 'starbucks';

/**
 * A phone frame. `BottomChrome` only shows what it does at the bottom edge of
 * something screen-shaped.
 *
 * Note what a preview card cannot show: on device this reserves the safe-area
 * inset that already contains the native tab bar *and* the home indicator, and
 * re-lays out natively on the same frame the iOS 26 bar minimizes on. In a
 * browser those insets are zero, so what is visible here is the composition,
 * not the clearance.
 */
const phone = {
   width: 390,
   height: 520,
   display: 'flex',
   flexDirection: 'column',
   overflow: 'hidden',
   borderRadius: 20,
   border: `1px solid ${Theme.Border.hair}`,
} as const;

/**
 * The job it was written for: pinning an `ActionBar` to the floor of a screen
 * while content scrolls underneath it.
 *
 * The bar is opaque and the content runs under it — the bar is a floor, not a
 * card. `BottomChrome` is what puts it above the tab bar without a constant.
 */
export function PinnedBar() {
   return (
      <div style={{ ...phone, position: 'relative' }}>
         <div style={{ flex: 1, overflow: 'hidden', background: Theme.Surface.app }}>
            <ScreenHeader tone="inverse" sheetBelow kicker="Koregaon Park" title="Your order" />
            <Sheet>
               <ListSection kicker="3 items" title="Cart">
                  <ListRow
                     kickerStyle="micro"
                     kicker="TALL · 354 ml · 655 kcal"
                     title="Tiramisu Frappuccino"
                     trailing={<PriceTag amount={588} />}
                  />
                  <ListRow
                     kickerStyle="micro"
                     kicker="GRANDE · 473 ml · 462 kcal"
                     title="Tiramisu Cold Brew"
                     trailing={<PriceTag amount={488.25} />}
                  />
                  <ListRow
                     kickerStyle="micro"
                     kicker="SHORT · 237 ml · 197 kcal"
                     title="Black Palm Jaggery Latte"
                     trailing={<PriceTag amount={393.75} />}
                  />
               </ListSection>
            </Sheet>
         </div>

         <BottomChrome style={{ position: 'absolute', left: 0, right: 0, bottom: 0, flex: 0 }}>
            <ActionBar summary={<PriceTag amount={1470} size="lg" paise={false} />}>
               <Button label="Place order" variant="primary" />
            </ActionBar>
         </BottomChrome>
      </div>
   );
}

/**
 * The same thing done the easy way: `Screen`'s `footer` slot.
 *
 * `Screen` wraps the footer in `BottomChrome` itself, then measures it and ends
 * the scroll that much early. Wrapping a second time — or passing an
 * `ActionBar standalone` here — would inset the bottom twice.
 */
export function ScreenFooter() {
   return (
      <div style={phone}>
         <Screen
            tone="inverse"
            footer={<ActionBar><Button label="Add to Cart · ₹588.00" full /></ActionBar>}
         >
            <ScreenHeader tone="inverse" sheetBelow kicker="Handcrafted" title="Frappuccino" />
            <Sheet>
               <Gutter>
                  <Tile
                     media={<PlaceholderBlock label="Product photography" height={140} />}
                     title="Tiramisu Frappuccino"
                     sub="TALL · 354 ml · 655 kcal"
                  />
               </Gutter>
               <Section title="Goes well with" gutter>
                  <ProductCard
                     variant="row"
                     name="Malabar Coconut Flat White"
                     meta="SHORT · 237 ml · 257 kcal"
                     price={456.75}
                     veg
                     onAdd={() => {}}
                  />
               </Section>
            </Sheet>
         </Screen>
      </div>
   );
}

/**
 * Content that does not scroll.
 *
 * A gate screen ends in a stack of buttons rather than a bar; the wrapper is
 * still what keeps that stack off the home indicator, and it reserves the space
 * with a native view rather than a measured number, so nothing hops mid-gesture.
 */
export function StaticFooter() {
   return (
      <div style={{ ...phone, background: Theme.Surface.app }}>
         <div
            style={{
               flex: 1,
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'stretch',
               padding: 16,
            }}
         >
            <PlaceholderBlock label="Store map" height={320} radius={Theme.Radius.xl} />
         </div>
         <BottomChrome style={{ flexGrow: 0, flexShrink: 0 }}>
            <Gutter style={{ gap: 12, paddingBottom: 16 }}>
               <Button label="Use my location" glyph="pin" variant="primary" full />
               <Button label="Pick a store instead" variant="ghost" full />
            </Gutter>
         </BottomChrome>
      </div>
   );
}
