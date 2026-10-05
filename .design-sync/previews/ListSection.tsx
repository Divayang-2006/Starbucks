import { Chip, Glyph, ListRow, ListSection, PriceTag, Stepper, Theme } from 'starbucks';

/** The cream app background. `ListSection` supplies its own gutter inside it. */
const app = {
   width: 390,
   background: Theme.Surface.app,
   paddingTop: 16,
   paddingBottom: 16,
} as const;

/**
 * The canonical group: a title, a text action, and rows that share one panel.
 *
 * Pay's "Other Payment Modes". The component owns exactly one thing the caller
 * cannot get wrong — the first row has no rule above it and every other row
 * does — by cloning `divided` onto its children. No `index > 0 &&` at the call
 * site, which is what both screens used to write.
 */
export function Default() {
   return (
      <div style={app}>
         <ListSection title="Other Payment Modes" action="Manage">
            <ListRow title="UPI" onPress={() => {}} />
            <ListRow title="Credit / Debit Card" onPress={() => {}} />
            <ListRow title="Net Banking" onPress={() => {}} />
            <ListRow title="Wallets" onPress={() => {}} />
         </ListSection>
      </div>
   );
}

/**
 * No title — the panel on its own.
 *
 * Given no `title` the group renders just the card, so a section header written
 * elsewhere (or none at all) still gets the shared surface and the hairlines.
 */
export function Untitled() {
   return (
      <div style={app}>
         <ListSection>
            <ListRow
               leading={<Glyph id="order" size={22} color={Theme.TextColor.secondary} />}
               title="Order history"
               subtitle="Past 6 months"
               onPress={() => {}}
            />
            <ListRow
               leading={<Glyph id="heart" size={22} color={Theme.TextColor.secondary} />}
               title="Favourites"
               trailing={<Chip label="7 saved" size="sm" />}
            />
            <ListRow
               leading={<Glyph id="pin" size={22} color={Theme.TextColor.secondary} />}
               title="Saved stores"
               subtitle="Koregaon Park · Phoenix Marketcity"
               onPress={() => {}}
            />
         </ListSection>
      </div>
   );
}

/**
 * A cart, to show the group holding rows that are not menu items.
 *
 * Steppers in the trailing slot, prices under the text stack — the panel does
 * not care what a row contains, only that the rules land between them.
 */
export function Cart() {
   return (
      <div style={app}>
         <ListSection kicker="Koregaon Park" title="Your order" action="Clear">
            <ListRow
               align="top"
               kickerStyle="micro"
               kicker="TALL · 354 ml · 655 kcal"
               title="Tiramisu Frappuccino"
               trailing={<Stepper value={2} onChange={() => {}} />}
            >
               <PriceTag amount={588} />
            </ListRow>
            <ListRow
               align="top"
               kickerStyle="micro"
               kicker="GRANDE · 473 ml · 462 kcal"
               title="Tiramisu Cold Brew"
               trailing={<Stepper value={1} onChange={() => {}} />}
            >
               <PriceTag amount={488.25} />
            </ListRow>
            <ListRow
               align="top"
               kickerStyle="micro"
               kicker="SHORT · 237 ml · 197 kcal"
               title="Black Palm Jaggery Latte"
               trailing={<Stepper value={1} onChange={() => {}} />}
            >
               <PriceTag amount={393.75} />
            </ListRow>
         </ListSection>
      </div>
   );
}

/**
 * `tone="inverse"` — a translucent panel, not a white card.
 *
 * A drop shadow on House Green reads as dirt, so on green the group swaps the
 * `Card` for `Surface.onDarkFill` and passes the tone down to every row.
 */
export function Inverse() {
   return (
      <div style={{ ...app, background: Theme.Surface.inverse }}>
         <ListSection tone="inverse" title="Account" action="Edit">
            <ListRow
               leading={<Glyph id="person" size={22} color={Theme.TextColor.onDarkMuted} />}
               title="Personal Information"
               subtitle="Name, mobile number, email"
               onPress={() => {}}
            />
            <ListRow
               leading={<Glyph id="crown" size={22} color={Theme.TextColor.onDarkMuted} />}
               title="Rewards & Benefits"
               trailing={<Chip label="240 ★" tone="gold" size="sm" />}
            />
            <ListRow
               leading={<Glyph id="pay" size={22} color={Theme.TextColor.onDarkMuted} />}
               title="Starbucks Card"
               subtitle="6062 •••• •••• 1971"
               onPress={() => {}}
            />
            <ListRow destructive chevron={false} title="Log Out" onPress={() => {}} />
         </ListSection>
      </div>
   );
}
