/**
 * Pay — the Starbucks Pay card, scan-to-pay, balance and payment modes (§2 item
 * 13, and the `Pay ₹0.00` figure Home's stats strip reports).
 *
 * Structural placeholder. Nothing here moves money: the actions are labelled
 * shapes, add-money and transaction history are their own screens and out of
 * scope.
 *
 * The card is the only thing left in this file that is drawn rather than
 * composed, and it earns that: it is a piece of plastic, not a container. Even
 * the number on it is not a text style so much as an impression of embossing.
 * `docs/COMPONENTS.md` §4 already names the successor — the onboarding flow's
 * `LoyaltyCard` promoted to `@/components/card/` — and the day that lands, this
 * screen's `StyleSheet` goes with it.
 *
 * Bebas Neue appears exactly once, on the card number. DESIGN_SYSTEM §1 reserves
 * it for the loyalty card face where it stands in for embossing — the Pay card is
 * the same object, so this is the one other place it belongs.
 */

import { StyleSheet, Text, View } from 'react-native';

import { Balance } from '@/components/brand';
import {
   Card,
   Gutter,
   ListRow,
   ListSection,
   PlaceholderBlock,
   Screen,
   ScreenHeader,
   Section,
   Sheet,
} from '@/components/chrome';
import { Button } from '@/components/controls';
import { formatRupees } from '@/lib/format';
import { useSession } from '@/lib/session';
import { Radius, Sizes, Space, Surface, TextColor, TextStyles, Type } from '@/theme';

const PAYMENT_MODES = ['UPI', 'Credit / Debit Card', 'Net Banking', 'Wallets'];

export default function PayScreen() {
   const { member } = useSession();

   const holder = member ? `${member.firstName} ${member.lastName}`.trim() : 'Starbucks Member';

   return (
      <Screen tone="inverse">
         <ScreenHeader tone="inverse" sheetBelow kicker="Starbucks Pay" title="Pay" />

         <Sheet>
            {/*
             * The card is the hero, and it rides up over the header the way the
             * loyalty card does in onboarding — the balance is the one number
             * this screen is about, which is what `Balance` is for.
             */}
            <Gutter>
               <Card style={styles.payCard}>
                  <Balance kicker="Balance" value={formatRupees(0)} tone="inverse" />

                  <View style={styles.payFoot}>
                     <View>
                        <Text style={styles.payHolder}>{holder}</Text>
                        {/* Fictional on purpose — 1971 is the year, not a card. */}
                        <Text style={styles.payNumber}>6062 •••• •••• 1971</Text>
                     </View>
                     <PlaceholderBlock
                        height={Sizes.markDisc}
                        radius={Radius.md}
                        style={styles.payQr}
                     />
                  </View>
               </Card>
            </Gutter>

            {/*
             * Two `md` buttons rather than a pair of hand-drawn pills. `full`
             * would stretch each one on its own; in a row what they need is an
             * equal share, which is `flex`.
             */}
            <Gutter style={styles.actions}>
               <Button
                  label="Scan to pay"
                  glyph="scan"
                  style={styles.action}
                  onPress={() => {
                     // TODO: present the scan modal once it exists (NAVIGATION §4).
                  }}
               />
               <Button
                  label="Add money"
                  glyph="plus"
                  variant="secondary"
                  style={styles.action}
                  onPress={() => {
                     // TODO: push add-money inside this tab's stack.
                  }}
               />
            </Gutter>

            {/*
             * `ListSection` owns the "first row has no rule above it" rule, which
             * this screen used to do with `index > 0 &&` at the call site.
             */}
            <ListSection title="Other Payment Modes" action="Manage">
               {PAYMENT_MODES.map((mode) => (
                  <ListRow key={mode} title={mode} chevron />
               ))}
            </ListSection>

            <Section title="Recent Transactions" gutter>
               <PlaceholderBlock
                  label="No transactions yet · reloads and store payments appear here"
                  height={128}
                  radius={Radius.xl}
               />
            </Section>
         </Sheet>
      </Screen>
   );
}

const styles = StyleSheet.create({
   payCard: {
      backgroundColor: Surface.inverse,
      padding: Space.lg,
   },
   payFoot: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: Space.base,
      marginTop: Space.xl,
   },
   payHolder: {
      ...TextStyles.bodySmStrong,
      color: TextColor.onDark,
   },
   /** The one embossing moment. Bebas is caps-only and a single static weight. */
   payNumber: {
      fontFamily: Type.emboss,
      fontSize: 20,
      lineHeight: 24,
      letterSpacing: 2,
      color: TextColor.onDarkMuted,
      marginTop: Space.xxs,
   },
   payQr: {
      width: Sizes.markDisc,
      backgroundColor: Surface.onDarkFill,
   },

   actions: {
      flexDirection: 'row',
      gap: Space.md,
   },
   action: {
      flex: 1,
   },
});
