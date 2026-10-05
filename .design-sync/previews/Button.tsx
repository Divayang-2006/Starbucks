import { Button } from 'starbucks';

/**
 * The five variants, at the height they're meant for.
 *
 * `md` (52) is *the* action of a screen or sheet; `sm` (36) is an action inside
 * a card. Both are swept because the button's own docs are emphatic that the
 * two heights mean different things.
 */
export function Variants() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
         <Button label="Add to Cart" variant="primary" />
         <Button label="Change store" variant="secondary" />
         <Button label="Use Reward" variant="inverse" />
         <Button label="See all rewards" variant="ghost" />
         <Button label="Remove item" variant="destructive" />
      </div>
   );
}

/** Card-level actions. Same visual mass as a Chip, which is the point. */
export function SmallSize() {
   return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
         <Button label="Reorder" size="sm" variant="primary" />
         <Button label="Customise" size="sm" variant="secondary" />
         <Button label="Details" size="sm" variant="ghost" />
      </div>
   );
}

/** A leading glyph is sized and weighted from `size` — heavier stroke at sm. */
export function WithGlyph() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
         <Button label="Pay ₹588.00" glyph="pay" variant="primary" />
         <Button label="Find a store" glyph="pin" variant="secondary" />
         <Button label="Scan in store" glyph="scan" size="sm" variant="secondary" />
      </div>
   );
}

/**
 * The two disabled treatments, side by side, because they are deliberately
 * different: `primary` darkens to a muted fill and keeps white type, while
 * everything else recesses to `Surface.sunken`. Dimming a saturated green on
 * cream *lightens* it, and lighter green is this app's disabled signal.
 */
export function States() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
         <Button label="Unlock Reward" variant="primary" disabled />
         <Button label="Unlock Reward" variant="secondary" disabled />
         <Button label="Placing order" variant="primary" loading />
      </div>
   );
}

/** `full` stretches; the default hugs. The loud option is the one you type. */
export function FullWidth() {
   return (
      <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
         <Button label="Continue" variant="primary" full />
         <Button label="Not now" variant="ghost" full />
      </div>
   );
}
