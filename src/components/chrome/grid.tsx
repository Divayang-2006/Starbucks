/**
 * An n-up grid.
 *
 * `gift.tsx` did this with `flexBasis: '48%'` and `flexGrow: 1` on each tile,
 * which works and is impossible to reuse — the 48 is `100 / 2 - 2`, and the 2 is
 * "enough slack that two tiles plus the gap can never round up past a full row".
 * That arithmetic belongs in one place.
 *
 * **Why rows rather than one wrapping line.** React Native resolves a percentage
 * basis against the container *before* subtracting `gap`, so `flexBasis: '50%'`
 * on two children with any gap at all overflows and wraps to one per row. This
 * file used to buy headroom by under-shooting the basis — `100 / columns - 2` —
 * and letting `flexGrow` reclaim the remainder. The mechanism was right; the
 * constant was not. The space a row actually needs for its gaps is
 * `gap * (columns - 1)`, which as a share of the container grows with both the
 * gap and the column count, so a flat two points is not enough headroom past
 * roughly 2-up at 12pt: `columns={3}` at the default gap silently laid out as
 * two columns on a 390pt screen, and `columns={2}` at `Space.lg` as one. It
 * still looked deliberate, which is what made it worth fixing rather than
 * papering over.
 *
 * Chunking into rows of `columns` and giving each cell `flex: 1` removes the
 * arithmetic instead of correcting it. Flexbox subtracts the row's gaps first
 * and divides what is left, so the columns are exact at every width and gap
 * without measuring the container or guessing at slack.
 *
 * A short last row keeps the old behaviour: its cells divide that row, so a lone
 * trailing tile fills the width rather than sitting in a half-empty column. That
 * is what the wrapping version did, and no call site has asked for otherwise.
 *
 * Rows, not virtualised. Every grid in this app is a bounded catalogue — six
 * gift cards, four benefits — sitting inside a screen-level scroll view. A
 * `FlatList` nested in a `ScrollView` is a warning and a scroll conflict for no
 * benefit at this size.
 */

import { Children, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Gutter as GutterWidth, Space } from '@/theme';

type Props = {
   columns?: number;
   gap?: number;
   /** Off when the caller is already inside a `Gutter`. */
   gutter?: boolean;
   children: ReactNode;
   style?: StyleProp<ViewStyle>;
};

export function Grid({ columns = 2, gap = Space.md, gutter = true, children, style }: Props) {
   // toArray, not map: it flattens fragments and drops the nulls a conditional
   // child leaves behind, so a `{show && <Tile/>}` cannot silently occupy a cell.
   const items = Children.toArray(children);
   const rows: (typeof items)[] = [];
   for (let i = 0; i < items.length; i += columns) rows.push(items.slice(i, i + columns));

   return (
      // The outer `gap` spaces the rows; each row's own `gap` spaces its cells.
      <View style={[styles.grid, { gap }, gutter && styles.gridGutter, style]}>
         {rows.map((row, i) => (
            <View key={i} style={[styles.row, { gap }]}>
               {row.map((child, j) => (
                  <View key={j} style={styles.cell}>
                     {child}
                  </View>
               ))}
            </View>
         ))}
      </View>
   );
}

const styles = StyleSheet.create({
   grid: {
      flexDirection: 'column',
   },
   gridGutter: {
      paddingHorizontal: GutterWidth,
   },
   row: {
      flexDirection: 'row',
   },
   cell: {
      // Basis 0 so the row's gaps come off the top and the remainder divides
      // evenly — the cell's width is the column, never its content's width.
      flex: 1,
   },
});
