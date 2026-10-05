import { Button, PlaceholderBlock, TextAction, Theme, Tile } from 'starbucks';

/**
 * A word you tap. No height, no fill, no border — so it never competes with the
 * real CTA on the same card.
 */
export function Default() {
   return <TextAction label="View all" onPress={() => {}} />;
}

/**
 * The call sites that used to be three different controls: a section header's
 * "View all", Gift's caps "Add Item" and Home's marginless "Learn More" are one
 * component now, so the app has one way of writing a link you can tap.
 */
export function CallSites() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
         <TextAction label="View all" onPress={() => {}} />
         <TextAction label="Discover More" onPress={() => {}} />
         <TextAction label="Learn More" onPress={() => {}} />
         <TextAction label="Add Item" onPress={() => {}} />
         <TextAction label="Details" onPress={() => {}} />
      </div>
   );
}

/**
 * `inverse` swaps the green for white and underlines it. Green-on-green is the
 * reason Home's "Change store" was hand-rolled in the first place — the
 * underline is what carries the affordance once the colour cannot.
 */
export function Inverse() {
   return (
      <div
         style={{
            width: 348,
            backgroundColor: Theme.Surface.inverse,
            borderRadius: 16,
            padding: Theme.Space.lg,
            display: 'flex',
            gap: Theme.Space.xl,
            alignItems: 'center',
         }}
      >
         <TextAction tone="inverse" label="Change store" onPress={() => {}} />
         <TextAction tone="inverse" label="View all" onPress={() => {}} />
      </div>
   );
}

/**
 * Why it is not a button: a reward tile carries both, and they have to read as
 * different weights. "Use Reward" is the thing to do; "Details" is a word that
 * closes the card.
 */
export function NotAButton() {
   return (
      <div style={{ width: Theme.RailCard.feature }}>
         <Tile
            media={<PlaceholderBlock label="Reward artwork" height={112} />}
            title="Free Customized Mondays"
            sub="One free modifier, every Monday"
            footer={<Button label="Use Reward" size="sm" full />}
            action="Details"
            onAction={() => {}}
         />
      </div>
   );
}
