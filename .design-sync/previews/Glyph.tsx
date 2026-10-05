import { Glyph, ListRow, Theme } from 'starbucks';

/**
 * An icon inventory needs each mark to have presence, so the set cells centre
 * the glyph on a `Sizes.markDisc` of `Surface.sunken` — the same pairing
 * `EmptyState` draws its mark on.
 */
const disc = {
   width: Theme.Sizes.markDisc,
   height: Theme.Sizes.markDisc,
   borderRadius: Theme.Radius.pill,
   background: Theme.Surface.sunken,
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
} as const;

const shelf = {
   display: 'flex',
   gap: 12,
   alignItems: 'center',
   flexWrap: 'wrap',
} as const;

/**
 * The tab bar's five, at `IconSize.lg` in House Green.
 *
 * One drawing language throughout: 24pt box, stroke only, round caps and
 * joins, no fills. `rewards` is the one glyph allowed to be literal, because it
 * *is* the Stars currency; `order` is a cup rather than the reference app's
 * three rules, which are indistinguishable from a settings glyph at 23pt.
 */
export function TabSet() {
   return (
      <div style={shelf}>
         {(['home', 'order', 'pay', 'rewards', 'gift'] as const).map((id) => (
            <div key={id} style={disc}>
               <Glyph id={id} size={Theme.IconSize.lg} color={Theme.Action.selected} />
            </div>
         ))}
      </div>
   );
}

/**
 * The set behind the avatar, in the rows it was drawn for.
 *
 * These are 22–24pt row marks rather than tab icons with a label under them.
 * `crown` is Beverage Subscription — a standing arrangement, not a purchase, so
 * a repeat-arrow would read as "refresh" — and `arrowLeft` is Log Out, pointing
 * out rather than forward.
 */
export function AccountMenu() {
   const mark = (id: 'person' | 'crown' | 'pin' | 'article' | 'heart' | 'arrowLeft') => (
      <Glyph id={id} size={Theme.IconSize.lg} color={Theme.TextColor.primary} />
   );

   return (
      <div style={{ width: 380, background: Theme.Surface.raised }}>
         <ListRow leading={mark('person')} title="Profile" chevron onPress={() => {}} />
         <ListRow divided leading={mark('crown')} title="Beverage Subscription" chevron onPress={() => {}} />
         <ListRow divided leading={mark('pin')} title="Store Locator" chevron onPress={() => {}} />
         <ListRow divided leading={mark('article')} title="Coffee Stories" chevron onPress={() => {}} />
         <ListRow divided leading={mark('heart')} title="Help &amp; Support" chevron onPress={() => {}} />
         <ListRow divided leading={mark('arrowLeft')} title="Log Out" destructive chevron={false} onPress={() => {}} />
      </div>
   );
}

/**
 * The controls: search, scan-to-pay, the two halves of a `Stepper` (same bar,
 * so the pair reads as one control), the list chevron, close, and the tapered
 * menu rule — tapered because three equal rules read as a list.
 */
export function Controls() {
   return (
      <div style={shelf}>
         {(['search', 'scan', 'plus', 'minus', 'chevronRight', 'close', 'menu'] as const).map((id) => (
            <div key={id} style={disc}>
               <Glyph id={id} size={Theme.IconSize.lg} color={Theme.TextColor.secondary} />
            </div>
         ))}
      </div>
   );
}

/**
 * The four `IconSize` steps, ascending. Sizes between the steps make a row look
 * misaligned, so the token is the API: xs (16) inside a 30pt control, sm (18)
 * for a row chevron, md (20) for a button's leading glyph, lg (22) standalone.
 */
export function SizeSteps() {
   return (
      <div
         style={{
            display: 'inline-flex',
            gap: 28,
            alignItems: 'center',
            background: Theme.Surface.app,
            padding: 24,
         }}
      >
         <Glyph id="rewards" size={Theme.IconSize.xs} color={Theme.Accent.gold} />
         <Glyph id="rewards" size={Theme.IconSize.sm} color={Theme.Accent.gold} />
         <Glyph id="rewards" size={Theme.IconSize.md} color={Theme.Accent.gold} />
         <Glyph id="rewards" size={Theme.IconSize.lg} color={Theme.Accent.gold} />
      </div>
   );
}

/**
 * Weight is optical, not linear.
 *
 * Top row: `regular` / `medium` / `heavy` on the same 22pt pin. Bottom row: the
 * case the heavy weight exists for — a 16pt glyph that has to survive being
 * white on House Green, at `regular` then at `heavy`.
 */
export function Weights() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
         <div style={{ display: 'flex', gap: 28, alignItems: 'center', background: Theme.Surface.app, padding: 24 }}>
            <Glyph id="pin" size={Theme.IconSize.lg} color={Theme.TextColor.primary} strokeWidth={Theme.Stroke.regular} />
            <Glyph id="pin" size={Theme.IconSize.lg} color={Theme.TextColor.primary} strokeWidth={Theme.Stroke.medium} />
            <Glyph id="pin" size={Theme.IconSize.lg} color={Theme.TextColor.primary} strokeWidth={Theme.Stroke.heavy} />
         </div>
         <div
            style={{
               display: 'flex',
               gap: 28,
               alignItems: 'center',
               background: Theme.Surface.inverse,
               padding: 24,
            }}
         >
            <Glyph id="scan" size={Theme.IconSize.xs} color={Theme.TextColor.onDark} strokeWidth={Theme.Stroke.regular} />
            <Glyph id="scan" size={Theme.IconSize.xs} color={Theme.TextColor.onDark} strokeWidth={Theme.Stroke.heavy} />
         </div>
      </div>
   );
}
