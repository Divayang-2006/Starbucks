/**
 * Rewards — the tier gauge, the milestone track, the reward carousel and the
 * activity timeline (§4, and screenshot 3).
 *
 * Structural placeholder. The gauge is a slot rather than a real arc, and no
 * reward can actually be redeemed; the numbers, tiers, thresholds and the
 * 12-month validity line are the real ones from §4 so the layout is dimensioned
 * against truth.
 *
 * **This is the screen still carrying the most local style, and the reason is
 * legible: three of its objects are genuinely one-offs.** The hero gauge card,
 * the milestone mark and the tan referral card each appear exactly once in the
 * app, and `docs/COMPONENTS.md` §2 rule 2 says the first occurrence stays local.
 * Two of the three have named successors already — `TierLadder` for the gauge,
 * and the promoted `LoyaltyCard` family for anything card-shaped. The timeline
 * is the interesting one: it is a `ListRow` per entry, with the dot-and-rule
 * column in the leading slot, which is only possible because the row lets its
 * caller stretch it.
 *
 * The serif lands on the tier name inside the gauge card — DESIGN_SYSTEM §1 lists
 * "Rewards hero" first, and the gauge *is* the hero. The balance itself stays
 * Urbanist `display`, because that is the token for the one number a screen is
 * about, and `Balance` is where that token lives.
 */

import { StyleSheet, Text, View } from 'react-native';

import { Balance } from '@/components/brand';
import {
   Card,
   Chip,
   Divider,
   Glyph,
   Gutter,
   ListRow,
   PlaceholderBlock,
   Rail,
   Screen,
   ScreenHeader,
   Section,
   Sheet,
   Tile,
} from '@/components/chrome';
import { Button, Segmented } from '@/components/controls';
import { formatIndianNumber } from '@/lib/format';
import { useSession } from '@/lib/session';
import {
   Accent,
   Action,
   IconSize,
   RailCard,
   Radius,
   Sizes,
   Space,
   Stroke,
   TextColor,
   TextStyles,
   Tier,
} from '@/theme';

/** §4 — the four milestones and what each one buys. */
const MILESTONES = [
   { stars: 200, reward: 'Free customisation' },
   { stars: 300, reward: 'Handcrafted drink' },
   { stars: 400, reward: 'Food item' },
   { stars: 600, reward: 'Whole bean coffee' },
];

/**
 * Two views of one list, exactly one of them showing — a partition, which is
 * `Segmented`'s half of the table in `segmented.tsx`. They were chips, and chips
 * are for filtering across a set rather than dividing it.
 */
const SEGMENTS = ['Available Rewards', 'Redeem Rewards'];

type Reward = {
   title: string;
   sub: string;
   /** Status badge — a reward already claimed. */
   badge?: string;
   /** Caps label for the empty artwork slot. Dropped where a badge already speaks. */
   art?: string;
};

const REWARDS: Reward[] = [
   {
      title: 'Buy 1 Food, Get 50% Off Your Next',
      sub: 'Expires on 30/09/2026',
      badge: '★ Reward redeemed',
   },
   {
      title: 'Free Customized Mondays',
      sub: 'One free modifier, every Monday',
      art: 'Reward artwork',
   },
];

/** §4 "Recent Activity" — a dotted timeline of what the account has done. */
const ACTIVITY = [
   { title: 'Welcome to Starbucks Rewards', window: 'Available until 09/08/2027', kind: 'Joined' },
   { title: 'Green Tier unlocked', window: '1 Star per ₹10 spent', kind: 'Tier earned' },
];

const TIER_LABEL: Record<'green' | 'gold' | 'reserve', string> = {
   green: 'Green Tier',
   gold: 'Gold Tier',
   reserve: 'Reserve Tier',
};

const GAUGE = 168;

