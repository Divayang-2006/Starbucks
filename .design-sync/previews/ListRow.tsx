import {
   Avatar,
   Card,
   Chip,
   Divider,
   Glyph,
   ListRow,
   PriceTag,
   ProductThumb,
   Stepper,
   Theme,
} from 'starbucks';

/** The cream app background a row is always seen against. */
const app = {
   width: 380,
   background: Theme.Surface.app,
   padding: 16,
   display: 'flex',
   flexDirection: 'column',
   gap: 16,
} as const;

/**
 * The canonical row: a title, a chevron, and a hairline between siblings.
 *
 * This is Pay's "Other Payment Modes" list. `divided` is off on the first row
 * and on for the rest — the rule the row lets you get wrong, and the reason
 * `ListSection` exists to set it for you.
 */
export function Default() {
   return (
      <div style={app}>
         <Card style={{ padding: 0 }}>
            <ListRow title="UPI" onPress={() => {}} />
            <ListRow title="Credit / Debit Card" divided onPress={() => {}} />
            <ListRow title="Net Banking" divided onPress={() => {}} />
            <ListRow title="Wallets" divided onPress={() => {}} />
         </Card>
      </div>
   );
}

/**
 * The four slots, one row each.
 *
 * `leading` is whatever the caller has — a glyph, an avatar, a product thumb.
 * `trailing` replaces the chevron rather than joining it. `children` is the
 * one that is easy to miss: it renders *under* the text stack and inside the
 * text column, which is what a product row's price foot needs.
 */
export function Slots() {
   return (
      <div style={app}>
         <Card style={{ padding: 0 }}>
            <ListRow
               leading={<Glyph id="scan" size={22} color={Theme.TextColor.secondary} />}
               title="Scan to pay"
               subtitle="Show the barista your code"
               onPress={() => {}}
            />
            <ListRow
               divided
               leading={<Avatar name="Divayang Malseda" size={40} tier="green" />}
               title="Divayang Malseda"
               subtitle="Member since 2026"
               trailing={<Chip label="Green Tier" tone="success" size="sm" />}
            />
            <ListRow
               divided
               align="top"
               leading={<ProductThumb size={64} veg />}
               kickerStyle="micro"
               kicker="TALL · 354 ml · 655 kcal"
               title="Tiramisu Frappuccino"
               trailing={<Stepper value={2} onChange={() => {}} />}
            >
               <PriceTag amount={588} />
            </ListRow>
         </Card>
      </div>
   );
}

/**
 * `kickerStyle` — the same slot, set two ways, and the bug it prevents.
 *
 * `caps` is the label voice: `NEW LAUNCH` is a label. `micro` is for a kicker
 * that is *data* — uppercasing `354 ml` gives `354 ML`, and `ML` is not the
 * symbol for a millilitre. Both rows below carry the same string in the same
 * slot; only the voice differs.
 */
export function KickerVoice() {
   return (
      <div style={app}>
         <Card style={{ padding: 0 }}>
            <ListRow
               kicker="New launch"
               title="Malabar Coconut Flat White"
               subtitle="Made with coconut from the Malabar coast"
               onPress={() => {}}
            />
            <ListRow
               divided
               kickerStyle="micro"
               kicker="SHORT · 237 ml · 257 kcal"
               title="Malabar Coconut Flat White"
               trailing={<PriceTag amount={456.75} />}
            />
         </Card>
      </div>
   );
}

/**
 * `surface="card"` — a row that is its own card.
 *
 * Gift's Corporate Gifting teaser: one row, standing alone, with the chevron
 * stated rather than implied because the destination is a web page and there
 * is nothing in the app to push.
 */
export function CardSurface() {
   return (
      <div style={app}>
         <ListRow
            surface="card"
            title="Corporate Gifting"
            subtitle="Bulk cards for teams, clients and campaigns."
            chevron
         />
         <ListRow
            surface="card"
            leading={<Glyph id="pin" size={22} color={Theme.TextColor.secondary} />}
            kicker="Collecting from"
            title="Koregaon Park"
            subtitle="North Main Road, Pune · Ready in 6 min"
            onPress={() => {}}
         />
      </div>
   );
}

/**
 * `align="stretch"` — Rewards' dotted activity timeline.
 *
 * The leading slot spans the row's full height, so a connector drawn in it can
 * reach the next row's dot. Without `stretch` the row centres its slots and a
 * `flex: 1` rule has nothing to grow into; the alternative is a negative margin
 * at every call site.
 */
export function Timeline() {
   return (
      <div style={app}>
         <Card>
            <ListRow
               inset={false}
               chevron={false}
               align="stretch"
               kicker="Joined"
               title="Welcome to Starbucks Rewards"
               subtitle="Available until 09/08/2027"
               style={{ paddingBottom: 16 }}
               leading={
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                     <div
                        style={{
                           width: 8,
                           height: 8,
                           borderRadius: 999,
                           background: Theme.Action.selected,
                        }}
                     />
                     <Divider
                        orientation="vertical"
                        style={{ flex: 1, minHeight: 32, marginTop: 4, marginBottom: -30 }}
                     />
                  </div>
               }
            />
            <ListRow
               inset={false}
               chevron={false}
               align="stretch"
               kicker="Tier earned"
               title="Green Tier unlocked"
               subtitle="1 Star per ₹10 spent"
               leading={
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                     <div
                        style={{
                           width: 8,
                           height: 8,
                           borderRadius: 999,
                           background: Theme.Action.selected,
                        }}
                     />
                  </div>
               }
            />
         </Card>
      </div>
   );
}

/**
 * `tone="inverse"` on House Green, and the destructive row.
 *
 * The hairline switches to its on-dark weight and the destructive title uses
 * `Status.errorOnDark` — plain `error` red measures 2.3:1 on this green and
 * fails even the 3:1 floor.
 */
export function Inverse() {
   return (
      <div
         style={{
            width: 380,
            background: Theme.Surface.inverse,
            padding: 16,
            borderRadius: 20,
         }}
      >
         <div
            style={{
               background: Theme.Surface.onDarkFill,
               borderRadius: 20,
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'stretch',
            }}
         >
            <ListRow
               tone="inverse"
               leading={<Glyph id="person" size={22} color={Theme.TextColor.onDarkMuted} />}
               title="Personal Information"
               subtitle="Name, mobile number, email"
               onPress={() => {}}
            />
            <ListRow
               tone="inverse"
               divided
               leading={<Glyph id="crown" size={22} color={Theme.TextColor.onDarkMuted} />}
               title="Rewards & Benefits"
               trailing={<Chip label="240 ★" tone="gold" size="sm" />}
            />
            <ListRow
               tone="inverse"
               divided
               destructive
               chevron={false}
               title="Log Out"
               onPress={() => {}}
            />
         </div>
      </div>
   );
}
