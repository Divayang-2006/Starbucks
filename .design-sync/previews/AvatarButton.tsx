import { AvatarButton, Glyph, HeaderButton, ScreenHeader, Theme } from 'starbucks';

/**
 * The white outer ring exists to hold the disc off House Green, so every cell
 * backs it with green — the ring is invisible on cream and the component would
 * read as half of itself.
 */
const green = {
   width: 348,
   backgroundColor: Theme.Surface.inverse,
   borderRadius: 16,
   padding: Theme.Space.base,
};

/**
 * Double ring, white outside green. The entrance to the Account stack, and a
 * fixed 44pt target — the white outer ring exists to hold it off the House Green
 * behind it rather than to decorate it.
 */
export function Default() {
   return (
      <div style={{ ...green, width: 76 }}>
         <AvatarButton initials="DM" />
      </div>
   );
}

/**
 * Callers derive the initials; this component does not guess. One character, two
 * characters, and the star Home falls back to before anyone has joined.
 */
export function Initials() {
   return (
      <div style={{ ...green, display: 'flex', gap: Theme.Space.md, alignItems: 'center' }}>
         <AvatarButton initials="D" label="Divayang" />
         <AvatarButton initials="DM" label="Divayang Malseda" />
         <AvatarButton initials="AK" label="Aarav Kulkarni" />
         <AvatarButton initials="★" label="Join Starbucks Rewards" />
      </div>
   );
}

/**
 * Home's trailing pair. Account is reached from here and nowhere else — it is
 * not a tab — so this button is the whole entrance to the account menu, which
 * is why it gets a ring and the gift shortcut beside it does not.
 */
export function OnBand() {
   return (
      <div style={{ width: 380, overflow: 'hidden', borderRadius: 16 }}>
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
         />
      </div>
   );
}
