import { Button, Chip, Grid, PlaceholderBlock, Theme, Tile } from 'starbucks';

/**
 * Home's reward teaser: a media head, a title, one line of sub, and a locked
 * control at the foot.
 *
 * The button is disabled rather than absent — a disabled non-primary button is
 * the recessed slot the old hand-rolled CTA drew by hand, and an empty foot
 * would make two tiles in a rail different heights.
 */
export function RewardTeaser() {
   return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
         <Tile
            width={Theme.RailCard.standard}
            media={<PlaceholderBlock height={84} />}
            title="Free Customization"
            sub="Redeem this for 200★"
            footer={<Button label="Unlock Reward" variant="secondary" size="sm" full disabled />}
         />
         <Tile
            width={Theme.RailCard.standard}
            media={<PlaceholderBlock height={84} />}
            title="Handcrafted Drink"
            sub="Redeem this for 300★"
            footer={<Button label="Unlock Reward" variant="secondary" size="sm" full disabled />}
         />
      </div>
   );
}

/**
 * The promo shape: no fixed width, so it fills whatever it is dropped into, and
 * the foot is a `TextAction` rather than a control. Home stacks two of these
 * inside a gutter.
 */
export function Promo() {
   return (
      <div style={{ width: 348, display: 'flex', flexDirection: 'column', gap: 16 }}>
         <Tile
            media={<PlaceholderBlock label="Campaign artwork" height={120} />}
            title="Beverage Subscription"
            sub="One coffee a day, one price a month."
            action="Know More"
            onAction={() => {}}
         />
         <Tile
            media={<PlaceholderBlock label="Campaign artwork" height={120} />}
            title="Dots Doodles × Starbucks"
            sub="Back to campus, in colour."
            action="Get Now"
            onAction={() => {}}
         />
      </div>
   );
}

/**
 * `badge` sits between the media and the title. A `Chip` there is how the
 * editorial rail labels its category without spending a line of the title.
 */
export function Article() {
   return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
         <Tile
            width={Theme.RailCard.feature}
            media={<PlaceholderBlock height={120} />}
            badge={<Chip label="Coffee Culture" selected />}
            title="The Art & Science of Coffee Brewing"
            action="Learn More"
            onAction={() => {}}
         />
      </div>
   );
}

/**
 * Both foot slots at once, which is the case they were split for: `footer` is a
 * real control and comes first, `action` is a word you tap and closes the card.
 * "Do the thing, or read more about it" — and never two of either.
 */
export function BothFeet() {
   return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
         <Tile
            width={Theme.RailCard.feature}
            media={<PlaceholderBlock height={112} />}
            badge={<Chip label="★ Reward redeemed" tone="gold" size="sm" />}
            title="Buy 1 Food, Get 50% Off Your Next"
            sub="Expires on 30/09/2026"
            footer={<Button label="Use Reward" size="sm" full />}
            action="Details"
            onAction={() => {}}
         />
      </div>
   );
}

/**
 * Give it no `width` inside a `Grid` and it fills its cell — the difference
 * between a rail and Gift's two-up catalogue is the container, not the tile.
 */
export function InGrid() {
   return (
      <div style={{ width: 380 }}>
         <Grid>
            <Tile
               media={<PlaceholderBlock height={104} />}
               title="India Exclusive"
               sub="Made here, for here."
               action="Add Item"
               onAction={() => {}}
            />
            <Tile
               media={<PlaceholderBlock height={104} />}
               title="Starbucks Coffee"
               sub="The one that always works."
               action="Add Item"
               onAction={() => {}}
            />
            <Tile
               media={<PlaceholderBlock height={104} />}
               title="U Keep Me Warm"
               sub="For the person who does."
               action="Add Item"
               onAction={() => {}}
            />
            <Tile
               media={<PlaceholderBlock height={104} />}
               title="A Sip of Appreciation"
               sub="Thanks, properly."
               action="Add Item"
               onAction={() => {}}
            />
         </Grid>
      </div>
   );
}
