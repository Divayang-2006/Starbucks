/**
 * Gift — the gift-card catalogue (§2, §5 "Gift card model").
 *
 * Structural placeholder. The four real categories and six real card names are
 * here; the artwork and the purchase flow (amount, message, recipient) are not —
 * gift-card detail is a minor screen and out of scope.
 *
 * The shortest of the five screens, and now the only one with no `StyleSheet` at
 * all: a catalogue is a grid of tiles and a teaser row, and all three of those
 * are in `@/components/chrome`. If this file ever grows a style block again,
 * that is the signal something belongs in the shared layer.
 *
 * **Chips, not `Segmented`, for the categories** — and that is the same call the
 * screen already made, now with the rule written down. `segmented.tsx` splits
 * them on partition vs filter: these four cut *across* the catalogue rather than
 * dividing it, "Congratulations" alone eats a third of the width, and a
 * scrolling set is exactly what `ChipRow` is for.
 *
 * No serif on this screen. "Gift Cards" is a screen title, not one of the four
 * things DESIGN_SYSTEM §1 rations Fraunces to.
 */

import {
   ChipRow,
   Grid,
   Gutter,
   ListRow,
   PlaceholderBlock,
   Screen,
   ScreenHeader,
   Section,
   Sheet,
   Tile,
} from '@/components/chrome';

const CATEGORIES = ['Featured', 'Anytime', 'Congratulations', 'Thank You'];

/** §5 — the live catalogue, so the grid is dimensioned against real title lengths. */
const CARDS = [
   { name: 'India Exclusive', blurb: 'Made here, for here.' },
   { name: 'Starbucks Coffee', blurb: 'The one that always works.' },
   { name: 'U Keep Me Warm', blurb: 'For the person who does.' },
   { name: 'Congrats', blurb: 'Say it with a coffee.' },
   { name: 'More Than Words', blurb: 'When there aren’t any.' },
   { name: 'A Sip of Appreciation', blurb: 'Thanks, properly.' },
];

export default function GiftScreen() {
   return (
      <Screen tone="inverse">
         <ScreenHeader
            tone="inverse"
            sheetBelow
            kicker="Send a little something"
            title="Gift Cards"
         />

         <Sheet>
            <ChipRow items={CATEGORIES} selectedIndex={0} />

            <Section kicker="Featured" title="Cards to send today">
               {/*
                * Two-up grid, not a rail: the catalogue is browsed, not skimmed
                * past, and card artwork is the whole product.
                */}
               <Grid>
                  {CARDS.map((card) => (
                     <Tile
                        key={card.name}
                        media={<PlaceholderBlock height={104} />}
                        title={card.name}
                        sub={card.blurb}
                        action="Add Item"
                     />
                  ))}
               </Grid>
            </Section>

            {/* Web-only today (§2), but it belongs on the tab. */}
            <Gutter>
               <ListRow
                  surface="card"
                  title="Corporate Gifting"
                  subtitle="Bulk cards for teams, clients and campaigns."
                  /**
                   * Chevron without a press handler, which is what this row has
                   * always been: the destination is a web page today, so there
                   * is nothing in the app to push. Stated rather than implied,
                   * because `ListRow` would otherwise draw no affordance at all.
                   */
                  chevron
               />
            </Gutter>
         </Sheet>
      </Screen>
   );
}
