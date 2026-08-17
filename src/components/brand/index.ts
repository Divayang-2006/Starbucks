/**
 * Domain components — the ones that know about coffee. Import from
 * `@/components/brand`.
 *
 * The top layer: brand may use `controls` and `chrome`, and neither may use it.
 * The test for whether something belongs here is whether its props mention a
 * Star, a rupee, a store, a tier or a member. `PriceTag` does; `Button` does
 * not, even though every price in the app ends up next to one.
 *
 * These are also the components most likely to be handed real data later. They
 * take plain values (`price: number`, `stars: number`, `name: string`) rather
 * than a `Product` or a `Store`, so a shape change upstream is a change at the
 * call site and not in here.
 */

export { Avatar } from './avatar';
export { Balance } from './balance';
export { PriceTag } from './price-tag';
export { ProductCard } from './product-card';
export { ProductThumb } from './product-thumb';
export { ProgressTrack } from './progress-track';
export { StarBalance } from './star-balance';
export { StoreRow } from './store-row';
