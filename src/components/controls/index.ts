/**
 * Interactive controls. Import from `@/components/controls`.
 *
 * The middle layer: controls may use chrome (a `Glyph`, the `CapsKicker` rule)
 * and must not know anything about coffee. A control that needs a price or a
 * Star belongs in `brand/`.
 *
 * Two of these overlap on purpose and the choice is documented at the top of the
 * file that owns it — `Segmented` vs `ChipRow` in `segmented.tsx`, and `Button`
 * vs `TextAction` (a word you tap is not a button, and giving it a height makes
 * every card look like a form).
 */

export { Button, type ButtonSize, type ButtonVariant } from './button';
export { Field, SearchField } from './field';
export { IconButton, type IconButtonTone } from './icon-button';
export { Segmented } from './segmented';
export { Stepper } from './stepper';