export default function RewardsScreen() {
   const { member } = useSession();

   const stars = member?.stars ?? 0;
   const tier = member?.tier ?? 'green';
   /** §4: Gold is 1,000 Stars in a rolling 12-month window. */
   const toGold = Math.max(0, 1000 - stars);

   return (
      <Screen tone="inverse">
         <ScreenHeader tone="inverse" sheetBelow kicker="Starbucks Rewards" title="Rewards" />

         <Sheet>
            <Gutter>
               <Card style={styles.heroCard}>
                  {/*
                   * The gauge is a circular arc from Green to Gold in the real
                   * app. Until it is drawn, a disc-shaped slot keeps the card's
                   * proportions honest instead of collapsing the layout.
                   */}
                  <PlaceholderBlock
                     label="Tier gauge"
                     height={GAUGE}
                     radius={Radius.pill}
                     style={styles.gauge}
                  />

                  <Balance
                     kicker="Balance"
                     value={formatIndianNumber(stars)}
                     unit="Stars"
                     align="center"
                  />

                  {/* The hero's serif moment. */}
                  <Text style={styles.heroTier}>{TIER_LABEL[tier]}</Text>
                  <Text style={styles.heroMeta}>
                     {toGold} Stars to Gold · you are on this tier until 09/08/2027
                  </Text>
               </Card>
            </Gutter>

            {/* §4 milestone track — thresholds are fixed, so they are real here. */}
            <Section kicker="Milestones" title="What your Stars buy">
               <Rail>
                  {MILESTONES.map((milestone) => (
                     <Milestone
                        key={milestone.stars}
                        stars={milestone.stars}
                        reward={milestone.reward}
                     />
                  ))}
               </Rail>
            </Section>

            <Section>
               <Segmented items={SEGMENTS} selectedIndex={0} />

               <Rail>
                  {REWARDS.map((reward) => (
                     <Tile
                        key={reward.title}
                        width={RailCard.feature}
                        media={<PlaceholderBlock label={reward.art} height={112} />}
                        badge={
                           reward.badge ? (
                              <Chip label={reward.badge} tone="gold" size="sm" />
                           ) : undefined
                        }
                        title={reward.title}
                        sub={reward.sub}
                        footer={<Button label="Use Reward" size="sm" full />}
                        action="Details"
                     />
                  ))}
               </Rail>
            </Section>

            {/* §4 — dotted vertical timeline, one entry per event. */}
            <Section title="Recent Activity" gutter>
               <Card>
                  {ACTIVITY.map((entry, index) => (
                     <ListRow
                        key={entry.title}
                        /** The card already insets; a row inset inside it reads as a mistake. */
                        inset={false}
                        chevron={false}
                        kicker={entry.kind}
                        title={entry.title}
                        subtitle={entry.window}
                        style={styles.activityRow}
                        leading={
                           <View style={styles.activityGutter}>
                              <View style={styles.activityDot} />
                              {index < ACTIVITY.length - 1 ? (
                                 <Divider orientation="vertical" style={styles.activityLine} />
                              ) : null}
                           </View>
                        }
                     />
                  ))}
               </Card>
            </Section>

            {/* §4 — the referral card repeats on the Account screen. Tan, not green. */}
            <Gutter>
               <Card style={styles.referCard}>
                  <Text style={styles.referTitle}>Refer &amp; Reap Rewards</Text>
                  <Text style={styles.referBody}>
                     Your invite code gets them a drink and you Stars.
                  </Text>
                  <Button
                     label="Share invite code"
                     variant="inverse"
                     size="sm"
                     style={styles.referCta}
                     onPress={() => {
                        // TODO: share sheet once there is a code to share.
                     }}
                  />
               </Card>
            </Gutter>
         </Sheet>
      </Screen>
   );
}

/**
 * A gold mark, a threshold and what it buys. Local: one rail, one screen, and it
 * is a mark rather than a card, so `Tile` is the wrong shape. `TierLadder` is
 * the named successor when the milestones become a real track.
 */
function Milestone({ stars, reward }: { stars: number; reward: string }) {
   return (
      <View style={styles.milestone}>
         <View style={styles.milestoneDisc}>
            <Glyph id="rewards" size={IconSize.md} color={Accent.gold} strokeWidth={Stroke.medium} />
         </View>
         <Text style={styles.milestoneStars}>{stars}★</Text>
         <Text style={styles.milestoneLabel} numberOfLines={2}>
            {reward}
         </Text>
      </View>
   );
}

const styles = StyleSheet.create({
   heroCard: {
      alignItems: 'center',
      paddingVertical: Space.xl,
   },
   gauge: {
      width: GAUGE,
      marginBottom: Space.lg,
   },
   heroTier: {
      ...TextStyles.titleSerif,
      color: Tier.green,
      marginTop: Space.sm,
   },
   heroMeta: {
      ...TextStyles.bodySm,
      color: TextColor.secondary,
      textAlign: 'center',
      marginTop: Space.xs,
   },

   milestone: {
      width: 96,
      alignItems: 'center',
      gap: Space.xs,
   },
   milestoneDisc: {
      width: Sizes.markDisc,
      height: Sizes.markDisc,
      borderRadius: Radius.pill,
      backgroundColor: Accent.goldSoft,
      alignItems: 'center',
      justifyContent: 'center',
   },
   milestoneStars: {
      ...TextStyles.bodySmStrong,
      color: TextColor.primary,
   },
   milestoneLabel: {
      ...TextStyles.micro,
      color: TextColor.secondary,
      textAlign: 'center',
   },

   /**
    * `stretch` is what lets the rule between two dots reach: `ListRow` centres
    * its slots, and a leading column that does not fill the row's height has
    * nothing for a `flex: 1` line to grow into.
    */
   activityRow: {
      alignItems: 'stretch',
      paddingBottom: Space.base,
   },
   activityGutter: {
      alignItems: 'center',
      paddingTop: Space.xs,
   },
   activityDot: {
      width: Sizes.dot,
      height: Sizes.dot,
      borderRadius: Radius.pill,
      backgroundColor: Action.selected,
   },
   /**
    * The negative bottom margin is the whole trick. The row's own padding is
    * what separates two entries' text, and a connector that stops short of the
    * dot it connects to is not a connector — so the rule reaches back out
    * through that padding to meet the next one.
    */
   activityLine: {
      flex: 1,
      minHeight: Space.xxl,
      marginTop: Space.xs,
      marginBottom: -Space.base,
   },

   referCard: {
      backgroundColor: Accent.tan,
   },
   referTitle: {
      ...TextStyles.h3,
      color: TextColor.primary,
   },
   referBody: {
      ...TextStyles.bodySm,
      color: TextColor.primary,
      marginTop: Space.xs,
   },
   referCta: {
      marginTop: Space.base,
   },
});
