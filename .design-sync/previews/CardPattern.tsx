import { CardFront } from 'starbucks';

/**
 * `CardPattern` returns bare SVG children, so it only exists inside a card
 * face's own `<Svg>` — these cells show it where it is actually printed.
 *
 * The three editions below are identical apart from `pattern`, so the texture
 * is the only thing changing from cell to cell. At print size it is meant to be
 * almost subliminal (7% white on a dark face), so the single-pattern cells are
 * magnified; `Sweep` shows all three at the size they really ship.
 */
const face = ['#00754A', '#002E1F'] as const;
const back = ['#005C3A', '#001B12'] as const;

const skin = (id: string, pattern: string) =>
   ({ id, name: id, face, back, magstripe: '#001108', pattern, swatch: '#006241' }) as const;

const MEMBER = { name: 'Divayang Malseda', dob: '25101991', phone: '9876543210' };
const REFS = { name: { current: null }, dob: { current: null }, phone: { current: null } };
const noop = () => {};

const wiring = {
   values: MEMBER,
   activeKey: null,
   editable: false,
   refs: REFS,
   onChange: noop,
   onFocus: noop,
   onBlur: noop,
   onSubmit: noop,
};

const CREAM = '#F2F0EB';

/** 2x, top-left anchored — the card is 236x148, so the plate is sized for it. */
function Magnified({ children }: { children: React.ReactNode }) {
   return (
      <div style={{ background: CREAM, padding: 24 }}>
         <div style={{ width: 472, height: 296, overflow: 'hidden' }}>
            <div style={{ transform: 'scale(2)', transformOrigin: 'top left' }}>{children}</div>
         </div>
      </div>
   );
}

/** Guilloché: concentric rings struck from off the right edge. House and Sage print this. */
export function Arcs() {
   return (
      <Magnified>
         <CardFront skin={skin('pattern-arcs', 'arcs')} {...wiring} />
      </Magnified>
   );
}

/** 45deg rulings, the densest of the three. Forest and Reserve print this. */
export function Hairlines() {
   return (
      <Magnified>
         <CardFront skin={skin('pattern-hairlines', 'hairlines')} {...wiring} />
      </Magnified>
   );
}

/** A 24pt dot grid — the one pattern that reads as a field rather than a sweep. Jade prints it. */
export function Dots() {
   return (
      <Magnified>
         <CardFront skin={skin('pattern-dots', 'dots')} {...wiring} />
      </Magnified>
   );
}

/** All three at print size, one edition, so the intended subtlety is on show. */
export function Sweep() {
   return (
      <div style={{ background: CREAM, padding: 24, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
         <CardFront skin={skin('sweep-arcs', 'arcs')} {...wiring} />
         <CardFront skin={skin('sweep-hairlines', 'hairlines')} {...wiring} />
         <CardFront skin={skin('sweep-dots', 'dots')} {...wiring} />
      </div>
   );
}
