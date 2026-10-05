import { ContactRows, Theme } from 'starbucks';

/** The app's cream, so the white sheet these rows live in reads as a surface. */
const page = {
   width: 390,
   background: Theme.Surface.app,
   padding: 16,
   display: 'flex',
   flexDirection: 'column',
} as const;

/** `Surface.raised` — the store sheet. The block brings its own top hairline. */
const sheet = {
   background: Theme.Surface.raised,
   borderRadius: 20,
   padding: 16,
   display: 'flex',
   flexDirection: 'column',
} as const;

/** The Places record's store-locator URL. Sixty characters, unreadable in full. */
const STORE_LOCATOR = 'https://www.starbucks.com/store-locator/store/17392/';

/**
 * Both rows, as a US record returns them.
 *
 * Two formatters are doing quiet work here. The phone arrives as E.164
 * (`+14155587715`) and is printed grouped; the website arrives as the full
 * store-locator URL and is printed as the bare host, `starbucks.com`, because
 * the path is noise you cannot act on.
 */
export function PhoneAndWebsite() {
   return (
      <div style={page}>
         <div style={sheet}>
            <ContactRows phone="+14155587715" website={STORE_LOCATOR} />
         </div>
      </div>
   );
}

/**
 * The Indian case: a website, no phone.
 *
 * `phone` is US-only on this API — the Koregaon Park record simply does not
 * carry one. The block renders the one row it has rather than a disabled or
 * empty second, which is why the two rows are independent conditionals rather
 * than a fixed pair.
 */
export function WebsiteOnly() {
   return (
      <div style={page}>
         <div style={sheet}>
            <ContactRows website={STORE_LOCATOR} />
         </div>
      </div>
   );
}

/**
 * Phone alone — the same block from the other side.
 *
 * Both rows are `accessibilityRole="link"` and both open through `Linking`,
 * whose rejection is swallowed: a tablet with no dialler should not crash the
 * sheet over a tap on a phone number.
 */
export function PhoneOnly() {
   return (
      <div style={page}>
         <div style={sheet}>
            <ContactRows phone="+14155587715" />
         </div>
      </div>
   );
}
