import type { ReactNode } from 'react';
import { ServicePills } from 'starbucks';

/*
 * The pills are `Surface.sunken` on `Surface.raised`, so a cell has to supply
 * the white card they sit in — on the cream app ground a sunken fill has almost
 * no edge, which is exactly the reading the design system intends.
 */
const WHITE = '#FFFFFF';
const HAIR = '#E3DFD6';
const PRIMARY = '#14231E';
const SECONDARY = '#5C6A65';
const TERTIARY = '#79817E';

function Card({ children }: { children: ReactNode }) {
   return (
      <div
         style={{
            width: 380,
            background: WHITE,
            border: `1px solid ${HAIR}`,
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
         }}>
         {children}
      </div>
   );
}

function Label({ text }: { text: string }) {
   return (
      <span
         style={{
            fontFamily: 'Urbanist_600SemiBold',
            fontSize: 11,
            letterSpacing: 1.1,
            color: TERTIARY,
         }}>
         {text}
      </span>
   );
}

/**
 * All four services at `md`, the size the confirm sheet uses. Filled rather than
 * outlined on purpose — an outline this small next to the search field's own
 * outline starts to look like a form.
 */
export function AllServices() {
   return (
      <Card>
         <Label text="ALL FOUR · MD" />
         <ServicePills services={['dineIn', 'takeaway', 'driveThru', 'reserve']} />
      </Card>
   );
}

/**
 * `sm` exists for list rows, which surface only `NOTABLE_SERVICES` — drive-thru
 * and reserve bar. Those are the two that change where you drive to; dine-in and
 * takeaway are table stakes, and showing them on every row would be noise.
 */
export function NotableAtSm() {
   return (
      <Card>
         <Label text="NOTABLE ONLY · SM" />
         <ServicePills services={['driveThru', 'reserve']} size="sm" />
      </Card>
   );
}

/**
 * The two sizes on the same set. `md` is 30pt tall with a `label` type ramp;
 * `sm` drops to 22 and `micro`, which is small enough to ride inside a list
 * row's meta line beside the open/closed dot without pushing it taller.
 */
export function SizeCompare() {
   return (
      <Card>
         <Label text="MD · 30 PT" />
         <ServicePills services={['dineIn', 'takeaway', 'reserve']} />
         <div style={{ height: 1, background: HAIR }} />
         <Label text="SM · 22 PT" />
         <ServicePills services={['dineIn', 'takeaway', 'reserve']} size="sm" />
      </Card>
   );
}

/**
 * Three real stores from the seed, each with the exact service set the data
 * carries. Khan Market is the one-pill case and Wakad Highway is the only
 * drive-thru in the set — both worth seeing, because the row has to hold with a
 * single pill in it and not look truncated.
 */
export function RealStores() {
   return (
      <Card>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontFamily: 'Urbanist_600SemiBold', fontSize: 15, color: PRIMARY }}>
               Koregaon Park
            </span>
            <span style={{ fontFamily: 'Urbanist_400Regular', fontSize: 13, color: SECONDARY }}>
               North Main Road, Pune
            </span>
            <ServicePills services={['dineIn', 'takeaway', 'reserve']} />
         </div>

         <div style={{ height: 1, background: HAIR }} />

         <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontFamily: 'Urbanist_600SemiBold', fontSize: 15, color: PRIMARY }}>
               Wakad Highway
            </span>
            <span style={{ fontFamily: 'Urbanist_400Regular', fontSize: 13, color: SECONDARY }}>
               Mumbai–Bengaluru Expressway, Pune
            </span>
            <ServicePills services={['driveThru', 'takeaway']} />
         </div>

         <div style={{ height: 1, background: HAIR }} />

         <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontFamily: 'Urbanist_600SemiBold', fontSize: 15, color: PRIMARY }}>
               Khan Market
            </span>
            <span style={{ fontFamily: 'Urbanist_400Regular', fontSize: 13, color: SECONDARY }}>
               Rabindra Nagar, New Delhi
            </span>
            <ServicePills services={['takeaway']} />
         </div>
      </Card>
   );
}

/**
 * The row wraps rather than scrolling, so a narrow container gets two lines and
 * not a clipped third pill. This is the sheet at its tightest useful width.
 */
export function Wrapping() {
   return (
      <div
         style={{
            width: 236,
            background: WHITE,
            border: `1px solid ${HAIR}`,
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
         }}>
         <Label text="236 PT CONTAINER" />
         <ServicePills services={['dineIn', 'takeaway', 'driveThru', 'reserve']} />
      </div>
   );
}
