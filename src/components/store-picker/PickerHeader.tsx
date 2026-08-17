import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/chrome';
import { Gutter, Space } from '@/theme';

import { CityRail } from './CityRail';
import type { CityFilter } from './geo';

/**
 * The map screen's header — **the app's header band**, not a bespoke one.
 *
 * This screen has now had three headers. It drew its own title block, then that
 * was replaced by a real transparent `UINavigationBar`, and both were wrong for
 * the same reason: the map is a screen in this app like any other, and a screen
 * that invents its chrome is a screen that drifts. A `UINavigationBar` cannot
 * carry the siren, cannot carry the caps kicker, and sets its title in the
 * system face — so the map read as somebody else's screen wearing our colours.
 *
 * So this is `ScreenHeader` from `@/components/chrome`, `tone="inverse"`, the
 * same band Home, Order, Pay, Gift and Rewards start with: House Green, siren on
 * the left, controls on the right, kicker over title. The native bar is off
 * (`headerShown: false` in the root layout) because two headers on one screen is
 * the same information twice in two typefaces.
 *
 * ## What this file adds on top of the band
 *
 * The city rail, in the band's `children` slot. It stayed a rail rather than
 * folding into a menu — a menu hides every city behind a tap and gives no sense
 * that there *are* other cities, whereas a scrolling strip of chips shows the
 * whole set and its counts at a glance. On a screen whose entire job is choosing
 * between places, that discoverability is worth more than the purity.
 *
 * The rail is pulled back out to the screen edge with a negative margin, because
 * the band insets its children by `Gutter` and a horizontal scroller that starts
 * and stops 16pt short of the edge reads as broken rather than as inset — the
 * last chip is clipped by padding instead of running off the screen.
 *
 * ## It collapses with the sheet
 *
 * Two thirds of this band exists to help you *choose* a city — the title asking
 * the question and the rail answering it. Once the sheet is up and searchable
 * you have already chosen, so `collapsed` folds both away and slides the title
 * into the control row, buying back about 170 points of map at the moment the
 * map has least of it. The band never decides this itself; the screen passes it
 * down from how far the sheet is open.
 *
 * ## Why the height is stated rather than measured
 *
 * It used to be measured, with `onLayout`. That is correct for a band that sits
 * still and wrong for one that animates: a collapsing child fires layout on
 * every frame, so the screen re-rendered eighteen times per transition to move a
 * camera that only cares where the band ends up. The two resting heights are
 * arithmetic in `stage.ts` now, and the screen reports one of them.
 */

type Props = {
   filters: readonly CityFilter[];
   activeCityId: string;
   onSelectCity: (filter: CityFilter) => void;
   /** ALL-CAPS micro-label above the title. */
   kicker: string;
   title: string;
   /** The siren on the gate, a way out of the modal on `change`. */
   left: ReactNode;
   right: ReactNode;
   /** Folds the title and the rail away. Driven by the sheet's stage. */
   collapsed: boolean;
};

export function PickerHeader({
   filters,
   activeCityId,
   onSelectCity,
   kicker,
   title,
   left,
   right,
   collapsed,
}: Props) {
   return (
      /**
       * Absolute, so the map runs edge to edge underneath it and keeps its full
       * height for the camera. `box-none` because the band itself is not a
       * target — its buttons and its rail are, and a `View` that swallowed taps
       * here would put a dead strip across the top of the map.
       */
      <View style={styles.floating} pointerEvents="box-none">
         <ScreenHeader
            tone="inverse"
            kicker={kicker}
            title={title}
            left={left}
            right={right}
            collapsed={collapsed}
         >
            <View style={styles.rail}>
               <CityRail filters={filters} activeId={activeCityId} onSelect={onSelectCity} />
            </View>
         </ScreenHeader>
      </View>
   );
}

const styles = StyleSheet.create({
   floating: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
   },
   rail: {
      // Out to the screen edge, past the band's own gutter. See the note above.
      marginHorizontal: -Gutter,
      marginTop: Space.sm,
   },
});
