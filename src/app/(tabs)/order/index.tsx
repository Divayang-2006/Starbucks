/**
 * Order — store context, then the menu (§2, §5 "Menu taxonomy").
 *
 * Structural placeholder. The order modes, the four top-level menu tabs, the
 * eight category chips and a handful of real products are here; the PDP, the
 * cart and the customisation groups are not — those are separate screens and out
 * of scope.
 *
 * **Three "pick one of N" controls, and each one is now the right one.** This
 * screen is where `segmented.tsx`'s table earns its keep: the menu tabs
 * *partition* the catalogue (you are looking at Drinks or you are looking at
 * Food), so they are a `Segmented`; the category chips *filter* across whichever
 * partition you are in, so they are a `ChipRow`; and the order modes are a short
 * fixed set that changes the fulfilment rather than the view, so they are a
 * `ChipRow` with its scrolling turned off. Two of the three used to be drawn by
 * hand a hundred lines from the components they were copies of.
 *
 * **The sheet gap changed.** This screen used `Space.lg` between sections where
 * the other four used `Space.xxl`; `Sheet` now owns that rule and the majority
 * won. See `SHEET_GAP` for the argument — the short version is that a boundary
 * here is a subject change, and 20pt reads as "related" where 32 reads as "two
 * things".
 *
 * Serif goes to the store name, same rule as Home: in India the menu, the ETA
 * and the price are all per-store, so this screen belongs to a shop before it
 * belongs to a drink.
 */

import { StyleSheet, View } from 'react-native';

import { ProductCard, StoreRow } from '@/components/brand';
import { ChipRow, Screen, ScreenHeader, Section, Sheet } from '@/components/chrome';
import { SearchField, Segmented } from '@/components/controls';
import { useSession } from '@/lib/session';
import { Space } from '@/theme';

/** §5 — Dine-In and Takeaway are the two the web app offers; Delivery is app-only. */
const MODES = ['Dine-In', 'Takeaway', 'Delivery'];

const MENU_TABS = ['Drinks', 'Food', 'At Home Coffee', 'Merchandise'];

const CATEGORIES = [
   'New Launch',
   'Best Seller',
   'Drinks',
   'Food',
   'Merch',
   'At Home Coffee',
   'Ready to Eat',
   'Power Picks',
];

/** §5 sample catalogue, verbatim — prices carry the paise the real app carries. */
const PRODUCTS = [
   { name: 'Tiramisu Frappuccino', meta: 'TALL · 354 ml · 655 kcal', price: 588 },
   { name: 'Tiramisu Cold Brew', meta: 'GRANDE · 473 ml · 462 kcal', price: 488.25 },
   { name: 'Apricot Iced Shaken Espresso', meta: 'TALL · 354 ml · 140 kcal', price: 414.75 },
   { name: 'Black Palm Jaggery Latte', meta: 'SHORT · 237 ml · 197 kcal', price: 393.75 },
];

/** Shared verbatim with Home — see the note there. Unreachable behind the store gate. */
const NO_STORE = 'Pick a store to start';

export default function OrderScreen() {
   const { store } = useSession();

   return (
      <Screen tone="inverse">
         <ScreenHeader tone="inverse" sheetBelow kicker="Ordering from" title="Menu">
            {/*
             * No kicker on the row itself: "Ordering from" is already the band's
             * lead-in, and `StoreRow` would otherwise supply its own default.
             */}
            <StoreRow
               kicker=""
               name={store?.name ?? NO_STORE}
               area={store?.area}
               etaMins={store?.etaMins}
            />

            {/* §5 — mode is per-order, and it changes the ETA, so it lives with the store. */}
            <View style={styles.modes}>
               <ChipRow items={MODES} selectedIndex={0} scroll={false} gutter={false} />
            </View>
         </ScreenHeader>

         <Sheet>
            {/*
             * A button that looks like a field, not a `TextInput` — tapping the
             * menu's search opens a search screen rather than filtering in
             * place, and `SearchField` encodes that difference so a screen
             * reader hears a button.
             */}
            <SearchField
               placeholder="Search the menu"
               gutter
               onPress={() => {
                  // TODO: push the menu search screen once it exists.
               }}
            />

            <Segmented items={MENU_TABS} selectedIndex={0} scroll />

            <ChipRow items={CATEGORIES} selectedIndex={0} />

            <Section kicker="New Launch" title="Just arrived" action="View all" gutter>
               {PRODUCTS.map((item) => (
                  <ProductCard
                     key={item.name}
                     variant="row"
                     name={item.name}
                     meta={item.meta}
                     price={item.price}
                     veg
                     onAdd={() => {
                        // TODO: add to the cart once there is one.
                     }}
                  />
               ))}
            </Section>
         </Sheet>
      </Screen>
   );
}

const styles = StyleSheet.create({
   /**
    * The band spaces its children by `Space.xs`; the modes want a clear break
    * from the store above them. `ChipRow` takes no `style`, hence the wrapper.
    */
   modes: {
      marginTop: Space.base,
   },
});
