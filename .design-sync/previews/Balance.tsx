import { Balance, Card, Theme } from 'starbucks';

/**
 * The one number a screen is about, with its caps label above it.
 *
 * Left-aligned is the default because that is how Pay lays its card out. The
 * kicker uppercases itself — call sites type "Balance" and "Total", not
 * "BALANCE" — and `value` arrives already formatted, because this component has
 * no idea whether it is showing rupees, Stars or minutes.
 */
export function Default() {
   return (
      <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 28 }}>
         <Balance kicker="Balance" value="₹0.00" />
         <Balance kicker="Total" value="₹1,474.50" />
      </div>
   );
}

/**
 * `align="center"` and the Rewards hero it was added for: the Star balance is
 * the subject of that screen, so it sits centred in the gauge card with the
 * tier line under it.
 */
export function Centred() {
   return (
      <div style={{ width: 320 }}>
         <Card>
            <Balance kicker="Balance" value="640" unit="Stars" align="center" />
         </Card>
      </div>
   );
}

/**
 * `tone="inverse"` — the Pay card, which is a piece of plastic rather than a
 * container, so the figure sits on House Green with the kicker dropped to
 * `onDarkMuted`. Centred works on dark too; alignment and tone are independent.
 */
export function Inverse() {
   return (
      <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 16 }}>
         <Card style={{ backgroundColor: Theme.Surface.inverse, padding: Theme.Space.lg }}>
            <Balance kicker="Balance" value="₹0.00" tone="inverse" />
         </Card>
         <Card style={{ backgroundColor: Theme.Surface.inverse, padding: Theme.Space.lg }}>
            <Balance kicker="Stars earned" value="1,250" unit="Stars" tone="inverse" align="center" />
         </Card>
      </div>
   );
}

/**
 * `unit` is a nested `<Text>`, so it shares the display line's baseline instead
 * of floating at the top of a 40pt line box. It is the difference between a
 * figure that reads as a quantity and one that reads as two objects.
 */
export function Units() {
   return (
      <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 28 }}>
         <Balance kicker="Balance" value="640" unit="Stars" />
         <Balance kicker="Ready in" value="6" unit="mins" />
         <Balance kicker="This drink" value="655" unit="kcal" />
      </div>
   );
}

/**
 * Long figures. Indian grouping comes from `formatRupees` upstream — a lakh
 * groups as `12,34,567`, not `1,234,567` — and the display line is capped at
 * one line, so the card's height cannot move when the number does.
 */
export function LongValue() {
   return (
      <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 28 }}>
         <Balance kicker="Lifetime spend" value="₹12,34,567.00" />
         <Balance kicker="Stars earned" value="24,850" unit="Stars" />
      </div>
   );
}
