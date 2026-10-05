import { ChipRow, ProductCard, SearchField, Segmented, Theme } from 'starbucks';

const CATEGORIES = ['New Launch', 'Best Seller', 'Drinks', 'Food', 'Merch'];
const MENU_TABS = ['Drinks', 'Food', 'At Home Coffee', 'Merchandise'];

/**
 * Button mode — `onPress` given, no `onChangeText`.
 *
 * Tapping the menu's search opens a search screen rather than filtering in
 * place, so this is a `Pressable` that looks like a field and announces as one.
 * The version it replaced was a `View` with a `Text` in it: visually a search
 * field, semantically nothing, invisible to a screen reader as a control.
 */
export function AsButton() {
   return (
      <div style={{ width: 380 }}>
         <SearchField placeholder="Search the menu" gutter onPress={() => {}} />
      </div>
   );
}

/**
 * Input mode — `onChangeText` given. A real `TextInput` that filters the list
 * under it. Empty, so the placeholder is showing at `TextColor.tertiary`.
 */
export function AsInput() {
   return (
      <div style={{ width: 348 }}>
         <SearchField placeholder="Search stores in Pune" onChangeText={() => {}} />
      </div>
   );
}

/**
 * Both modes carrying a value, which is where they visibly diverge: the input's
 * text is `TextColor.primary` because you typed it, the button's stays tertiary
 * because it is reporting a query that lives on another screen.
 */
export function Filled() {
   return (
      <div style={{ width: 348, display: 'flex', flexDirection: 'column', gap: 16 }}>
         <SearchField placeholder="Search the menu" value="Matcha" onChangeText={() => {}} />
         <SearchField placeholder="Search the menu" value="Matcha" onPress={() => {}} />
      </div>
   );
}

/**
 * The top of the Order sheet, as it is actually stacked: the search button, the
 * menu tabs that partition the catalogue, the chips that filter across it, then
 * the results.
 */
export function OnMenu() {
   return (
      <div
         style={{
            width: 380,
            display: 'flex',
            flexDirection: 'column',
            gap: Theme.Space.lg,
            backgroundColor: Theme.Surface.app,
            borderRadius: 16,
            paddingTop: Theme.Space.lg,
            paddingBottom: Theme.Space.lg,
            overflow: 'hidden',
         }}
      >
         <SearchField placeholder="Search the menu" gutter onPress={() => {}} />
         <Segmented items={MENU_TABS} selectedIndex={0} scroll onChange={() => {}} />
         <ChipRow items={CATEGORIES} selectedIndex={0} onSelect={() => {}} />

         <div style={{ paddingLeft: Theme.Gutter, paddingRight: Theme.Gutter }}>
            <ProductCard
               variant="row"
               name="Tiramisu Frappuccino"
               meta="TALL · 354 ml · 655 kcal"
               price={588}
               veg
               onAdd={() => {}}
            />
            <ProductCard
               variant="row"
               name="Tiramisu Cold Brew"
               meta="GRANDE · 473 ml · 462 kcal"
               price={488.25}
               veg
               onAdd={() => {}}
            />
         </div>
      </div>
   );
}
