import { StageMock } from 'starbucks';

/**
 * `StageMock` is a whole screen — `Screen` owns the scroll and the background —
 * so every cell hands it a phone-sized flex box to fill.
 */
function Phone({
   width = 390,
   height = 648,
   children,
}: {
   width?: number;
   height?: number;
   children: React.ReactNode;
}) {
   return (
      <div style={{ width, height, display: 'flex', overflow: 'hidden' }}>{children}</div>
   );
}

/**
 * The app, as far as the menu prototype is concerned.
 *
 * Not an import of Home and not a grey rectangle: the same `Screen` →
 * `ScreenHeader` → `Sheet` → `Tile`/`ProductCard` stack Home is built from, so a
 * change to any of those lands here for free. What shrinks when the card slides
 * away is what you will be looking at in the app.
 */
export function Home() {
   return (
      <Phone>
         <StageMock
            greeting="Hi, Divayang"
            storeName="Koregaon Park"
            onMenu={() => {}}
            onExit={() => {}}
         />
      </Phone>
   );
}

/**
 * `picked` echoes the last menu row back into the sheet instead of navigating.
 *
 * The harness is about whether the movement is right, so the real destinations
 * stay with the layout that mounts the real menu — but a tap that lands nowhere
 * proves nothing, and this line is how a tap target gets verified.
 */
export function MenuTapEcho() {
   return (
      <Phone>
         <StageMock
            greeting="Hi, Divayang"
            storeName="Koregaon Park"
            picked="Gift Cards"
            onMenu={() => {}}
            onExit={() => {}}
         />
      </Phone>
   );
}

/**
 * Opened cold, with no session behind it: the lab route falls back to "Hi there"
 * and the default store rather than rendering a header with holes in it. The
 * prototype has to work standalone — that is most of why it is a route of its own.
 */
export function ColdOpen() {
   return (
      <Phone>
         <StageMock
            greeting="Hi there"
            storeName="Koregaon Park"
            onMenu={() => {}}
            onExit={() => {}}
         />
      </Phone>
   );
}

/**
 * The same screen on a small phone. The rails keep their absolute card widths so
 * the peek of the next card — the affordance that says "this scrolls" — survives
 * the narrower frame instead of being scaled away, and the static tab pill still
 * spans the full width under it.
 */
export function SmallPhone() {
   return (
      <Phone width={320} height={568}>
         <StageMock
            greeting="Hi, Divayang"
            storeName="Phoenix Marketcity"
            onMenu={() => {}}
            onExit={() => {}}
         />
      </Phone>
   );
}
