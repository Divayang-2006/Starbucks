import { HoloTilt, LoyaltyCard } from 'starbucks';

/**
 * `flip` pinned at 0 — front up, at rest. HoloTilt reads DeviceMotion, which a
 * browser has no sensor for, so the tilt itself stays neutral. That is the
 * component's own documented fallback, not a broken cell: the card sits still
 * and the sheen sits centred.
 */
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
   id: 'house-h',
   name: 'House',
   face: ['#00754A', '#002E1F'],
   back: ['#005C3A', '#001B12'],
   magstripe: '#001108',
   pattern: 'arcs',
   swatch: '#006241',
} as const;

const RESERVE = {
   id: 'reserve-h',
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

function card(skin: unknown) {
   return {
      skin,
      values: MEMBER,
      activeKey: null,
      editable: false,
      refs: REFS,
      onChange: noop,
      onFocus: noop,
      onBlur: noop,
      onSubmit: noop,
   };
}

/** By the time the tilt wakes, the screen has turned House Green. */
const GREEN = '#006241';

/**
 * The welcome screen: the claimed card wrapped exactly as `OnboardingFlow`
 * wraps it. `enabled` gates the sheen, so the light band is present and
 * centred — on a device it slides against the lean.
 */
export function Claimed() {
   return (
      <div style={{ background: GREEN, padding: 40 }}>
         <HoloTilt enabled>
            <LoyaltyCard flip={FRONT_UP} {...card(HOUSE)} />
         </HoloTilt>
      </div>
   );
}

/**
 * `enabled={false}` — the whole form. The sheen does not exist, and the card is
 * flat, because while you are typing the card is a form and not a trinket.
 */
export function Resting() {
   return (
      <div style={{ background: GREEN, padding: 40 }}>
         <HoloTilt enabled={false}>
            <LoyaltyCard flip={FRONT_UP} {...card(HOUSE)} />
         </HoloTilt>
      </div>
   );
}

/**
 * Off, then on. The sheen is the entire difference — and under
 * react-native-web the band overshoots the card's own rounded clip, so the
 * lit card carries a faint diagonal spill to its right that a device does not.
 */
export function Gated() {
   return (
      <div style={{ background: GREEN, padding: 32, display: 'flex', gap: 60, flexWrap: 'wrap' }}>
         <HoloTilt enabled={false}>
            <LoyaltyCard flip={FRONT_UP} {...card(HOUSE)} />
         </HoloTilt>
         <HoloTilt enabled>
            <LoyaltyCard flip={FRONT_UP} {...card(HOUSE)} />
         </HoloTilt>
      </div>
   );
}

/** On the near-black Reserve face, where the band has the most to catch. */
export function OnReserve() {
   return (
      <div style={{ background: GREEN, padding: 40 }}>
         <HoloTilt enabled>
            <LoyaltyCard flip={FRONT_UP} {...card(RESERVE)} />
         </HoloTilt>
      </div>
   );
}
