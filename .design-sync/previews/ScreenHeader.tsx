import {
   AvatarButton,
   Glyph,
   HeaderButton,
   PlaceholderBlock,
   ScreenHeader,
   Section,
   Sheet,
   Stat,
   StatStrip,
   StoreRow,
   Theme,
   Tile,
} from 'starbucks';

/**
 * The band stretches to its container, and `tone="inverse"` paints 400pt of
 * green *above* itself so an overscrolling ScrollView never exposes cream. On a
 * preview card that filler has nothing to hide behind, so every cell below
 * clips it — which is what `Screen` does on device.
 */
const band = {
   width: 380,
   overflow: 'hidden' as const,
   borderRadius: 16,
};

/**
 * The canonical band: a caps kicker labelling a one-word title, on House Green.
 *
 * Four of the five tabs open exactly like this — Rewards' header is
 * `kicker="Starbucks Rewards" title="Rewards"`, verbatim.
 */
export function Inverse() {
   return (
      <div style={band}>
         <ScreenHeader tone="inverse" kicker="Starbucks Rewards" title="Rewards" />
      </div>
   );
}

/**
 * The tone axis. `light` sits on the cream app background and is what a pushed
 * form screen uses; `inverse` is House Green and owns the status bar.
 */
export function Tones() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
         <div style={{ ...band, backgroundColor: Theme.Surface.app }}>
            <ScreenHeader kicker="Your account" title="Personal Information" />
         </div>
         <div style={band}>
            <ScreenHeader tone="inverse" kicker="Starbucks Pay" title="Pay" />
         </div>
      </div>
   );
}

/**
 * The control row: a leading back chevron, trailing shortcuts.
 *
 * A band with controls pads to `Space.sm` above them instead of `Space.lg` —
 * the row brings its own air, a bare title does not.
 */
export function WithControls() {
   return (
      <div style={band}>
         <ScreenHeader
            tone="inverse"
            kicker="Ordering from"
            title="Menu"
            left={
               <HeaderButton label="Back">
                  <Glyph
                     id="arrowLeft"
                     size={Theme.IconSize.md}
                     color={Theme.TextColor.onDark}
                     strokeWidth={Theme.Stroke.medium}
                  />
               </HeaderButton>
            }
            right={
               <>
                  <HeaderButton label="Search the menu">
                     <Glyph
                        id="search"
                        size={Theme.IconSize.md}
                        color={Theme.TextColor.onDark}
                        strokeWidth={Theme.Stroke.medium}
                     />
                  </HeaderButton>
                  <AvatarButton initials="DM" />
               </>
            }
         />
      </div>
   );
}

/**
 * Home, whole. Everything under the title is `children` inside the coloured
 * band: the store you are collecting from, then the three numbers that describe
 * the account. No kicker — a greeting needs no label, and the caps slot is
 * already spoken for eight points lower by the store row.
 */
export function HomeBand() {
   return (
      <div style={band}>
         <ScreenHeader
            tone="inverse"
            title="Hi, Divayang"
            right={
               <>
                  <HeaderButton label="Gift cards">
                     <Glyph
                        id="gift"
                        size={Theme.IconSize.md}
                        color={Theme.TextColor.onDark}
                        strokeWidth={Theme.Stroke.medium}
                     />
                  </HeaderButton>
                  <AvatarButton initials="DM" />
               </>
            }
         >
            <StoreRow
               tone="inverse"
               name="Koregaon Park"
               area="North Main Road"
               etaMins={6}
               onChange={() => {}}
               style={{ marginTop: Theme.Space.md }}
            />

            <StatStrip tone="inverse" style={{ marginTop: Theme.Space.lg }}>
               <Stat label="Stars" value="1,250" />
               <Stat label="Rewards" value="3" />
               <Stat label="Pay" value="₹1,240.00" />
            </StatStrip>
         </ScreenHeader>
      </div>
   );
}

/**
 * `sheetBelow` grows the band's bottom padding by the sheet's own overlap, so
 * the cream sheet's curve lands fully inside the green instead of cropping the
 * title. This seam is the app's strongest structural motif.
 */
export function SheetBelow() {
   return (
      <div style={{ ...band, backgroundColor: Theme.Surface.app, paddingBottom: 20 }}>
         <ScreenHeader
            tone="inverse"
            sheetBelow
            kicker="Send a little something"
            title="Gift Cards"
         />

         <Sheet>
            <Section kicker="Featured" title="Cards to send today" gutter>
               <Tile
                  media={<PlaceholderBlock height={88} />}
                  title="India Exclusive"
                  sub="Made here, for here."
                  action="Add Item"
               />
            </Section>
         </Sheet>
      </div>
   );
}
