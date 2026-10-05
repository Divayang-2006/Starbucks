import { CardLine } from 'starbucks';

/**
 * The three field defs from `fields.ts`. `CardLine` reads `label`,
 * `placeholder`, `format` and `input` off the def, so those are what a preview
 * has to supply — including the real formatters, since the printed value is
 * derived, never stored.
 */
const formatDob = (digits: string) => {
   const d = digits.slice(0, 8);
   let out = d.slice(0, 2);
   if (d.length > 2) out += `/${d.slice(2, 4)}`;
   if (d.length > 4) out += `/${d.slice(4, 8)}`;
   return out;
};

const formatPhone = (digits: string) => {
   const d = digits.slice(0, 10);
   return d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
};

const NAME = {
   key: 'name',
   face: 'front',
   label: 'NAME',
   placeholder: 'Your name',
   input: { autoCapitalize: 'words', autoCorrect: false, maxLength: 18 },
   format: (v: string) => v,
};

const DOB = {
   key: 'dob',
   face: 'front',
   label: 'DATE OF BIRTH',
   placeholder: 'DD/MM/YYYY',
   input: { keyboardType: 'number-pad', autoCorrect: false, maxLength: 10 },
   format: formatDob,
};

const PHONE = {
   key: 'phone',
   face: 'back',
   label: 'MOBILE NUMBER',
   placeholder: '00000 00000',
   input: { keyboardType: 'phone-pad', autoCorrect: false, maxLength: 11 },
   format: formatPhone,
};

const REF = { current: null };
const noop = () => {};

const wire = { inputRef: REF, onChangeText: noop, onFocus: noop, onBlur: noop, onSubmit: noop };

/**
 * The card interior, near enough: house green at the face's own 14pt padding
 * and 9pt line gap. Lines are printed on a gradient in the real component —
 * this is only enough surface to judge the `onCard` tone against.
 */
function OnCardPlate({ children }: { children: React.ReactNode }) {
   return (
      <div style={{ background: '#F2F0EB', padding: 28 }}>
         <div
            style={{
               width: 236,
               background: '#00754A',
               borderRadius: 14,
               padding: 14,
               display: 'flex',
               flexDirection: 'column',
               gap: 9,
            }}
         >
            {children}
         </div>
      </div>
   );
}

/** The cream signature panel from the card back, at its own 3pt radius. */
function PanelPlate({ children }: { children: React.ReactNode }) {
   return (
      <div style={{ background: '#F2F0EB', padding: 28 }}>
         <div style={{ width: 236, background: '#005C3A', borderRadius: 14, padding: 14 }}>
            <div
               style={{
                  background: '#F2F0EB',
                  borderRadius: 3,
                  padding: '5px 9px 4px',
                  display: 'flex',
                  flexDirection: 'column',
               }}
            >
               {children}
            </div>
         </div>
      </div>
   );
}

/**
 * The two front lines as the flow shows them at question two: NAME answered and
 * idle, DATE OF BIRTH live. Only the active line carries a rule — an idle rule
 * would make the card read as a form printed on a card rather than as a card.
 */
export function OnCard() {
   return (
      <OnCardPlate>
         <CardLine def={NAME} value="Divayang Malseda" active={false} editable {...wire} />
         <CardLine def={DOB} value="" active editable {...wire} />
      </OnCardPlate>
   );
}

/**
 * The four states of one line, in order: empty and idle, empty and active,
 * answered and active, answered and idle. The rule is the only thing that
 * moves — the line box is pinned so nothing shifts by a pixel.
 */
export function States() {
   return (
      <OnCardPlate>
         <CardLine def={DOB} value="" active={false} editable {...wire} />
         <CardLine def={DOB} value="" active editable {...wire} />
         <CardLine def={DOB} value="25101991" active editable {...wire} />
         <CardLine def={DOB} value="25101991" active={false} editable {...wire} />
      </OnCardPlate>
   );
}

/**
 * `tone="onPanel"` for the signature panel: ink text, ink rule, house-green
 * caret. This is the one place on a physical card that exists to be written on,
 * which is why the phone number lives here and nowhere else.
 */
export function OnPanel() {
   return (
      <PanelPlate>
         <CardLine def={PHONE} value="9876543210" active tone="onPanel" editable last {...wire} />
      </PanelPlate>
   );
}

/**
 * `editable` swaps a live `TextInput` for static `Text`. Both share the same
 * pinned line box, so the wallet card and the form card print identically.
 */
export function EditableAndStatic() {
   return (
      <OnCardPlate>
         <CardLine def={NAME} value="Ananya Sharma" active={false} editable {...wire} />
         <CardLine def={NAME} value="Ananya Sharma" active={false} editable={false} {...wire} />
      </OnCardPlate>
   );
}
