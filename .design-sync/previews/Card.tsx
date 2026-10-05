import { Balance, Button, Card, ListRow, PriceTag, Theme } from 'starbucks';

/**
 * Cards are white on cream and their shadow is tinted House Green — on a white
 * page neither fact is visible, so every cell paints `Surface.app` behind them.
 */
const onCream = {
   background: Theme.Surface.app,
   padding: 24,
   display: 'flex',
   flexDirection: 'column',
   gap: 16,
} as const;

/**
 * The plain container, holding the one number a screen is about.
 *
 * This is Pay's balance card with its bespoke fill removed: white on cream, the
 * green-tinted `Elevation.card` shadow, `Radius.xl` corners.
 */
export function Default() {
   return (
      <div style={{ ...onCream, width: 340 }}>
         <Card>
            <Balance kicker="Balance" value="₹1,240.00" />
         </Card>
      </div>
   );
}

/**
 * A card as a group container — Rewards' "Recent Activity".
 *
 * The rows drop their own inset (`inset={false}`) because the card already
 * pads, and each row after the first carries the hairline.
 */
export function RowGroup() {
   return (
      <div style={{ ...onCream, width: 420 }}>
         <Card>
            <ListRow
               inset={false}
               chevron={false}
               style={{ paddingBottom: Theme.Space.md }}
               kicker="Stars earned"
               title="Tiramisu Frappuccino"
               subtitle="Koregaon Park · 12 Aug"
               trailing={<PriceTag amount={588} />}
            />
            <ListRow
               divided
               inset={false}
               chevron={false}
               style={{ paddingTop: Theme.Space.md, paddingBottom: Theme.Space.md }}
               kicker="Tier earned"
               title="Green Tier unlocked"
               subtitle="1 Star per ₹10 spent"
            />
            <ListRow
               divided
               inset={false}
               chevron={false}
               style={{ paddingTop: Theme.Space.md }}
               kicker="Joined"
               title="Welcome to Starbucks Rewards"
               subtitle="Available until 09/08/2027"
            />
         </Card>
      </div>
   );
}

/**
 * `style` re-tints the fill without forking the component — Rewards' referral
 * card is tan, not white, and still wants the same radius and shadow.
 */
export function Tinted() {
   return (
      <div style={{ ...onCream, width: 420 }}>
         <Card style={{ backgroundColor: Theme.Accent.tan }}>
            <ListRow
               inset={false}
               chevron={false}
               title="Refer &amp; Reap Rewards"
               subtitle="Your invite code gets them a drink and you Stars."
            >
               <div style={{ marginTop: 12 }}>
                  <Button label="Share invite code" variant="inverse" size="sm" />
               </div>
            </ListRow>
         </Card>
      </div>
   );
}

/**
 * `onPress` makes the whole card one tap target rather than putting a control
 * inside it — the chevron is the only affordance the row needs.
 */
export function Pressable() {
   return (
      <div style={{ ...onCream, width: 420 }}>
         <Card onPress={() => {}} accessibilityLabel="Change store">
            <ListRow
               inset={false}
               chevron
               kicker="Current store"
               title="Koregaon Park"
               subtitle="North Main Road, Pune · 6 min away"
            />
         </Card>
      </div>
   );
}
