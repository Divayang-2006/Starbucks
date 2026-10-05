import { CardBack } from 'starbucks';

/** The five editions from `cardStyles.ts` — the back gradient and magstripe differ. */
const HOUSE = {
   id: 'house-b',
   name: 'House',
   face: ['#00754A', '#002E1F'],
   back: ['#005C3A', '#001B12'],
   magstripe: '#001108',
   pattern: 'arcs',
   swatch: '#006241',
} as const;
const FOREST = {
   id: 'forest-b',
   name: 'Forest',
   face: ['#28463C', '#0C1A15'],
   back: ['#1C332B', '#060F0C'],
   magstripe: '#030A08',
   pattern: 'hairlines',
   swatch: '#1E3932',
} as const;
const JADE = {
   id: 'jade-b',
   name: 'Jade',
   face: ['#118F66', '#04402C'],
   back: ['#0B6B4B', '#022A1C'],
   magstripe: '#021911',
   pattern: 'dots',
   swatch: '#118F66',
} as const;
const SAGE = {
   id: 'sage-b',
   name: 'Sage',
   face: ['#5F7E6E', '#233830'],
   back: ['#465F52', '#141F1A'],
   magstripe: '#0C1310',
   pattern: 'arcs',
   swatch: '#5F7E6E',
} as const;
const RESERVE = {
   id: 'reserve-b',
   name: 'Reserve',
   face: ['#233B32', '#0A100D'],
   back: ['#182B24', '#050807'],
   magstripe: '#040605',
   pattern: 'hairlines',
   swatch: '#233B32',
} as const;

/** `phone` is stored as ten raw digits — the field def groups it as 98765 43210. */
const MEMBER = { name: 'Divayang Malseda', dob: '25101991', phone: '9876543210' };
const NO_PHONE = { name: 'Divayang Malseda', dob: '25101991', phone: '' };
const PARTIAL = { name: 'Divayang Malseda', dob: '25101991', phone: '98765' };

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

const CREAM = '#F2F0EB';

/** The finished back: magstripe, signature panel, and the property fine print. */
export function Claimed() {
   return (
      <div style={{ background: CREAM, padding: 28 }}>
         <CardBack {...wire(HOUSE, MEMBER, null, false)} />
      </div>
   );
}

/**
 * Question three. The card has just turned, the panel is the live field, and
 * the rule under it is lit — cream panel, ink text, ink caret.
 */
export function Blank() {
   return (
      <div style={{ background: CREAM, padding: 28 }}>
         <CardBack {...wire(HOUSE, NO_PHONE, 'phone', true)} />
      </div>
   );
}

/** Mid-answer: five digits in, before the grouping space appears at six. */
export function Typing() {
   return (
      <div style={{ background: CREAM, padding: 28 }}>
         <CardBack {...wire(HOUSE, PARTIAL, 'phone', true)} />
      </div>
   );
}

/** Every edition's back is a couple of stops darker than its face. */
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
         <CardBack {...wire(HOUSE, MEMBER, null, false)} />
         <CardBack {...wire(FOREST, MEMBER, null, false)} />
         <CardBack {...wire(JADE, MEMBER, null, false)} />
         <CardBack {...wire(SAGE, MEMBER, null, false)} />
         <CardBack {...wire(RESERVE, MEMBER, null, false)} />
      </div>
   );
}
