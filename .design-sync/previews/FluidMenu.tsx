import {
   Chip,
   FluidMenu,
   Glyph,
   HeaderButton,
   ListRow,
   ListSection,
   Screen,
   ScreenHeader,
   Sheet,
   StageMock,
   Stat,
   StatStrip,
   Theme,
} from 'starbucks';

import { MENU_ITEMS } from '@/components/fluid-menu/items';

/**
 * `FluidMenu` fills its parent — the panel and the app card are both
 * `absoluteFill` inside a `flex: 1` shell — so every cell hands it a phone-sized
 * flex box.
 */
function Phone({ children }: { children: React.ReactNode }) {
   return (
      <div style={{ width: 390, height: 648, display: 'flex', overflow: 'hidden' }}>{children}</div>
   );
}

/**
 * At rest, which is the only state a still frame can reach.
 *
 * The panel is mounted and fully composed behind this — it is a sibling of the
 * app card, not a modal over it — but at `progress` 0 the card is full-bleed and
 * covers every pixel of it, and every element of the panel has animated to
 * `opacity: 0`. The two ways in are a left-edge pan and `openMenu`, and neither
 * happens in a screenshot; the open panel is on `MenuPanel`'s card, where
 * `progress` is a prop.
 *
 * The composition is the shipped one. `items` is the real nine-row list, and the
 * children are the whole app: in `(tabs)/_layout.tsx` that is the tab tree, bar
 * included, because the thing being set aside is the app rather than one screen.
 */
export function AtRest() {
   return (
      <Phone>
         <FluidMenu
            items={MENU_ITEMS}
            initials="DM"
            caption="Collecting from Koregaon Park"
            onSelect={() => {}}
            onProfile={() => {}}
         >
            <StageMock
               greeting="Hi, Divayang"
               storeName="Koregaon Park"
               onMenu={() => {}}
               onExit={() => {}}
            />
         </FluidMenu>
      </Phone>
   );
}

/**
 * `children` is a plain node, not a render prop, so anything can be the app —
 * here a rewards screen instead of the Home mock.
 *
 * The difference is load-bearing rather than stylistic. A node can be memoized by
 * its owner and skipped wholesale when the panel's settled state flips; a
 * function child is re-invoked every time and rebuilds the entire tree under it.
 * The callback that opens the panel gets to the header button through the
 * provider `FluidMenu` mounts around these children, not through a prop.
 *
 * `gestureEnabled={false}` is what the app passes anywhere but Home at its stack
 * root — a screen that already owns the left edge, such as a pushed detail, must
 * not have the pan taken out from under it. It disarms the *closed* panel only;
 * an open one can always be dragged shut.
 */
export function WrapsAnyContent() {
   return (
      <Phone>
         <FluidMenu
            items={MENU_ITEMS}
            initials="DM"
            caption="Collecting from Phoenix Marketcity"
            gestureEnabled={false}
            onSelect={() => {}}
            onProfile={() => {}}
         >
            <Screen tone="inverse">
               <ScreenHeader
                  tone="inverse"
                  sheetBelow
                  kicker="Green member"
                  title="Rewards & Stars"
                  left={
                     <HeaderButton label="Open menu" onPress={() => {}}>
                        <Glyph
                           id="menu"
                           size={Theme.IconSize.md}
                           color={Theme.TextColor.onDark}
                           strokeWidth={Theme.Stroke.medium}
                        />
                     </HeaderButton>
                  }
               >
                  <StatStrip tone="inverse">
                     <Stat label="Stars" value="128" />
                     <Stat label="To next" value="22" />
                     <Stat label="Rewards" value="1" />
                  </StatStrip>
               </ScreenHeader>

               <Sheet>
                  <ListSection title="Redeem">
                     <ListRow
                        title="Free Customization"
                        subtitle="Extra espresso shot, syrup or a dairy swap"
                        kicker="200 ★"
                     />
                     <ListRow
                        title="Handcrafted Drink"
                        subtitle="Any Frappuccino, latte or cold brew"
                        kicker="300 ★"
                     />
                     <ListRow
                        title="Signature Merchandise"
                        subtitle="Tumblers, mugs and cold cups in store"
                        kicker="700 ★"
                     />
                  </ListSection>

                  <ListSection title="Recent stars">
                     <ListRow
                        title="Tiramisu Frappuccino"
                        kicker="Koregaon Park"
                        trailing={<Chip label="+24 ★" />}
                     />
                     <ListRow
                        title="Malabar Flat White"
                        kicker="Phoenix Marketcity"
                        trailing={<Chip label="+18 ★" />}
                     />
                  </ListSection>
               </Sheet>
            </Screen>
         </FluidMenu>
      </Phone>
   );
}
