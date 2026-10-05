import { LoyaltyCard } from 'starbucks';

/**
 * `flip` is a Reanimated shared value owned by OnboardingFlow. A preview has no
 * animation to drive, so it hands the card a value pinned at rest: 0 is front
 * up, 1 is back up. Both ends of the turn sit at zero rotation, which is the
 * whole point of the two-half-turns design — so both are honest still frames.
 */
const at = (v: number) =>
   ({
      value: v,
      get: () => v,
      set: () => {},
      addListener: () => {},
      removeListener: () => {},
      modify: () => {},
      _isReanimatedSharedValue: true,
   }) as never;

const FRONT_UP = at(0);
const BACK_UP = at(1);

/** The card editions, from `cardStyles.ts` — the faces take a whole `skin`. */
const HOUSE = {
   id: 'house',
   name: 'House',
   face: ['#00754A', '#002E1F'],
   back: ['#005C3A', '#001B12'],
   magstripe: '#001108',
   pattern: 'arcs',
   swatch: '#006241',
} as const;

const RESERVE = {
   id: 'reserve',
   name: 'Reserve',
   face: ['#233B32', '#0A100D'],
   back: ['#182B24', '#050807'],
   magstripe: '#040605',
   pattern: 'hairlines',
   swatch: '#233B32',
} as const;

/** `dob` and `phone` are stored as raw digits — the field defs format them. */
const MEMBER = { name: 'Divayang Malseda', dob: '25101991', phone: '9876543210' };
const BLANK = { name: '', dob: '', phone: '' };

const REFS = { name: { current: null }, dob: { current: null }, phone: { current: null } };
const noop = () => {};

function wire(skin: unknown, values: unknown, activeKey: string | null, editable: boolean) {
   return {
      skin,
      values,
      activeKey,
      editable,
      refs: REFS,
      onChange: noop,
      onFocus: noop,
      onBlur: noop,
      onSubmit: noop,
   };
}

/** The collection screen is cream until the card drops into the wallet. */
const CREAM = '#F2F0EB';

/** The finished card, front up. Every line answered, member number resolved. */
export function Front() {
   return (
      <div style={{ background: CREAM, padding: 28 }}>
         <LoyaltyCard flip={FRONT_UP} {...wire(HOUSE, MEMBER, null, false)} />
      </div>
   );
}

/** `flip` at 1: the same object turned over, showing the signature panel. */
export function Back() {
   return (
      <div style={{ background: CREAM, padding: 28 }}>
         <LoyaltyCard flip={BACK_UP} {...wire(HOUSE, MEMBER, null, false)} />
      </div>
   );
}

/** Question one — empty lines, live inputs, the rule lit on NAME. */
export function Collecting() {
   return (
      <div style={{ background: CREAM, padding: 28 }}>
         <LoyaltyCard flip={FRONT_UP} {...wire(HOUSE, BLANK, 'name', true)} />
      </div>
   );
}

/** Question three — the card has turned and MOBILE NUMBER is the live line. */
export function CollectingBack() {
   return (
      <div style={{ background: CREAM, padding: 28 }}>
         <LoyaltyCard
            flip={BACK_UP}
            {...wire(HOUSE, { name: 'Divayang Malseda', dob: '25101991', phone: '' }, 'phone', true)}
         />
      </div>
   );
}

/** The picker recolours a live card: house green against the near-black Reserve. */
export function Editions() {
   return (
      <div style={{ background: CREAM, padding: 28, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
         <LoyaltyCard flip={FRONT_UP} {...wire(HOUSE, MEMBER, null, false)} />
         <LoyaltyCard flip={FRONT_UP} {...wire(RESERVE, MEMBER, null, false)} />
      </div>
   );
}
