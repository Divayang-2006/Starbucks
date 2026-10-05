import { Avatar, Card, ListRow, StarBalance } from 'starbucks';

/**
 * A member, as a circle — the shape almost every account row starts with.
 *
 * Default size is `Sizes.tap` (44), because wherever this lands it is usually
 * inside something you can press. Initials on House Green, no ring: this app
 * has no photo upload, so the fallback *is* the avatar for nearly everyone.
 */
export function Default() {
   return (
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
         <Avatar name="Divayang Malseda" />
         <Avatar name="Prince Ranaware" />
         <Avatar name="Aarohi Deshpande" />
      </div>
   );
}

/**
 * The derivation rule, stated once so no call site restates it: first letter of
 * each of the first two words, uppercased. A one-word name gives one letter
 * rather than crashing, nothing at all gives the siren's stand-in ★, and
 * `initials` overrides the lot for a name the rule reads wrongly.
 */
export function Initials() {
   return (
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
         <Avatar name="Divayang Malseda" size={56} />
         <Avatar name="Prince" size={56} />
         <Avatar size={56} />
         <Avatar name="Dr. Aarohi Sudha Deshpande" initials="AD" size={56} />
      </div>
   );
}

/**
 * `size` drives everything else. The initials are set at `size / 2.8`, so a
 * 32pt disc in a list row and a 72pt one on an account screen carry the same
 * optical weight rather than the same type size.
 */
export function Sizes() {
   return (
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
         <Avatar name="Divayang Malseda" size={32} />
         <Avatar name="Divayang Malseda" size={44} />
         <Avatar name="Divayang Malseda" size={56} />
         <Avatar name="Divayang Malseda" size={72} />
      </div>
   );
}

/**
 * The tier ring — the reason this is a brand component and not a chrome one.
 *
 * `tier` is the only place outside Rewards where a member's standing is
 * visible at all. The ring is `size / 18`, so it reads as the same ring at 32pt
 * and at 72pt rather than a hairline on one and a band on the other.
 */
export function TierRing() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
         <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Avatar name="Prince Ranaware" tier="green" size={56} />
            <Avatar name="Divayang Malseda" tier="gold" size={56} />
            <Avatar name="Aarohi Deshpande" tier="reserve" size={56} />
         </div>
         <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Avatar name="Divayang Malseda" tier="gold" size={32} />
            <Avatar name="Divayang Malseda" tier="gold" size={44} />
            <Avatar name="Divayang Malseda" tier="gold" size={72} />
         </div>
      </div>
   );
}

/**
 * Where it actually goes: the leading slot of a member row, with the Star
 * balance trailing. The ring and the balance are the two halves of the same
 * fact, which is why the tiered member is also the one with 1,250 Stars.
 */
export function InRow() {
   return (
      <div style={{ width: 380 }}>
         <Card>
            <ListRow
               inset={false}
               chevron={false}
               leading={<Avatar name="Divayang Malseda" tier="gold" />}
               kicker="Gold tier"
               title="Divayang Malseda"
               subtitle="On this tier until 09/08/2027"
               trailing={<StarBalance stars={1250} size="sm" />}
            />
            <ListRow
               inset={false}
               chevron={false}
               divided
               leading={<Avatar name="Prince Ranaware" tier="green" />}
               kicker="Green tier"
               title="Prince Ranaware"
               subtitle="1 Star per ₹10 spent"
               trailing={<StarBalance stars={180} size="sm" />}
            />
         </Card>
      </div>
   );
}
