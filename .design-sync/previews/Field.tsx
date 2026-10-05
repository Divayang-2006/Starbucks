import { Field } from 'starbucks';

/**
 * The resting state: ALL-CAPS label, a rule, and a quiet hint under it.
 *
 * Rendered at a fixed width because a Field stretches to its container, and a
 * card-width rule reads as the form row it actually is.
 */
export function Default() {
   return (
      <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 24 }}>
         <Field label="FIRST NAME" value="Divayang" />
         <Field label="MOBILE NUMBER" value="98765 43210" hint="We'll text a code to confirm." />
      </div>
   );
}

/** Placeholder vs. filled — the empty state a form actually opens in. */
export function Empty() {
   return (
      <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 24 }}>
         <Field label="EMAIL" placeholder="you@example.com" />
         <Field label="REFERRAL CODE" placeholder="Optional" hint="Six characters, letters and digits." />
      </div>
   );
}

/** `error` replaces the hint line and turns the rule red. */
export function ErrorState() {
   return (
      <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 24 }}>
         <Field label="MOBILE NUMBER" value="98765" error="Enter all 10 digits." />
         <Field label="EMAIL" value="divayang@" error="That doesn't look like an email address." />
      </div>
   );
}

/** `editable: false` greys the value without collapsing the row. */
export function Disabled() {
   return (
      <div style={{ width: 320 }}>
         <Field label="MEMBER ID" value="SB-4471-0092" editable={false} hint="Issued when you joined." />
      </div>
   );
}
