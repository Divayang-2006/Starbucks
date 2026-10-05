import { Amenities, ContactRows, PlacesAttribution, Theme } from 'starbucks';

/** The app's cream, so the white sheet this line signs off reads as a surface. */
const page = {
   width: 390,
   background: Theme.Surface.app,
   padding: 16,
   display: 'flex',
   flexDirection: 'column',
} as const;

/** `Surface.raised` — the store sheet. */
const sheet = {
   background: Theme.Surface.raised,
   borderRadius: 20,
   padding: 16,
   display: 'flex',
   flexDirection: 'column',
} as const;

const PUNE_AMENITIES = [
   { id: 'payment_type_mobile_nfc', label: 'Tap to pay', glyph: 'pay' },
   { id: 'offering_vegetarian_options', label: 'Vegetarian options', glyph: 'heart' },
   { id: 'known_for_coffee', label: 'Known for coffee', glyph: 'rewards' },
];

/**
 * One line, centred, in `micro` at `TextColor.tertiary`.
 *
 * It is compliance as much as it is manners: Mapbox's terms require the source
 * to be credited wherever its data is displayed, so this ships with every store
 * sheet whose lower half came from the Places API.
 */
export function Default() {
   return (
      <div style={page}>
         <div style={sheet}>
            <PlacesAttribution />
         </div>
      </div>
   );
}

/**
 * Where it actually lands — the last thing in the sheet, under everything it is
 * crediting.
 *
 * The row above it is `ContactRows`, which brings its own top hairline; the
 * attribution adds only `Space.sm` of its own padding and deliberately no rule,
 * so the credit reads as a footnote to the block rather than as one more
 * section in it.
 */
export function UnderTheFacts() {
   return (
      <div style={page}>
         <div style={{ ...sheet, gap: 24 }}>
            <Amenities facts={PUNE_AMENITIES} />
            <ContactRows website="https://www.starbucks.com/store-locator/store/17392/" />
            <PlacesAttribution />
         </div>
      </div>
   );
}
