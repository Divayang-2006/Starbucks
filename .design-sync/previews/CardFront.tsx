import { CardFront } from 'starbucks';

/**
 * The five editions from `cardStyles.ts`. Not exported from the package — a
 * face takes the whole `skin` object, so a preview has to name one.
 */
const HOUSE = {
   id: 'house',
   name: 'House',
   face: ['#00754A', '#002E1F'],
   back: ['#005C3A', '#001B12'],
   magstripe: '#001108',
   pattern: 'arcs',
   swatch: '#006241',
} as const;
const FOREST = {
   id: 'forest',
   name: 'Forest',
   face: ['#28463C', '#0C1A15'],
   back: ['#1C332B', '#060F0C'],
   magstripe: '#030A08',
   pattern: 'hairlines',
   swatch: '#1E3932',
} as const;
const JADE = {
   id: 'jade',
   name: 'Jade',
   face: ['#118F66', '#04402C'],
   back: ['#0B6B4B', '#022A1C'],
   magstripe: '#021911',
   pattern: 'dots',
   swatch: '#118F66',
} as const;
const SAGE = {
   id: 'sage',
   name: 'Sage',
   face: ['#5F7E6E', '#233830'],
   back: ['#465F52', '#141F1A'],
   magstripe: '#0C1310',
   pattern: 'arcs',
   swatch: '#5F7E6E',
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

/** `dob` is stored as raw digits — the field def formats it into 25/10/1991. */
const MEMBER = { name: 'Divayang Malseda', dob: '25101991', phone: '9876543210' };
const BLANK = { name: '', dob: '', phone: '' };
const HALF = { name: 'Ananya Sharma', dob: '', phone: '' };

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

/** The collection screen is cream right up until the card drops into the wallet. */
const CREAM = '#F2F0EB';

/** The finished face. Both lines answered, so the member number has resolved. */
export function Claimed() {
   return (
      <div style={{ background: CREAM, padding: 28 }}>
         <CardFront {...wire(HOUSE, MEMBER, null, false)} />
      </div>
   );
}

/**
 * Question one. Live inputs, both lines still on their placeholders, and the
 * rule lit under NAME only — the cheapest way to say "the keyboard is here".
 */
export function Blank() {
   return (
      <div style={{ background: CREAM, padding: 28 }}>
         <CardFront {...wire(HOUSE, BLANK, 'name', true)} />
      </div>
   );
}

/**
 * Question two. The name is in, so the member number's second group has
 * resolved from XXXX to digits — the card visibly finishing itself.
 */
export function MidForm() {
   return (
      <div style={{ background: CREAM, padding: 28 }}>
         <CardFront {...wire(HOUSE, HALF, 'dob', true)} />
      </div>
   );
}

/** The whole picker, printed. Every edition is dark-to-mid so white stays legible. */
export function Editions() {
   return (
      <div
         style={{
            background: CREAM,
            padding: 24,
            display: 'flex',
            gap: 18,
            flexWrap: 'wrap',
            width: 780,
         }}
      >
         <CardFront {...wire(HOUSE, MEMBER, null, false)} />
         <CardFront {...wire(FOREST, MEMBER, null, false)} />
         <CardFront {...wire(JADE, MEMBER, null, false)} />
         <CardFront {...wire(SAGE, MEMBER, null, false)} />
         <CardFront {...wire(RESERVE, MEMBER, null, false)} />
      </div>
   );
}
