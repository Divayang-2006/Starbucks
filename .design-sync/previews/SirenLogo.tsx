import { SirenLogo } from 'starbucks';

const CREAM = '#F2F0EB';
const GREEN = '#006241';

/**
 * The mark at the four sizes this app actually prints it: 18 in the welcome
 * badge, 28 and 44 for general use, 118 as the card watermark. One path on a
 * 24x24 box, so it stays crisp at every one of them.
 */
export function Sizes() {
   return (
      <div
         style={{
            background: GREEN,
            padding: 40,
            display: 'flex',
            gap: 28,
            alignItems: 'flex-end',
         }}
      >
         <SirenLogo width={18} />
         <SirenLogo width={28} />
         <SirenLogo width={44} />
         <SirenLogo width={72} />
      </div>
   );
}

/** `color` is the whole API surface besides size. Ink and house green on cream, white on green. */
export function Colours() {
   return (
      <div style={{ display: 'flex' }}>
         <div style={{ background: CREAM, padding: 40, display: 'flex', gap: 28 }}>
            <SirenLogo width={56} color="#1E3932" />
            <SirenLogo width={56} color="#006241" />
         </div>
         <div style={{ background: GREEN, padding: 40 }}>
            <SirenLogo width={56} />
         </div>
      </div>
   );
}

/**
 * How `CardFront` prints it: 118pt of white at 16%, so it reads as a press mark
 * rather than a sticker. On the card the edge trims it — here it is whole.
 */
export function Watermark() {
   return (
      <div style={{ background: '#00754A', padding: 32, width: 236, height: 148 }}>
         <SirenLogo width={118} color="rgba(255,255,255,0.16)" />
      </div>
   );
}

/** The default: 40pt, white. What you get with no props at all. */
export function Default() {
   return (
      <div style={{ background: GREEN, padding: 40 }}>
         <SirenLogo />
      </div>
   );
}
