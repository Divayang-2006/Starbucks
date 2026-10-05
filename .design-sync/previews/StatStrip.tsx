import { ScreenHeader, Stat, StatStrip, StoreRow, Theme } from 'starbucks';

const onGreen = {
   width: 348,
   backgroundColor: Theme.Surface.inverse,
   borderRadius: 16,
   padding: Theme.Space.base,
};

/**
 * The canonical strip: Stars · Rewards · Pay, on House Green, as Home's header
 * band reports the account.
 *
 * The strip carries the tone for its cells rather than each cell setting its
 * own — three chances to set it wrong is how you get one white figure between
 * two green ones.
 */
export function HomeStats() {
   return (
      <div style={onGreen}>
         <StatStrip tone="inverse">
            <Stat label="Stars" value="1,250" />
            <Stat label="Rewards" value="3" />
            <Stat label="Pay" value="₹1,240.00" />
         </StatStrip>
      </div>
   );
}

/** The same three figures on cream, for a strip inside a card rather than a band. */
export function Light() {
   return (
      <div
         style={{
            width: 348,
            backgroundColor: Theme.Surface.raised,
            borderRadius: 16,
            padding: Theme.Space.base,
         }}
      >
         <StatStrip>
            <Stat label="Stars earned" value="1,250" />
            <Stat label="Stars to Gold" value="750" />
            <Stat label="Visits" value="27" />
         </StatStrip>
      </div>
   );
}

/**
 * The cell count is whatever you pass, and the rules are derived — two cells get
 * one, four get three. The rule is 34pt, deliberately short of the cell height,
 * because a full-height rule turns figures into a table.
 */
export function CellCount() {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
         <div style={onGreen}>
            <StatStrip tone="inverse">
               <Stat label="Order total" value="₹1,102.50" />
               <Stat label="Ready in" value="6 min" />
            </StatStrip>
         </div>
         <div style={onGreen}>
            <StatStrip tone="inverse">
               <Stat label="Stars" value="1,250" />
               <Stat label="Rewards" value="3" />
               <Stat label="Visits" value="27" />
               <Stat label="Tier" value="Green" />
            </StatStrip>
         </div>
      </div>
   );
}

/**
 * Where it actually lives: the last child of the header band, under the store
 * you are collecting from. The hairline is the on-dark token, which is the whole
 * reason the strip owns the rules instead of the caller interleaving them.
 */
export function InHeader() {
   return (
      <div style={{ width: 380, overflow: 'hidden', borderRadius: 16 }}>
         <ScreenHeader tone="inverse" title="Hi, Divayang">
            <StoreRow
               tone="inverse"
               name="Koregaon Park"
               area="North Main Road"
               etaMins={6}
               onChange={() => {}}
               style={{ marginTop: Theme.Space.md }}
            />

            <StatStrip tone="inverse" style={{ marginTop: Theme.Space.lg }}>
               <Stat label="Stars" value="1,250" />
               <Stat label="Rewards" value="3" />
               <Stat label="Pay" value="₹1,240.00" />
            </StatStrip>
         </ScreenHeader>
      </div>
   );
}
