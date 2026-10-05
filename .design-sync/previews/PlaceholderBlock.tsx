import { Balance, Card, Chip, PlaceholderBlock, Theme, Tile } from 'starbucks';

const app = {
   width: 380,
   background: Theme.Surface.app,
   padding: 16,
   display: 'flex',
   flexDirection: 'column',
   gap: 16,
} as const;

/**
 * An honest hole: recessed `Surface.sunken`, with a caps label saying out loud
 * what belongs in the slot.
 *
 * Not a grey skeleton bar — a half-finished screen should still read as this
 * app rather than as a loading state. Both of these are Home's, at the heights
 * Home asks for.
 */
export function Labelled() {
   return (
      <div style={app}>
         <PlaceholderBlock label="Autoplaying video · mute toggle" height={196} />
         <PlaceholderBlock label="Campaign artwork" height={120} />
      </div>
   );
}

/**
 * Radius by role, which is the whole reason this component has a table in its
 * docs — the audit found four different corners on one primitive, so four
 * identical grey rectangles looked like four different components.
 *
 * Top to bottom: media inside a card (`lg`, the default), a block that *is* the
 * card (`xl`), a small inline slot (`md`), and a disc (`pill`).
 */
export function RadiusByRole() {
   return (
      <div style={app}>
         <PlaceholderBlock label="Media in a card · lg" height={88} />
         <PlaceholderBlock
            label="No transactions yet · reloads and store payments appear here"
            height={112}
            radius={Theme.Radius.xl}
         />
         <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <PlaceholderBlock height={56} radius={Theme.Radius.md} style={{ width: 56 }} />
            <PlaceholderBlock height={72} radius={Theme.Radius.pill} style={{ width: 72 }} />
         </div>
      </div>
   );
}

/**
 * In its real job: the media head of a `Tile`.
 *
 * A promo card and an article card from Home, each with the slot the artwork
 * will land in. The day there is an asset, the block is deleted and an
 * `<Image>` takes the same place.
 */
export function InTile() {
   return (
      <div style={{ ...app, gap: 12 }}>
         <Tile
            media={<PlaceholderBlock label="Campaign artwork" height={120} />}
            title="Beverage Subscription"
            sub="One coffee a day, one price a month."
            action="Know More"
         />
         <Tile
            media={<PlaceholderBlock height={104} />}
            badge={<Chip label="Coffee Culture" selected />}
            title="The Art & Science of Coffee Brewing"
            action="Learn More"
         />
      </div>
   );
}

/**
 * Unlabelled small slots, where a caps label would crowd.
 *
 * The QR square on the Pay card — `Radius.md`, tinted with `Surface.onDarkFill`
 * so it lifts off the green rather than punching a cream hole in it — and the
 * tier gauge disc from Rewards.
 */
export function SmallSlots() {
   return (
      <div style={app}>
         <Card style={{ backgroundColor: Theme.Surface.inverse, padding: 20 }}>
            <Balance kicker="Balance" value="₹0.00" tone="inverse" />
            <div
               style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 24,
               }}
            >
               <PlaceholderBlock
                  height={56}
                  radius={Theme.Radius.md}
                  style={{ width: 56, backgroundColor: Theme.Surface.onDarkFill }}
               />
            </div>
         </Card>

         <Card style={{ alignItems: 'center', paddingVertical: 24 }}>
            <PlaceholderBlock
               label="Tier gauge"
               height={168}
               radius={Theme.Radius.pill}
               style={{ width: 168 }}
            />
         </Card>
      </div>
   );
}
