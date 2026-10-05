import { ActionBar, Button, PriceTag, Theme } from 'starbucks';

/**
 * The bar is a floor: it stretches edge to edge and content scrolls under it, so
 * every cell fixes a phone-width container and sets the cream the app sits on.
 */
const phone = {
   width: 390,
   background: Theme.Surface.app,
   paddingTop: 28,
} as const;

/**
 * The canonical cart floor — the fact on the left, the action on the right.
 *
 * `summary` shrinks and the action does not, so the button takes whatever the
 * total leaves. That is why the action is `full`: it fills the slot it was
 * given rather than hugging inside it.
 */
export function Default() {
   return (
      <div style={phone}>
         <ActionBar summary={<PriceTag amount={1060.5} size="lg" />}>
            <Button label="Add to Cart" full />
         </ActionBar>
      </div>
   );
}

/**
 * No summary: the action gets the whole bar, which is what `<Button full>`
 * expects. The amount moves into the label — "Pay ₹535.50" is one statement.
 */
export function ActionOnly() {
   return (
      <div style={phone}>
         <ActionBar>
            <Button label="Pay ₹535.50" glyph="pay" full />
         </ActionBar>
      </div>
   );
}

/**
 * `tone="inverse"` for a bar under a dark green screen. The action goes
 * `secondary` — a white pill is the only fill that clears House Green, and the
 * hairline flips to the on-dark token.
 */
export function Inverse() {
   return (
      <div style={{ ...phone, background: Theme.Surface.inverse }}>
         <ActionBar tone="inverse" summary={<PriceTag amount={588} size="lg" tone="inverse" />}>
            <Button label="Add to Cart" variant="secondary" full />
         </ActionBar>
      </div>
   );
}

/**
 * The summary slot is a node, not a string — a discounted total carries its
 * struck-through original through `PriceTag` rather than a second bar variant.
 */
export function Discounted() {
   return (
      <div style={phone}>
         <ActionBar summary={<PriceTag amount={456.75} was={520} size="lg" />}>
            <Button label="Checkout" full />
         </ActionBar>
      </div>
   );
}
