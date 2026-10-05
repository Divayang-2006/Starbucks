import { IconButton, Theme } from 'starbucks';

const row = { display: 'flex' as const, gap: Theme.Space.md, alignItems: 'center' as const };

/**
 * The four tones that live on cream: a filled House Green disc, an outlined
 * raised one, the dark inverse, and the borderless ghost.
 */
export function Tones() {
   return (
      <div style={row}>
         <IconButton glyph="plus" label="Add one" tone="primary" />
         <IconButton glyph="search" label="Search the menu" tone="secondary" />
         <IconButton glyph="scan" label="Scan in store" tone="inverse" />
         <IconButton glyph="close" label="Dismiss" tone="ghost" />
      </div>
   );
}

/**
 * `onDark` is translucent white, for a control drawn on House Green — the only
 * tone that cannot be judged on cream, and the one the header band reaches for.
 * The fill separates the mark from the green without a shadow, which on green
 * would read as dirt.
 */
export function OnDark() {
   return (
      <div
         style={{
            ...row,
            width: 348,
            backgroundColor: Theme.Surface.inverse,
            borderRadius: 16,
            padding: Theme.Space.base,
         }}
      >
         <IconButton glyph="gift" label="Gift cards" tone="onDark" />
         <IconButton glyph="pin" label="Change store" tone="onDark" />
         <IconButton glyph="scan" label="Scan in store" tone="onDark" />
         <IconButton glyph="close" label="Dismiss" tone="onDark" />
      </div>
   );
}

/**
 * The size you pass is the size it *draws*; the shortfall from the 44pt minimum
 * comes back as hit-slop automatically, so both of these are legal targets.
 *
 * The glyph follows: 30pt gets a 16pt mark at `Stroke.heavy`, 44pt gets a 20pt
 * mark at `Stroke.medium`. Stroke is optical, so the small one gets *more*
 * weight rather than less.
 */
export function Sizes() {
   return (
      <div style={row}>
         <IconButton glyph="plus" label="Add one" size={Theme.Sizes.inlineControl} />
         <IconButton glyph="plus" label="Add one" size={Theme.Sizes.tap} />
         <IconButton
            glyph="plus"
            label="Add one"
            size={Theme.Sizes.inlineControl}
            tone="secondary"
         />
         <IconButton glyph="plus" label="Add one" size={Theme.Sizes.tap} tone="secondary" />
      </div>
   );
}

/**
 * Disabled drops every tone to the same sunken fill and a tertiary glyph — a
 * control you cannot press should not still advertise which kind it was.
 */
export function Disabled() {
   return (
      <div style={row}>
         <IconButton glyph="minus" label="Remove one" tone="primary" disabled />
         <IconButton glyph="minus" label="Remove one" tone="secondary" disabled />
         <IconButton
            glyph="minus"
            label="Remove one"
            size={Theme.Sizes.inlineControl}
            tone="secondary"
            disabled
         />
      </div>
   );
}
