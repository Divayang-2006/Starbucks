/**
 * Home — the module stack from `docs/APP_METADATA.md` §6, in its order.
 *
 * Structural placeholder: the sections, their real titles and their real shapes
 * are here; the content each one will hold is not. Every `PlaceholderBlock` is a
 * slot for someone else to fill.
 *
 * The screen is a list of components and data now — `docs/COMPONENTS.md` §2
 * rule 3. What used to be nine local shapes (a header button, an avatar, a stat
 * cell, a reward teaser, a promo card, a product tile, an article card, a store
 * block and a text link) are all shared components; what is left below is the
 * order they appear in.
 *
 * **This is the one screen with no header kicker, and that is deliberate.** The
 * other four label their title with a caps line above it; a greeting needs no
 * label, and the band's caps slot is already spoken for eight points lower by
 * the `StoreRow`'s "COLLECTING FROM". Two caps lines stacked in one band read as
 * a form.
 *
 * This screen's serif budget goes to the store name — DESIGN_SYSTEM §1 sanctions
 * store names, and the store is the thing the whole flow hangs off. That is why
 * the greeting, the section titles and the article titles are all Urbanist even
 * though article titles are on the sanctioned list too: one screen, one serif.
 */

import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { ProductCard, StoreRow } from '@/components/brand';
import {
   AvatarButton,
   Chip,
   Divider,
   Glyph,
   Gutter,
   HeaderButton,
   PlaceholderBlock,
   Rail,
   Screen,
   ScreenHeader,
   Section,
   Sheet,
   Stat,
   StatStrip,
   Tile,
} from '@/components/chrome';
import { Button } from '@/components/controls';
import { useAppMenu } from '@/components/fluid-menu';
import { SirenLogo } from '@/components/onboarding/SirenLogo';
import { formatIndianNumber, formatRupees } from '@/lib/format';
import { useSession } from '@/lib/session';
import {
   IconSize,
   RailCard,
   Radius,
   Sizes,
   Space,
   TextColor,
   TextStyles,
} from '@/theme';

/** §6.3 — the carousel shows what you can't have yet as well as what you can. */
const REWARDS = [
   { title: 'Free Customization', cost: 200 },
   { title: 'Handcrafted Drink', cost: 300 },
];

const PROMOS = [
   {
      title: 'Beverage Subscription',
      body: 'One coffee a day, one price a month.',
      action: 'Know More',
   },
   { title: 'Dots Doodles × Starbucks', body: 'Back to campus, in colour.', action: 'Get Now' },
];

/** §6.6 — the six circular category chips, in the app's order. */
const CURATIONS = ['New Launch', 'Best Seller', 'Drinks', 'Food', 'Merch', 'At Home Coffee'];

/**
 * §5 sample catalogue. Real prices and kcal, so the rail is dimensioned
 * honestly. Prices are numbers — `PriceTag` formats them, because money as a
 * formatted string is the point at which someone concatenates two of them.
 */
const RECOMMENDED = [
   { name: 'Tiramisu Frappuccino', meta: 'TALL · 354 ml · 655 kcal', price: 588 },
   { name: 'Iced Coconut Matcha', meta: 'TALL · 354 ml · 117 kcal', price: 472.5 },
   { name: 'Malabar Coconut Flat White', meta: 'SHORT · 237 ml · 257 kcal', price: 456.75 },
];

const ARTICLES = ['The Art & Science of Coffee Brewing', 'Where Your Beans Come From'];

/**
 * Defensive only — the router's store gate (NAVIGATION §2) means you cannot be
 * inside the tabs without one. The same two strings are used on Order, because
 * the pair used to disagree ("No store yet" / "No store selected") for no reason
 * anyone could state.
 */
const NO_STORE = { kicker: 'No store yet', name: 'Pick a store to start' };

