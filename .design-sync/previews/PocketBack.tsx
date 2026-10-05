import { LoyaltyCard, PocketBack, PocketFront } from 'starbucks';

/**
 * Both wallet pieces are absolutely positioned inside the flow's 300pt card
 * stage — the back panel at 120, the front at 164 — so a preview has to supply
 * that stage. The empty band above the panel is not padding: it is the runway
 * the card falls down.
 */
function Stage({ children }: { children: React.ReactNode }) {
   return (
      <div style={{ background: '#006241', padding: 32 }}>
         <div style={{ position: 'relative', width: 252, height: 300 }}>{children}</div>
      </div>
   );
}

/**
 * The card at the end of its journey: 120pt down, scaled to 0.9, square to the
 * screen. Exactly what `cardStyle` interpolates to at `journey` 1.
 */
function LandedCard({ skin }: { skin: unknown }) {
   return (
      <div
         style={{
            position: 'absolute',
            top: 8,
            left: '50%',
            marginLeft: -118,
            transform: 'translateY(120px) scale(0.9)',
         }}
      >
         <LoyaltyCard
            flip={FRONT_UP}
            skin={skin}
            values={MEMBER}
            activeKey={null}
            editable={false}
            refs={REFS}
            onChange={noop}
            onFocus={noop}
            onBlur={noop}
            onSubmit={noop}
         />
      </div>
   );
}

const FRONT_UP = {
   value: 0,
   get: () => 0,
   set: () => {},
   addListener: () => {},
   removeListener: () => {},
   modify: () => {},
   _isReanimatedSharedValue: true,
} as never;

const HOUSE = {
   id: 'house-pb',
   name: 'House',
   face: ['#00754A', '#002E1F'],
   back: ['#005C3A', '#001B12'],
   magstripe: '#001108',
   pattern: 'arcs',
   swatch: '#006241',
} as const;

const MEMBER = { name: 'Divayang Malseda', dob: '25101991', phone: '9876543210' };
const REFS = { name: { current: null }, dob: { current: null }, phone: { current: null } };
const noop = () => {};

/**
 * On its own. A dark rounded rectangle and nothing more — everything that
 * `borderRadius` can express stays a plain View, which is why only the front
 * panel is SVG.
 */
export function Panel() {
   return (
      <Stage>
         <PocketBack />
      </Stage>
   );
}

/** With the card landed on it. The back panel is what the card is read against. */
export function BehindTheCard() {
   return (
      <Stage>
         <PocketBack />
         <LandedCard skin={HOUSE} />
      </Stage>
   );
}

/**
 * The finished stack. Paint order is the whole effect: back, then card, then
 * front — no masking anywhere, the card simply appears to be inside.
 */
export function InTheWallet() {
   return (
      <Stage>
         <PocketBack />
         <LandedCard skin={HOUSE} />
         <PocketFront />
      </Stage>
   );
}
