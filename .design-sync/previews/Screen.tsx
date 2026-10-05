import {
   ActionBar,
   AvatarButton,
   Button,
   Chip,
   EmptyState,
   Glyph,
   HeaderButton,
   Gutter,
   ListRow,
   ListSection,
   PlaceholderBlock,
   PriceTag,
   ProductCard,
   Rail,
   Screen,
   ScreenHeader,
   Section,
   Sheet,
   Stat,
   StatStrip,
   StoreRow,
   Theme,
   Tile,
} from 'starbucks';

/**
 * A phone frame. `Screen` is `flex: 1` — it fills whatever it is given — so a
 * preview has to give it a device-shaped box or there is nothing to fill.
 */
const phone = {
   width: 390,
   height: 560,
   display: 'flex',
   flexDirection: 'column',
   overflow: 'hidden',
   borderRadius: 20,
   border: `1px solid ${Theme.Border.hair}`,
} as const;

/**
 * The canonical screen: `tone="inverse"`, a green header band, and a cream
 * `Sheet` riding up over it.
 *
 * This is Home. Four of the five tabs start exactly like this, which is the
 * whole point of the component — before it, "a screen" was a convention each
 * file remembered separately, and the status bar was whatever the last mounted
 * screen left it as.
 */
export function Home() {
   return (
      <div style={phone}>
         <Screen tone="inverse">
            <ScreenHeader
               tone="inverse"
               sheetBelow
               title="Hi, Divayang"
               right={
                  <>
                     <HeaderButton label="Gift cards">
                        <Glyph id="gift" size={20} color={Theme.TextColor.onDark} />
                     </HeaderButton>
                     <AvatarButton initials="DM" onPress={() => {}} />
                  </>
               }
            >
               <StoreRow
                  name="Koregaon Park"
                  area="North Main Road"
                  etaMins={6}
                  onChange={() => {}}
                  style={{ marginTop: 12 }}
               />
               <StatStrip tone="inverse" style={{ marginTop: 20 }}>
                  <Stat label="Stars" value="240" />
                  <Stat label="Rewards" value="0" />
                  <Stat label="Pay" value="₹0.00" />
               </StatStrip>
            </ScreenHeader>

            <Sheet>
               <Section title="Recommended" action="View all">
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
                  </Rail>
               </Section>

               <Gutter>
                  <Tile
                     media={<PlaceholderBlock label="Campaign artwork" height={120} />}
                     title="Beverage Subscription"
                     sub="One coffee a day, one price a month."
                     action="Know More"
                  />
               </Gutter>
            </Sheet>
         </Screen>
      </div>
   );
}

/**
 * `footer` — a sticky `ActionBar` over the scroll.
 *
 * `Screen` renders it inside `BottomChrome`, so it clears the native tab bar
 * and the home indicator without anyone doing arithmetic, then measures it and
 * ends the scroll that much early so the last row is never permanently hidden.
 */
export function WithFooter() {
   return (
      <div style={phone}>
         <Screen
            tone="inverse"
            footer={
               <ActionBar summary={<PriceTag amount={1470} size="lg" paise={false} />}>
                  <Button label="Place order" variant="primary" />
               </ActionBar>
            }
         >
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
         </Screen>
      </div>
   );
}

/**
 * `tone="light"` — no green band, so the status bar goes dark.
 *
 * `tone` is a statement about what sits under the clock, not a theme: the app
 * is light-only, and the body of an `inverse` screen is the same cream as this
 * one.
 */
export function Light() {
   return (
      <div style={phone}>
         <Screen>
            <ScreenHeader kicker="Account" title="Settings" />

            <ListSection title="Preferences">
               <ListRow
                  leading={<Glyph id="pin" size={22} color={Theme.TextColor.secondary} />}
                  title="Default store"
                  subtitle="Koregaon Park, Pune"
                  onPress={() => {}}
               />
               <ListRow
                  leading={<Glyph id="heart" size={22} color={Theme.TextColor.secondary} />}
                  title="Favourites"
                  trailing={<Chip label="7 saved" size="sm" />}
               />
               <ListRow
                  leading={<Glyph id="article" size={22} color={Theme.TextColor.secondary} />}
                  title="Nutrition preferences"
                  subtitle="Show kcal on the menu"
                  onPress={() => {}}
               />
            </ListSection>
         </Screen>
      </div>
   );
}

/**
 * `scroll={false}` — a screen that manages its own layout.
 *
 * Nothing is wrapped in a scroll view, so the children get the whole flex root
 * and an empty state can actually centre itself in it.
 */
export function Static() {
   return (
      <div style={phone}>
         <Screen scroll={false}>
            <ScreenHeader kicker="Starbucks Pay" title="Transactions" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
               <EmptyState
                  glyph="pay"
                  title="No transactions yet"
                  body="Reloads and store payments will appear here."
                  action={<Button label="Add money" glyph="plus" variant="secondary" />}
               />
            </div>
         </Screen>
      </div>
   );
}
