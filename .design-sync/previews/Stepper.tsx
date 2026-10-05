import { ProductCard, Stepper, Theme } from 'starbucks';

/**
 * Quantity: − n +. Two `IconButton`s and a number, so the minus and the plus
 * inherit the hit-slop guarantee instead of each being a bare glyph in a
 * `Pressable`.
 */
export function Default() {
   return <Stepper value={2} label="Tiramisu Frappuccino" onChange={() => {}} />;
}

/**
 * `sm` draws the same 30pt disc as the add button it replaces in a card foot;
 * `md` is the full 44pt, for a stepper that is the main control on a screen.
 * Both are legal targets — the small one makes the difference up in hit-slop.
 */
export function Sizes() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
         <Stepper value={2} size="sm" label="Iced Coconut Matcha" onChange={() => {}} />
         <Stepper value={2} size="md" label="Iced Coconut Matcha" onChange={() => {}} />
      </div>
   );
}

/**
 * The bounds are enforced by the component, not the caller, and `disabled`
 * *shows* the bound where a silently-ignored press would not. At `min` the minus
 * is dead; at `max` the plus is.
 */
export function Bounds() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
         <Stepper value={1} label="Malabar Coconut Flat White" onChange={() => {}} />
         <Stepper value={4} max={9} label="Malabar Coconut Flat White" onChange={() => {}} />
         <Stepper value={9} max={9} label="Malabar Coconut Flat White" onChange={() => {}} />
      </div>
   );
}

/**
 * The value keeps a fixed minimum width, so crossing from 9 to 10 does not shove
 * the plus button sideways. Two rows at either side of that boundary.
 */
export function TwoDigits() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
         <Stepper value={9} label="Java Chip Frappuccino" onChange={() => {}} />
         <Stepper value={12} label="Java Chip Frappuccino" onChange={() => {}} />
      </div>
   );
}

/**
 * A cart line: the stepper in a product row's `trailing` slot, where it replaces
 * the add button rather than sitting beside it.
 */
export function InCartLine() {
   return (
      <div style={{ width: 380, display: 'flex', flexDirection: 'column' }}>
         <ProductCard
            variant="row"
            name="Apricot Iced Shaken Espresso"
            meta="TALL · 354 ml · 140 kcal"
            price={414.75}
            veg
            trailing={
               <Stepper
                  value={3}
                  label="Apricot Iced Shaken Espresso"
                  onChange={() => {}}
                  style={{ marginTop: Theme.Space.xs }}
               />
            }
         />
         <ProductCard
            variant="row"
            name="Black Palm Jaggery Latte"
            meta="SHORT · 237 ml · 197 kcal"
            price={393.75}
            veg
            trailing={
               <Stepper
                  value={1}
                  label="Black Palm Jaggery Latte"
                  onChange={() => {}}
                  style={{ marginTop: Theme.Space.xs }}
               />
            }
         />
      </div>
   );
}
