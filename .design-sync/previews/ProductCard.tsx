import { Chip, ProductCard, Stepper } from 'starbucks';

/**
 * The rail tile — Home's horizontal scroller.
 *
 * Content is the app's own: the same three drinks `(tabs)/(home)/index.tsx`
 * seeds its rail with, at their real prices.
 */
export function Tile() {
   return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
         <ProductCard
            name="Tiramisu Frappuccino"
            meta="TALL · 354 ml · 655 kcal"
            price={588}
            veg
            width={160}
            onAdd={() => {}}
         />
         <ProductCard
            name="Iced Coconut Matcha"
            meta="TALL · 354 ml · 117 kcal"
            price={472.5}
            veg
            width={160}
            onAdd={() => {}}
         />
      </div>
   );
}

/**
 * The menu row — the same object rotated. A `ListRow` with the thumb in its
 * leading slot and the price foot in `children`.
 */
export function Row() {
   return (
      <div style={{ width: 380, display: 'flex', flexDirection: 'column' }}>
         <ProductCard
            variant="row"
            name="Tiramisu Cold Brew"
            meta="GRANDE · 473 ml · 462 kcal"
            price={488.25}
            veg
            onAdd={() => {}}
         />
         <ProductCard
            variant="row"
            name="Apricot Iced Shaken Espresso"
            meta="TALL · 354 ml · 140 kcal"
            price={414.75}
            veg
            onAdd={() => {}}
         />
         <ProductCard
            variant="row"
            name="Black Palm Jaggery Latte"
            meta="SHORT · 237 ml · 197 kcal"
            price={393.75}
            veg
            onAdd={() => {}}
         />
      </div>
   );
}

/** `was` struck through by PriceTag; `from` reads "from ₹x" for multi-size items. */
export function Pricing() {
   return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
         <ProductCard
            name="Malabar Coconut Flat White"
            meta="SHORT · 237 ml · 257 kcal"
            price={456.75}
            was={520}
            veg
            width={160}
            onAdd={() => {}}
         />
         <ProductCard name="Cappuccino" meta="Hot coffee" price={325} from veg width={160} onAdd={() => {}} />
      </div>
   );
}

/**
 * `trailing` replaces the add button rather than adding a third variant — a
 * cart line wants a Stepper there, a sold-out item wants a Chip.
 */
export function TrailingSlot() {
   return (
      <div style={{ width: 380, display: 'flex', flexDirection: 'column' }}>
         <ProductCard
            variant="row"
            name="Tiramisu Frappuccino"
            meta="TALL · 354 ml · 655 kcal"
            price={588}
            veg
            trailing={<Stepper value={2} onChange={() => {}} />}
         />
         <ProductCard
            variant="row"
            name="Java Chip Frappuccino"
            meta="TALL · 354 ml · 490 kcal"
            price={525}
            veg
            trailing={<Chip label="Sold out" />}
         />
      </div>
   );
}
