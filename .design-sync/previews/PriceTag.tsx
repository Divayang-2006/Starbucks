import { Card, ListRow, PriceTag, Theme } from 'starbucks';

/**
 * `₹588.00` — a menu price, formatted here so no screen ever holds money as a
 * string.
 *
 * Paise are on by default: the catalogue is full of `₹472.50` and `₹456.75`, and
 * dropping the decimals only on the round ones makes a menu column ragged.
 */
export function Default() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
         <PriceTag amount={588} />
         <PriceTag amount={472.5} />
         <PriceTag amount={393.75} />
      </div>
   );
}

/**
 * `md` is the card foot and the list row; `lg` is the PDP, where the price is
 * the second thing you read after the name.
 */
export function Sizes() {
   return (
      <div style={{ display: 'flex', gap: 32, alignItems: 'baseline' }}>
         <PriceTag amount={488.25} />
         <PriceTag amount={488.25} size="lg" />
      </div>
   );
}

/**
 * `was` renders the old price ahead of the new one as its own `<Text>` — a
 * strikethrough drawn through both prices is a bug that only shows up on a
 * discounted item, which is to say in front of a customer.
 */
export function Discounted() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
         <PriceTag amount={456.75} was={520} />
         <PriceTag amount={294} was={588} size="lg" />
      </div>
   );
}

/**
 * `from` — the item has size variants, so a flat Tall price is the small
 * dishonesty that turns into an argument at the till. The qualifier is `micro`
 * and sits on the same baseline as the figure.
 */
export function FromPrice() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
         <PriceTag amount={325} from />
         <PriceTag amount={393.75} from size="lg" />
      </div>
   );
}

/**
 * `tone="inverse"` for the sticky Add-to-Cart bar, and `paise={false}` for the
 * summary total beside it — paise are noise in a total and mandatory in a menu
 * price, which is the whole reason it is a prop.
 */
export function Inverse() {
   return (
      <div
         style={{
            width: 340,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            padding: 20,
            borderRadius: Theme.Radius.xl,
            background: Theme.Surface.inverse,
         }}
      >
         <PriceTag amount={1474.5} size="lg" tone="inverse" />
         <PriceTag amount={1474.5} size="lg" tone="inverse" paise={false} />
         <PriceTag amount={456.75} was={520} tone="inverse" />
      </div>
   );
}

/**
 * In the foot of a cart line, which is where most of them live: the price and
 * its qualifier hold the left edge while the row's own text column truncates
 * around them.
 */
export function InRow() {
   return (
      <div style={{ width: 380 }}>
         <Card>
            <ListRow
               inset={false}
               chevron={false}
               kickerStyle="micro"
               kicker="TALL · 354 ml · 655 kcal"
               title="Tiramisu Frappuccino"
               trailing={<PriceTag amount={588} />}
            />
            <ListRow
               inset={false}
               divided
               chevron={false}
               kickerStyle="micro"
               kicker="SHORT · 237 ml · 257 kcal"
               title="Malabar Coconut Flat White"
               trailing={<PriceTag amount={456.75} was={520} />}
            />
         </Card>
      </div>
   );
}
