import { ConfirmButton } from 'starbucks';

/*
 * The gate's one button. It has no width of its own — it stretches to whatever
 * column it is dropped into — so every cell fixes a width, and the last one
 * makes that the point.
 */
const WHITE = '#FFFFFF';
const CREAM = '#F7F5F0';
const HAIR = '#E3DFD6';
const SECONDARY = '#5C6A65';
const TERTIARY = '#79817E';
const WARNING = '#B26B00';

/**
 * The two labels the picker actually ships, and they are not cosmetic variants:
 * an open store gets the order verb, a closed one gets the weaker "set as my
 * store", because ordering is the thing that is unavailable, not the choice.
 */
export function Labels() {
   return (
      <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 16 }}>
         <ConfirmButton label="Order from here" onPress={() => {}} />
         <ConfirmButton label="Set as my store" onPress={() => {}} />
      </div>
   );
}

/**
 * Where it lives: pinned in the confirm sheet's footer above the home indicator,
 * with the closed-store caution line the sheet puts over it. The footer's
 * hairline and padding are the sheet's, not the button's.
 */
export function SheetFooter() {
   return (
      <div
         style={{
            width: 380,
            background: WHITE,
            border: `1px solid ${HAIR}`,
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
         }}>
         <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: '#14231E' }}>
               Select Citywalk
            </span>
            <span style={{ fontFamily: 'Urbanist_400Regular', fontSize: 14, color: SECONDARY }}>
               Saket District Centre, New Delhi · 1174.6 km away
            </span>
         </div>

         <div
            style={{
               borderTop: `1px solid ${HAIR}`,
               padding: 20,
               display: 'flex',
               flexDirection: 'column',
               gap: 12,
            }}>
            <span
               style={{
                  fontFamily: 'Urbanist_500Medium',
                  fontSize: 13,
                  color: WARNING,
                  textAlign: 'center',
               }}>
               Closed right now — you can still set it as your store and browse.
            </span>
            <ConfirmButton label="Set as my store" onPress={() => {}} />
         </div>
      </div>
   );
}

/**
 * It commits immediately — no confirming animation, no delay, because the router
 * is already replacing the screen the moment the session updates. The only
 * feedback is the press itself: a scale to 0.975 and a fill swap to
 * `Action.primaryPressed`, both of which belong to the finger rather than to the
 * transition. Resting state on the two surfaces it can appear on.
 */
export function OnSurfaces() {
   return (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
         <div
            style={{
               width: 260,
               background: WHITE,
               border: `1px solid ${HAIR}`,
               borderRadius: 16,
               padding: 20,
               display: 'flex',
               flexDirection: 'column',
               gap: 10,
            }}>
            <span style={{ fontFamily: 'Urbanist_500Medium', fontSize: 11, letterSpacing: 1.1, color: TERTIARY }}>
               ON RAISED
            </span>
            <ConfirmButton label="Order from here" onPress={() => {}} />
         </div>
         <div
            style={{
               width: 260,
               background: CREAM,
               borderRadius: 16,
               padding: 20,
               display: 'flex',
               flexDirection: 'column',
               gap: 10,
            }}>
            <span style={{ fontFamily: 'Urbanist_500Medium', fontSize: 11, letterSpacing: 1.1, color: TERTIARY }}>
               ON APP
            </span>
            <ConfirmButton label="Order from here" onPress={() => {}} />
         </div>
      </div>
   );
}

/**
 * No width prop and no `full` flag — it takes the column it is given, at a fixed
 * `Sizes.buttonHeight` of 52 and a pill radius. Three widths, one height.
 */
export function StretchesToContainer() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
         <div style={{ width: 380, display: 'flex', flexDirection: 'column' }}>
            <ConfirmButton label="Order from here" onPress={() => {}} />
         </div>
         <div style={{ width: 280, display: 'flex', flexDirection: 'column' }}>
            <ConfirmButton label="Order from here" onPress={() => {}} />
         </div>
         <div style={{ width: 180, display: 'flex', flexDirection: 'column' }}>
            <ConfirmButton label="Order" onPress={() => {}} />
         </div>
      </div>
   );
}
