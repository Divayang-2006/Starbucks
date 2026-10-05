import { AvatarButton, Glyph, HeaderButton, ScreenHeader, Theme } from 'starbucks';

/**
 * The control's fill is translucent white, so it only exists on House Green.
 * Every cell here backs it with green — a `ScreenHeader` where the composition
 * is the point, a plain swatch where the glyph sweep is.
 */
const green = {
   width: 348,
   backgroundColor: Theme.Surface.inverse,
   borderRadius: 16,
   padding: Theme.Space.base,
};

const mark = (id: 'gift' | 'search' | 'scan' | 'close' | 'arrowLeft' | 'heart') => (
   <Glyph
      id={id}
      size={Theme.IconSize.md}
      color={Theme.TextColor.onDark}
      strokeWidth={Theme.Stroke.medium}
   />
);

/**
 * The canonical use: a shortcut in the band's trailing slot.
 *
 * No shadow, because a shadow on green reads as dirt — the translucent fill is
 * already doing the separating.
 */
export function OnBand() {
   return (
      <div style={{ width: 380, overflow: 'hidden', borderRadius: 16 }}>
         <ScreenHeader
            tone="inverse"
            title="Hi, Divayang"
            right={<HeaderButton label="Gift cards">{mark('gift')}</HeaderButton>}
         />
      </div>
   );
}

/**
 * The children slot takes any glyph. These four are the band's real shortcuts:
 * gift cards, menu search, scan-to-pay, and dismissing a presented screen.
 */
export function Glyphs() {
   return (
      <div style={{ ...green, display: 'flex', gap: Theme.Space.md, alignItems: 'center' }}>
         <HeaderButton label="Gift cards">{mark('gift')}</HeaderButton>
         <HeaderButton label="Search the menu">{mark('search')}</HeaderButton>
         <HeaderButton label="Scan in store">{mark('scan')}</HeaderButton>
         <HeaderButton label="Close">{mark('close')}</HeaderButton>
      </div>
   );
}

/**
 * The leading slot — a back chevron on a pushed screen. Same 44pt disc, so a
 * screen that pushes and a screen that does not have identically placed titles.
 */
export function Back() {
   return (
      <div style={{ width: 380, overflow: 'hidden', borderRadius: 16 }}>
         <ScreenHeader
            tone="inverse"
            kicker="Rewards"
            title="Free Customized Mondays"
            left={<HeaderButton label="Back">{mark('arrowLeft')}</HeaderButton>}
            right={<HeaderButton label="Save this reward">{mark('heart')}</HeaderButton>}
         />
      </div>
   );
}

/**
 * Beside `AvatarButton`, which is Home's exact pairing. Both are 44pt discs and
 * both are legible without a shadow, but only one of them is a portrait — the
 * white outer ring is what keeps them from reading as two of the same control.
 */
export function WithAvatar() {
   return (
      <div style={{ ...green, display: 'flex', gap: Theme.Space.md, alignItems: 'center' }}>
         <HeaderButton label="Gift cards">{mark('gift')}</HeaderButton>
         <AvatarButton initials="DM" />
      </div>
   );
}
