import { CardFront, StylePicker } from 'starbucks';

const CREAM = '#F2F0EB';
const noop = () => {};

const RESERVE = {
   id: 'reserve-sp',
   name: 'Reserve',
   face: ['#233B32', '#0A100D'],
   back: ['#182B24', '#050807'],
   magstripe: '#040605',
   pattern: 'hairlines',
   swatch: '#233B32',
} as const;

const JADE = {
   id: 'jade-sp',
   name: 'Jade',
   face: ['#118F66', '#04402C'],
   back: ['#0B6B4B', '#022A1C'],
   magstripe: '#021911',
   pattern: 'dots',
   swatch: '#118F66',
} as const;

const MEMBER = { name: 'Divayang Malseda', dob: '25101991', phone: '9876543210' };
const REFS = { name: { current: null }, dob: { current: null }, phone: { current: null } };

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

/** The default edition. The ring marks the selection; the name reads under it. */
export function Default() {
   return (
      <div style={{ background: CREAM, padding: 40, width: 346 }}>
         <StylePicker value="house" onChange={noop} />
      </div>
   );
}

/**
 * The value axis, swept. All five swatches are Starbucks greens — the picker
 * moves through the family, from bright house green out to a near-black
 * Reserve, and never leaves it.
 */
export function EveryEdition() {
   return (
      <div
         style={{
            background: CREAM,
            padding: 32,
            width: 346,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
         }}
      >
         <StylePicker value="house" onChange={noop} />
         <StylePicker value="forest" onChange={noop} />
         <StylePicker value="jade" onChange={noop} />
         <StylePicker value="sage" onChange={noop} />
         <StylePicker value="reserve" onChange={noop} />
      </div>
   );
}

/**
 * Where it actually sits: under the card for the whole flow, so anyone who
 * cares can recolour while they answer and anyone who doesn't never has to
 * acknowledge it. Personalisation at zero cost to the funnel.
 */
export function UnderTheCard() {
   return (
      <div
         style={{
            background: CREAM,
            padding: 32,
            width: 346,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 28,
         }}
      >
         <CardFront {...card(JADE)} />
         <StylePicker value="jade" onChange={noop} />
      </div>
   );
}

/** The far end of the family: Reserve selected, with the card it produces. */
export function Reserve() {
   return (
      <div
         style={{
            background: CREAM,
            padding: 32,
            width: 346,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 28,
         }}
      >
         <CardFront {...card(RESERVE)} />
         <StylePicker value="reserve" onChange={noop} />
      </div>
   );
}
