import { LoyaltyCard, PocketBack, PocketFront } from 'starbucks';

/**
 * The front panel is absolutely positioned 164pt into the flow's 300pt card
 * stage, so a preview has to supply that stage for it to land anywhere.
 */
function Stage({ children }: { children: React.ReactNode }) {
   return (
      <div style={{ background: '#006241', padding: 32 }}>
         <div style={{ position: 'relative', width: 252, height: 300 }}>{children}</div>
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
   id: 'house-pf',
   name: 'House',
   face: ['#00754A', '#002E1F'],
   back: ['#005C3A', '#001B12'],
   magstripe: '#001108',
   pattern: 'arcs',
   swatch: '#006241',
} as const;

const RESERVE = {
   id: 'reserve-pf',
   name: 'Reserve',
   face: ['#233B32', '#0A100D'],
   back: ['#182B24', '#050807'],
   magstripe: '#040605',
   pattern: 'hairlines',
   swatch: '#233B32',
} as const;

const MEMBER = { name: 'Divayang Malseda', dob: '25101991', phone: '9876543210' };
const REFS = { name: { current: null }, dob: { current: null }, phone: { current: null } };
const noop = () => {};

/** Where the card ends up: 120pt down, scaled to 0.9, square to the screen. */
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

/**
 * The lip on its own. That dip in the top edge is the one shape here
 * `borderRadius` cannot express, and the only reason this piece is SVG at all.
 */
export function Lip() {
   return (
      <Stage>
         <PocketFront />
      </Stage>
   );
}

/**
 * Over the card, with no back panel. Because it is rendered after the card in
 * JSX it paints on top — that, and nothing else, is what tucks the card in.
 */
export function OverTheCard() {
   return (
      <Stage>
         <LandedCard skin={HOUSE} />
         <PocketFront />
      </Stage>
   );
}

/** The finished wallet: back panel, card, front panel. */
export function InTheWallet() {
   return (
      <Stage>
         <PocketBack />
         <LandedCard skin={HOUSE} />
         <PocketFront />
      </Stage>
   );
}

/** The same wallet holding a Reserve card — the lip reads against any edition. */
export function ReserveInTheWallet() {
   return (
      <Stage>
         <PocketBack />
         <LandedCard skin={RESERVE} />
         <PocketFront />
      </Stage>
   );
}