export default function HomeScreen() {
   const router = useRouter();
   const { openMenu } = useAppMenu();
   const { member, store } = useSession();

   const firstName = member?.firstName ?? 'there';
   const initials = member
      ? `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase()
      : '★';

   return (
      <Screen tone="inverse">
         <ScreenHeader
            tone="inverse"
            sheetBelow
            title={`Hi, ${firstName}`}
            backdrop={<HeaderBackdrop />}
            left={<SirenLogo width={30} />}
            right={
               <>
                  <HeaderButton
                     label="Gift cards"
                     onPress={() => {
                        // TODO: shortcut into the Gift tab once gift-card detail exists.
                     }}
                  >
                     <Glyph id="gift" size={IconSize.md} color={TextColor.onDark} />
                  </HeaderButton>

                  {/*
                   * Account is reached from here and nowhere else — it is not a tab
                   * (§2) — so this button is the whole entrance to the Account stack.
                   *
                   * It navigates nowhere. The panel is wrapped around the entire tab
                   * shell in `(tabs)/_layout.tsx`, so opening it slides this screen
                   * and the bar under it off to the right rather than pushing
                   * anything on top — which is also why the drag from the left edge
                   * is the same gesture and not a second one. `useAppMenu` is the
                   * seam that gets the callback past the navigator in between.
                   */}
                  <AvatarButton initials={initials} onPress={openMenu} />
               </>
            }
         >
            {/*
             * The store, up top, because the flow starts at one: in India the
             * menu, the ETA and the pricing are all per-store, so "which shop"
             * is context for everything below it.
             *
             * Change opens the map as a modal rather than clearing the session.
             * Clearing it would work — the guard would fall back to gate one —
             * but it tears down the whole tab controller to do it, and you lose
             * your store the moment you open the picker rather than when you pick
             * something. The modal keeps the store set until you actually choose,
             * so backing out leaves you exactly where you were.
             */}
            <StoreRow
               kicker={store ? undefined : NO_STORE.kicker}
               name={store?.name ?? NO_STORE.name}
               area={store?.area}
               etaMins={store?.etaMins}
               onChange={() => router.navigate('/change-store')}
               style={styles.store}
            />

            {/* §6.2 — the three numbers that describe the account. */}
            <StatStrip tone="inverse" style={styles.stats}>
               <Stat label="Stars" value={formatIndianNumber(member?.stars ?? 0)} />
               <Stat label="Rewards" value="0" />
               <Stat label="Pay" value={formatRupees(0)} />
            </StatStrip>
         </ScreenHeader>

         <Sheet>
            {/* §6.3 */}
            <Section title="Redeem your Stars" action="View all">
               <Rail>
                  {REWARDS.map((reward) => (
                     <Tile
                        key={reward.title}
                        width={RailCard.standard}
                        media={<PlaceholderBlock height={84} />}
                        title={reward.title}
                        sub={`Redeem this for ${reward.cost}★`}
                        /**
                         * Locked, not absent. A disabled non-primary button is
                         * the recessed slot the old hand-rolled CTA drew by
                         * hand — see `Button`'s `disabledQuiet`.
                         */
                        footer={
                           <Button
                              label="Unlock Reward"
                              variant="secondary"
                              size="sm"
                              full
                              disabled
                           />
                        }
                     />
                  ))}
               </Rail>
            </Section>

            {/* §6.4 */}
            <Section gutter>
               {PROMOS.map((promo) => (
                  <Tile
                     key={promo.title}
                     media={<PlaceholderBlock label="Campaign artwork" height={120} />}
                     title={promo.title}
                     sub={promo.body}
                     action={promo.action}
                  />
               ))}
            </Section>

            {/* §6.5 */}
            <Gutter>
               <Tile
                  media={<PlaceholderBlock label="Autoplaying video · mute toggle" height={196} />}
                  title="Your Drink's New Bestie"
                  sub="Pink Bearista glass cold cup"
               />
            </Gutter>

            {/* §6.6 */}
            <Section title="Handcrafted Curations">
               <Rail>
                  {CURATIONS.map((name) => (
                     <Curation key={name} name={name} />
                  ))}
               </Rail>
            </Section>

            {/* §6.7 */}
            <Section title="Recommended" action="View all">
               <Rail>
                  {RECOMMENDED.map((item) => (
                     <ProductCard
                        key={item.name}
                        name={item.name}
                        meta={item.meta}
                        price={item.price}
                        veg
                        width={RailCard.compact}
                        onAdd={() => {
                           // TODO: add to the cart once there is one.
                        }}
                     />
                  ))}
               </Rail>
            </Section>

            {/* §6.8 */}
            <Section title="Learn more about the World of Coffee" action="Discover More">
               <Rail>
                  {ARTICLES.map((title) => (
                     <Tile
                        key={title}
                        width={RailCard.feature}
                        media={<PlaceholderBlock height={120} />}
                        badge={<Chip label="Coffee Culture" selected />}
                        title={title}
                        action="Learn More"
                     />
                  ))}
               </Rail>
            </Section>

            {/*
             * §6.9 / §8 — both lines are legally required, not decoration. The
             * rule above them is full-bleed, so it sits outside the `Gutter`
             * rather than being a border on it.
             */}
            <Section gap={Space.lg}>
               <Divider />
               <Gutter style={styles.compliance}>
                  <Text style={styles.complianceText}>
                     An average active adult requires 2,000 kcal energy per day; however, calorie
                     needs may vary.
                  </Text>
                  <Text style={styles.complianceText}>FSSAI Lic. No. 10015022003801</Text>
               </Gutter>
            </Section>
         </Sheet>
      </Screen>
   );
}

/**
 * Leaf line-art standing in for the barista-pour photograph §6 calls for. §7
 * records line-art on dark green as a house motif, so it reads as decoration
 * rather than as a missing asset — and it swaps for an `<Image>` the day there is
 * one, because `ScreenHeader` takes the backdrop as a slot.
 */
function HeaderBackdrop() {
   return (
      <Svg
         width="100%"
         height="100%"
         viewBox="0 0 220 190"
         preserveAspectRatio="xMaxYMax slice"
         fill="none"
      >
         <Path
            d="M214 12 Q168 26 148 86 Q202 68 214 12 Z"
            stroke={TextColor.onDark}
            strokeOpacity={0.13}
            strokeWidth={1.2}
         />
         <Path
            d="M202 74 Q156 88 136 148 Q190 130 202 74 Z"
            stroke={TextColor.onDark}
            strokeOpacity={0.1}
            strokeWidth={1.2}
         />
         <Path
            d="M228 0 Q186 70 132 178"
            stroke={TextColor.onDark}
            strokeOpacity={0.08}
            strokeWidth={1.2}
         />
      </Svg>
   );
}

/**
 * A category disc with its label under it. Local because it appears once, in one
 * rail, and `docs/COMPONENTS.md` §2 rule 2 says the first occurrence stays where
 * it is used. `Tile` is the wrong shape — this is a mark, not a card.
 */
function Curation({ name }: { name: string }) {
   return (
      <View style={styles.curation}>
         <PlaceholderBlock
            height={Sizes.categoryDisc}
            radius={Radius.pill}
            style={styles.curationDisc}
         />
         <Text style={styles.curationLabel} numberOfLines={2}>
            {name}
         </Text>
      </View>
   );
}

const styles = StyleSheet.create({
   /** Both of these are gaps between band children, not shapes. */
   store: {
      marginTop: Space.md,
   },
   stats: {
      marginTop: Space.lg,
   },

   curation: {
      width: Sizes.categoryDisc,
      alignItems: 'center',
      gap: Space.sm,
   },
   curationDisc: {
      width: Sizes.categoryDisc,
   },
   curationLabel: {
      ...TextStyles.label,
      color: TextColor.primary,
      textAlign: 'center',
   },

   compliance: {
      gap: Space.xs,
   },
   complianceText: {
      ...TextStyles.micro,
      color: TextColor.tertiary,
   },
});
