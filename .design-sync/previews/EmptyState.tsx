import { Button, EmptyState, StarBalance, Theme } from 'starbucks';

const stage = {
   width: 420,
   background: Theme.Surface.app,
} as const;

/**
 * The full form: mark, title, body, action.
 *
 * An empty bag is a correct rendering of the user's situation, not a hole in
 * our work — which is why this is an `EmptyState` and not a
 * `PlaceholderBlock`. The mark is a `Glyph` on a tinted disc so the screen
 * stays inside the app's one icon language.
 */
export function Default() {
   return (
      <div style={stage}>
         <EmptyState
            glyph="order"
            title="Your bag is empty"
            body="Add a drink from the menu and it will show up here."
            action={<Button label="Browse the menu" variant="secondary" />}
         />
      </div>
   );
}

/**
 * Title and body only. Every slot below the title is optional, and a state with
 * nothing to do next should not invent a button.
 */
export function Minimal() {
   return (
      <div style={stage}>
         <EmptyState
            title="No transactions yet"
            body="Reloads and store payments appear here."
         />
      </div>
   );
}

/**
 * `tone="inverse"` for a dark green section: the disc becomes the translucent
 * `Surface.onDarkFill`, the title goes white and the body to the muted on-dark
 * token.
 */
export function Inverse() {
   return (
      <div style={{ ...stage, background: Theme.Surface.inverse }}>
         <EmptyState
            tone="inverse"
            glyph="pin"
            title="No stores nearby"
            body="We could not find a Starbucks within 10 km of Koregaon Park."
            action={<Button label="Search by city" variant="secondary" />}
         />
      </div>
   );
}

/**
 * `mark` replaces the disc entirely, for the cases where the subject already
 * has a house rendering — here the Stars balance the state is about.
 */
export function CustomMark() {
   return (
      <div style={stage}>
         <EmptyState
            mark={<StarBalance stars={0} size="lg" unit />}
            title="No rewards yet"
            body="Collect 100 Stars for a free espresso shot or bakery item."
            action={<Button label="See what Stars buy" variant="ghost" />}
         />
      </div>
   );
}
