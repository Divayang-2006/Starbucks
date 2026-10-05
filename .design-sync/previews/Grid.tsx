import { Grid, PlaceholderBlock, Theme, Tile } from 'starbucks';

/** A grid fills its container, so every cell fixes a phone width on cream. */
const phone = {
   width: 390,
   boxSizing: 'border-box',
   background: Theme.Surface.app,
   paddingTop: 20,
   paddingBottom: 20,
} as const;

/** §5's real gift-card names, so the columns are dimensioned against real titles. */
const CARDS = [
   { name: 'India Exclusive', blurb: 'Made here, for here.' },
   { name: 'Starbucks Coffee', blurb: 'The one that always works.' },
   { name: 'U Keep Me Warm', blurb: 'For the person who does.' },
   { name: 'Congrats', blurb: 'Say it with a coffee.' },
];

/**
 * The default two-up: Gift's catalogue.
 *
 * A grid, not a rail, because the catalogue is browsed rather than skimmed
 * past. Cells under-shoot their basis and let `flexGrow` reclaim the
 * remainder, which is how two columns stay exact at any `gap`.
 */
export function Catalogue() {
   return (
      <div style={phone}>
         <Grid>
            {CARDS.map((card) => (
               <Tile
                  key={card.name}
                  media={<PlaceholderBlock height={84} />}
                  title={card.name}
                  sub={card.blurb}
                  action="Add Item"
               />
            ))}
         </Grid>
      </div>
   );
}

/**
 * `columns={3}` at the default gap. Nothing about the children changes; a tile
 * inside a `Grid` takes no `width` and fills its cell.
 *
 * This cell used to tighten the gap to `Space.sm` to get three columns at all —
 * the old basis under-shot by a flat 2%, which a 12pt gap exceeded at three
 * columns, silently dropping the row to two-up. The row now divides what is left
 * after its own gaps, so the default gap is three columns exactly.
 */
export function ThreeUp() {
   return (
      <div style={phone}>
         <Grid columns={3}>
            {['Espresso', 'Cold Brew', 'Matcha', 'Refresher', 'Bakery', 'Merch'].map((name) => (
               <Tile key={name} media={<PlaceholderBlock height={64} />} title={name} />
            ))}
         </Grid>
      </div>
   );
}

/**
 * An odd count: the trailing cell keeps its `flexGrow` and takes the whole last
 * row rather than stranding a half-width tile beside a hole.
 */
export function OddCount() {
   return (
      <div style={phone}>
         <Grid>
            {CARDS.slice(0, 3).map((card) => (
               <Tile
                  key={card.name}
                  media={<PlaceholderBlock height={84} />}
                  title={card.name}
                  sub={card.blurb}
                  action="Add Item"
               />
            ))}
         </Grid>
      </div>
   );
}

/**
 * `gutter={false}` for a grid whose parent already insets — the cream band here
 * is the enclosing `Gutter`. Two wrappers each adding the 16pt inset is the
 * mistake this flag prevents, and the columns stay exactly where the gutter-ed
 * grid above puts them.
 */
export function NoGutter() {
   return (
      <div style={{ ...phone, paddingLeft: Theme.Gutter, paddingRight: Theme.Gutter }}>
         <Grid gutter={false}>
            {CARDS.map((card) => (
               <Tile
                  key={card.name}
                  media={<PlaceholderBlock height={84} />}
                  title={card.name}
                  sub={card.blurb}
                  action="Add Item"
               />
            ))}
         </Grid>
      </div>
   );
}
