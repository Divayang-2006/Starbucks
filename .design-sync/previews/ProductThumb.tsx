import { Card, ListRow, PriceTag, ProductThumb, Theme } from 'starbucks';

/**
 * The product square, at its default 96pt with the FSSAI mark on it.
 *
 * No photo yet, so the fallback shows: a recessed `PlaceholderBlock` rather than
 * a grey box pretending to be a picture. The mark rides on the thumbnail rather
 * than on the meta line, so a layout change or a truncated string cannot
 * separate the indicator from the item it describes.
 */
export function Default() {
   return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
         <ProductThumb veg />
      </div>
   );
}

/**
 * The mark is a three-state prop, not a boolean with a default.
 *
 * `veg` green, `veg={false}` the non-veg brown-red, and *omitted entirely* for a
 * non-consumable — a tumbler or a gift card has no FSSAI category, and a green
 * dot on merch is a false claim rather than a harmless one. Both colours are
 * regulated, which is why they sit on a white pad instead of being tuned.
 */
export function DietMarks() {
   return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
         <ProductThumb veg />
         <ProductThumb veg={false} />
         <ProductThumb />
      </div>
   );
}

/**
 * `size` sweeps from a compact list row through the default to a PDP-sized
 * square. The mark stays at its own size throughout — a regulated indicator
 * that scales with the picture stops being legible on the small one.
 */
export function Sizes() {
   return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
         <ProductThumb veg size={56} />
         <ProductThumb veg size={72} />
         <ProductThumb veg size={96} />
         <ProductThumb veg size={140} />
      </div>
   );
}

/**
 * `label` names what belongs in the empty slot, so a half-built screen says so
 * out loud instead of leaving a reader to guess. Ignored the moment an image
 * arrives.
 */
export function Labelled() {
   return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
         <ProductThumb veg size={140} label="Drink photo" />
         <ProductThumb size={140} label="Merch photo" />
      </div>
   );
}

/**
 * `fill` for a card whose own width is a grid fraction: the thumb takes the
 * container's width and stays square, ignoring `size` entirely. This is what
 * `ProductCard` passes when its `width` is `'fill'`.
 */
export function Fill() {
   return (
      <div style={{ width: 340, display: 'flex', gap: 12 }}>
         <div style={{ flex: 1 }}>
            <ProductThumb veg fill />
         </div>
         <div style={{ flex: 1 }}>
            <ProductThumb veg={false} fill />
         </div>
      </div>
   );
}

/**
 * In the leading slot of a menu row — the composition it was cut out of. The
 * thumb sets the row's height, the mark stays with the picture, and the meta
 * line above the name is free to be one flowing string.
 */
export function InRow() {
   return (
      <div style={{ width: 380 }}>
         <Card>
            <ListRow
               inset={false}
               chevron={false}
               align="top"
               kickerStyle="micro"
               kicker="TALL · 354 ml · 655 kcal"
               title="Tiramisu Frappuccino"
               leading={<ProductThumb veg />}
            >
               <div style={{ marginTop: Theme.Space.sm }}>
                  <PriceTag amount={588} />
               </div>
            </ListRow>
            <ListRow
               inset={false}
               divided
               chevron={false}
               align="top"
               kickerStyle="micro"
               kicker="Ceramic · 355 ml"
               title="Siren Tumbler"
               leading={<ProductThumb size={96} label="Merch photo" />}
            >
               <div style={{ marginTop: Theme.Space.sm }}>
                  <PriceTag amount={1650} />
               </div>
            </ListRow>
         </Card>
      </div>
   );
}
