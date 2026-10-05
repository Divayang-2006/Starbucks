import { ChipRow, Segmented, Theme } from 'starbucks';

const REWARD_VIEWS = ['Available Rewards', 'Redeem Rewards'];
const MENU_TABS = ['Drinks', 'Food', 'At Home Coffee', 'Merchandise'];
const CATEGORIES = ['New Launch', 'Best Seller', 'Drinks', 'Food', 'Merch', 'At Home Coffee'];

/**
 * Two views of one list, exactly one of them showing. That is what `Segmented`
 * is for — it *partitions* a set, where a `ChipRow` filters across one.
 *
 * The rule is always laid out and merely transparent when inactive; rendering it
 * only on the selected segment would shift every label by two points as the
 * selection moved.
 */
export function Default() {
   return (
      <div style={{ width: 380 }}>
         <Segmented items={REWARD_VIEWS} selectedIndex={0} onChange={() => {}} />
      </div>
   );
}

/**
 * The selection axis, statically: the same strip at each index. Only the rule
 * and the label's colour move — House Green under the live one, matching a
 * selected chip, because it is the same "this is the state" green.
 */
export function Selection() {
   return (
      <div style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 24 }}>
         <Segmented items={REWARD_VIEWS} selectedIndex={0} onChange={() => {}} />
         <Segmented items={REWARD_VIEWS} selectedIndex={1} onChange={() => {}} />
      </div>
   );
}

/**
 * `scroll` for a set whose labels overflow — the four menu tabs do not fit a
 * 375pt screen, and the peek of the next one is the affordance that says so.
 * Shown at 300pt so the overflow is real rather than described.
 */
export function Scrolling() {
   return (
      <div style={{ width: 300, overflow: 'hidden' }}>
         <Segmented items={MENU_TABS} selectedIndex={0} scroll onChange={() => {}} />
      </div>
   );
}

/**
 * The pairing the component was written to make unambiguous, as Order stacks it:
 * the tabs partition the catalogue (you are looking at Drinks *or* at Food), the
 * chips below cut across whichever partition you are in. Two controls, two jobs.
 */
export function WithChipRow() {
   return (
      <div
         style={{
            width: 380,
            display: 'flex',
            flexDirection: 'column',
            gap: Theme.Space.lg,
            backgroundColor: Theme.Surface.app,
            borderRadius: 16,
            paddingTop: Theme.Space.lg,
            paddingBottom: Theme.Space.lg,
            overflow: 'hidden',
         }}
      >
         <Segmented items={MENU_TABS} selectedIndex={0} scroll onChange={() => {}} />
         <ChipRow items={CATEGORIES} selectedIndex={0} onSelect={() => {}} />
      </div>
   );
}
