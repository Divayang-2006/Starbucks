import { SectionHeader, Theme } from 'starbucks';

/** The row stretches, so every cell gives it a screen-ish width to justify into. */
const sheet = { width: 380 };

/**
 * The plainest form: a sentence-case Urbanist title and nothing else, which is
 * how Home opens the two sections that have nowhere further to go.
 *
 * Never the serif. Fraunces is rationed to one moment per screen and a section
 * header is the easiest place to squander it.
 */
export function Default() {
   return (
      <div style={{ ...sheet, display: 'flex', flexDirection: 'column', gap: 28 }}>
         <SectionHeader title="Handcrafted Curations" />
         <SectionHeader title="Recent Transactions" />
      </div>
   );
}

/**
 * The trailing text action — the reason the row is a space-between flex rather
 * than a bare `Text`. Both of the app's real labels, on the two sections that
 * actually carry them.
 */
export function WithAction() {
   return (
      <div style={{ ...sheet, display: 'flex', flexDirection: 'column', gap: 28 }}>
         <SectionHeader title="Redeem your Stars" action="View all" onAction={() => {}} />
         <SectionHeader
            title="Learn more about the World of Coffee"
            action="Discover More"
            onAction={() => {}}
         />
      </div>
   );
}

/**
 * The ALL-CAPS kicker above the title, tracked for capitals by the shared
 * `CapsKicker` rule. Rewards and Order both open a section this way when the
 * title alone would not say which slice of the catalogue you are looking at.
 */
export function WithKicker() {
   return (
      <div style={{ ...sheet, display: 'flex', flexDirection: 'column', gap: 28 }}>
         <SectionHeader kicker="Milestones" title="What your Stars buy" />
         <SectionHeader
            kicker="New Launch"
            title="Just arrived"
            action="View all"
            onAction={() => {}}
         />
      </div>
   );
}

/** `inverse` for a header sitting on a green surface — white title, white underlined action. */
export function Inverse() {
   return (
      <div
         style={{
            ...sheet,
            backgroundColor: Theme.Surface.inverse,
            borderRadius: 16,
            paddingTop: Theme.Space.lg,
            paddingBottom: Theme.Space.lg,
         }}
      >
         <SectionHeader
            tone="inverse"
            kicker="Collecting from"
            title="Koregaon Park"
            action="Change"
            onAction={() => {}}
         />
      </div>
   );
}
