/**
 * Shared screen chrome. Import from `@/components/chrome`, not from the files
 * inside it, so a piece can be split or renamed without touching call sites.
 *
 * Everything here is generic on purpose — the tab screens are the first
 * consumers, but the PDP, the cart and the whole Account stack want the same
 * header band, the same sheet and the same card.
 *
 * Layering, so imports only ever point one way:
 *
 *   chrome  ←  controls  ←  brand
 *
 * Chrome is the bottom. It knows about layout, surfaces and the icon set, and it
 * knows nothing about buttons, prices or Stars. A slot (`action`, `footer`,
 * `trailing`) is how a chrome component accepts something from a layer above it —
 * `EmptyState` takes an `action` node rather than building a `<Button>` for
 * exactly this reason.
 *
 * One name to watch: `Gutter` here is the *component* that insets its children.
 * `Gutter` from `@/theme` is the number it insets them by. A file needing both
 * imports the token as `Gutter as GutterWidth`.
 */

export { ActionBar } from './action-bar';
export { Card } from './card';
export { Chip, ChipRow, type ChipTone } from './chip';
export { DietMark } from './diet-mark';
export { Divider } from './divider';
export { EmptyState } from './empty-state';
export { Glyph, GLYPHS, type GlyphId } from './glyphs';
export { Grid } from './grid';
export { BottomChrome, useBottomChromeInset, useHeaderInset, useTopInset } from './insets';
export { ListRow } from './list-row';
export { ListSection } from './list-section';
export { PlaceholderBlock, PlaceholderRail } from './placeholder';
export { Rail } from './rail';
export { Screen } from './screen';
export { AvatarButton, CapsKicker, HeaderButton, ScreenHeader } from './screen-header';
export { ScreenScroll } from './screen-scroll';
export { Gutter, Section, SECTION_GAP } from './section';
export { SectionHeader, TextAction } from './section-header';
export { Sheet, SHEET_GAP, SHEET_OVERLAP } from './sheet';
export { Stat, StatStrip } from './stat';
export { Tile } from './tile';
