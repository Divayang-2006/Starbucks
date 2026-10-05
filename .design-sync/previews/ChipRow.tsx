import { ChipRow, Theme } from 'starbucks';

/** A row is full-bleed, so every cell fixes a phone width to show where it clips. */
const phone = {
   width: 390,
   boxSizing: 'border-box',
   background: Theme.Surface.app,
   paddingTop: 20,
   paddingBottom: 20,
} as const;

/**
 * The default: a scrolling filter across the whole menu.
 *
 * Order's eight categories, verbatim. The row scrolls horizontally and keeps
 * its `Gutter` inset on the content container, so the first chip lines up with
 * the section titles above it and the last one runs off the edge.
 */
export function Categories() {
   return (
      <div style={phone}>
         <ChipRow
            items={[
               'New Launch',
               'Best Seller',
               'Drinks',
               'Food',
               'Merch',
               'At Home Coffee',
               'Ready to Eat',
               'Power Picks',
            ]}
            selectedIndex={0}
         />
      </div>
   );
}

/**
 * `scroll={false}` for a short fixed set — the three order modes, which fit on
 * the narrowest screen. A scroll view here would be a lie about there being
 * more. `gutter={false}` because this row sits inside a header band that
 * already insets.
 */
export function FixedSet() {
   return (
      <div style={{ ...phone, paddingLeft: 16, paddingRight: 16 }}>
         <ChipRow items={['Dine-In', 'Takeaway', 'Delivery']} selectedIndex={1} scroll={false} gutter={false} />
      </div>
   );
}

/**
 * `selectedIndex={-1}` — nothing chosen. The resting state a gift-card
 * catalogue opens in before the user narrows it.
 */
export function Unselected() {
   return (
      <div style={phone}>
         <ChipRow items={['Featured', 'Anytime', 'Congratulations', 'Thank You']} selectedIndex={-1} />
      </div>
   );
}

/**
 * The non-scrolling row wraps rather than shrinking. A fixed set can still
 * overflow at a large Dynamic Type setting, and a second line is a better
 * failure than three chips with their labels clipped.
 */
export function Wrapping() {
   return (
      <div style={{ ...phone, width: 300 }}>
         <ChipRow
            items={['New Launch', 'Best Seller', 'Drinks', 'Food', 'Ready to Eat']}
            selectedIndex={2}
            scroll={false}
         />
      </div>
   );
}
