/**
 * Number and money formatting for an India-market app.
 *
 * Hand-rolled rather than `Intl.NumberFormat('en-IN')`. Hermes does ship Intl,
 * but the locale data it carries is a build flag we do not control, and a
 * silently-wrong grouping (₹1,234,567 instead of ₹12,34,567) is the kind of bug
 * that ships because it looks fine to everyone who wrote it. Eleven lines of
 * regex is cheaper than that risk, and it is deterministic across every device
 * the app runs on.
 *
 * Prices are `number` everywhere upstream of this file. Money as a formatted
 * string is a display concern; the moment it becomes the data type, someone
 * concatenates two of them.
 */

/** ₹ — U+20B9. Written as an escape so it survives an editor with the wrong encoding. */
const RUPEE = '₹';

/**
 * Indian digit grouping: the last three digits, then pairs.
 *
 * 1234567 → 12,34,567. The regex walks the leading part in twos from the right
 * (`\B(?=(\d{2})+(?!\d))`) after the final triple has been split off, which is
 * exactly the lakh/crore rule and not an approximation of it.
 */
function groupIndian(digits: string): string {
   if (digits.length <= 3) return digits;

   const last3 = digits.slice(-3);
   const lead = digits.slice(0, -3);

   return `${lead.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${last3}`;
}

/** `12345` → `12,345`. For Star balances and counts, which carry no unit. */
export function formatIndianNumber(value: number): string {
   const rounded = Math.round(Math.abs(value));
   const sign = value < 0 ? '-' : '';

   return `${sign}${groupIndian(String(rounded))}`;
}

type RupeeOptions = {
   /**
    * Show paise. On by default because the catalogue prices are `₹588.00` and
    * `₹535.50` — dropping the decimals on the round ones would make a menu
    * column ragged. Turn it off for totals in a summary line where the paise
    * are noise.
    */
   paise?: boolean;
};

/** `535.5` → `₹535.50`. `125000` → `₹1,25,000.00`. */
export function formatRupees(amount: number, { paise = true }: RupeeOptions = {}): string {
   const sign = amount < 0 ? '-' : '';
   const absolute = Math.abs(amount);

   if (!paise) {
      return `${sign}${RUPEE}${formatIndianNumber(absolute)}`;
   }

   /**
    * Fixed first, then split. Rounding the rupees and the paise separately
    * loses a carry — 99.999 has to become ₹100.00, not ₹99.100.
    */
   const [whole, fraction] = absolute.toFixed(2).split('.');

   return `${sign}${RUPEE}${groupIndian(whole)}.${fraction}`;
}
