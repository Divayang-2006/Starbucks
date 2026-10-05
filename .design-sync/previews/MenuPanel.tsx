import { MenuBackdrop, MenuPanel } from 'starbucks';

import { MENU_ITEMS } from '@/components/fluid-menu/items';

/**
 * `progress` pinned at one point of the 0 → 1 travel.
 *
 * Everything in the panel is derived from this one value — the chrome's fade and
 * scale, the caption, each row's staggered arrival — so a value that never moves
 * renders a real, settled frame rather than a mock of one. It is what the panel
 * sees when a drag stops and holds.
 */
const progressAt = (p: number) =>
   ({
      value: p,
      get: () => p,
      set: () => {},
      addListener: () => {},
      removeListener: () => {},
      modify: () => {},
   }) as never;

/**
 * The panel lays out `absoluteFill` under the app card, so it needs a phone-sized
 * box; `MenuBackdrop` is the green field it is always drawn on.
 */
function Phone({ children }: { children: React.ReactNode }) {
   return (
      <div style={{ position: 'relative', width: 390, height: 620, overflow: 'hidden', display: 'flex' }}>
         <MenuBackdrop />
         {children}
      </div>
   );
}

/**
 * Fully open: the two round controls, the store caption, and all nine rows.
 *
 * Grouping is drawn with whitespace, never rules — six things you own, two you
 * read, and the way out. The rows are centred rather than pinned under the
 * controls so a tall device does not leave a pool of dead green at the bottom,
 * and each row's tap target runs off the right edge, under where the app card
 * sits.
 */
export function Open() {
   return (
      <Phone>
         <MenuPanel
            items={MENU_ITEMS}
            progress={progressAt(1)}
            initials="DM"
            caption="Collecting from Koregaon Park"
            modal
            onSelect={() => {}}
            onProfile={() => {}}
            onClose={() => {}}
         />
      </Phone>
   );
}

/**
 * The drag stopped and held at 45%, which is where the panel's internal order is
 * legible: the controls are already fully in (they finish by 0.4), the caption is
 * three quarters there, and the rows are still arriving from the left in an
 * index-shifted ramp. The frame leads, the content follows — content arriving
 * before its frame reads as a glitch.
 */
export function HeldMidDrag() {
   return (
      <Phone>
         <MenuPanel
            items={MENU_ITEMS}
            progress={progressAt(0.45)}
            initials="DM"
            caption="Collecting from Koregaon Park"
            onSelect={() => {}}
            onProfile={() => {}}
            onClose={() => {}}
         />
      </Phone>
   );
}

/**
 * `unread` puts a gold dot on the Account control — the Stars accent, and the
 * only warm note this green takes. Off by default on purpose: the dot is a claim
 * about the account, and a claim nothing can retract is decoration in a signal's
 * clothes.
 */
export function Unread() {
   return (
      <Phone>
         <MenuPanel
            items={MENU_ITEMS}
            progress={progressAt(1)}
            initials="DM"
            caption="Collecting from Koregaon Park"
            unread
            onSelect={() => {}}
            onProfile={() => {}}
            onClose={() => {}}
         />
      </Phone>
   );
}

/**
 * No `initials` — the state the app is in before a member is loaded — falls back
 * to the person glyph rather than an empty disc. The caption still names the
 * store, because collection is a property of the session, not the member.
 */
export function NoInitials() {
   return (
      <Phone>
         <MenuPanel
            items={MENU_ITEMS}
            progress={progressAt(1)}
            caption="Collecting from Koregaon Park"
            onSelect={() => {}}
            onProfile={() => {}}
            onClose={() => {}}
         />
      </Phone>
   );
}
