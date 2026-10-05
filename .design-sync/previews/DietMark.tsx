import { DietMark, ListRow, PriceTag, Theme } from 'starbucks';

/**
 * The two regulated marks, drawn large so the geometry reads: a dot inside a
 * rounded square, green for veg and maroon for non-veg. `Diet.veg` and
 * `Diet.nonVeg` are FSSAI colours and never take a category accent.
 */
export function Indicators() {
   return (
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', padding: 16 }}>
         <DietMark veg size={40} />
         <DietMark veg={false} size={40} />
      </div>
   );
}

/**
 * `size` drives the whole mark — box, border weight and the dot inside it stay
 * in proportion. 14 is the default and what a product thumb overlays; the
 * larger steps are the list row and the PDP.
 */
export function Sizes() {
   return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: 16 }}>
         <DietMark veg size={14} />
         <DietMark veg size={20} />
         <DietMark veg size={28} />
         <DietMark veg size={40} />
      </div>
   );
}

/**
 * Where it actually goes: the leading slot of a menu row, ahead of the drink
 * name. India-market mandatory on every consumable.
 */
export function InListRow() {
   return (
      <div style={{ width: 420, background: Theme.Surface.raised }}>
         <ListRow
            leading={<DietMark veg />}
            chevron={false}
            kicker="TALL · 354 ml · 655 kcal"
            kickerStyle="micro"
            title="Tiramisu Frappuccino"
            trailing={<PriceTag amount={588} />}
         />
         <ListRow
            divided
            leading={<DietMark veg={false} />}
            chevron={false}
            kicker="Serves 1 · 318 kcal"
            kickerStyle="micro"
            title="Chicken Tikka Panini"
            trailing={<PriceTag amount={393.75} />}
         />
      </div>
   );
}
