/**
 * The app, as far as this prototype is concerned.
 *
 * A transition can only be judged against content, so this is a real screen and
 * not a grey rectangle: the actual header band, the actual sheet, the actual
 * rails, built from the same shared components Home is built from. When the card
 * shrinks you are looking at the same thing you will be looking at in the app.
 *
 * Deliberately *not* an import of Home. A route is a route; reaching into one
 * from another screen couples the prototype to whatever Home happens to be doing
 * that week. What keeps the two from drifting anyway is that neither of them
 * draws anything: both are `Screen` → `ScreenHeader` → `Sheet` → `Tile`s and
 * `ProductCard`s, so a change to any of those lands on the mock for free. **A
 * mock that drifts from the thing it mocks is worse than no mock**, and the only
 * defence against that is having nothing local left to drift.
 *
 * The pill below is the exception, and it has to be: the real bar is a
 * `UITabBarController` this screen is not inside.
 */

import { StyleSheet, Text, View } from 'react-native';

import { ProductCard } from '@/components/brand';
import {
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
   type GlyphId,
} from '@/components/chrome';
import {
   Elevation,
   IconSize,
   RailCard,
   Radius,
   Space,
   Stroke,
   Surface,
   TextColor,
   TextStyles,
} from '@/theme';

const REWARDS = [
   { title: 'Free Customization', cost: 200 },
   { title: 'Handcrafted Drink', cost: 300 },
];

const RECOMMENDED = [
   { name: 'Tiramisu Frappuccino', price: 588 },
   { name: 'Iced Coconut Matcha', price: 472.5 },
   { name: 'Malabar Flat White', price: 456.75 },
];

/** The five tabs, for the static pill. Order per `docs/APP_METADATA.md` §2. */
const TAB_GLYPHS: readonly GlyphId[] = ['home', 'gift', 'order', 'pay', 'rewards'];

type Props = {
   greeting: string;
   storeName: string;
   /** Opens the panel. Wired to the hamburger, the way the real app will be. */
   onMenu: () => void;
   /** Leaves the prototype entirely. */
   onExit: () => void;
   /** Which row was last chosen, echoed back so tap targets can be verified. */
   picked?: string;
};

export function StageMock({ greeting, storeName, onMenu, onExit, picked }: Props) {
   return (
      /** `Screen` owns the background and the scroll; this only holds the pill over it. */
      <View style={styles.root}>
         <Screen tone="inverse">
            <ScreenHeader
               tone="inverse"
               sheetBelow
               kicker={`Collecting from ${storeName}`}
               title={greeting}
               left={
                  <HeaderButton label="Open menu" onPress={onMenu}>
                     <Glyph
                        id="menu"
                        size={IconSize.md}
                        color={TextColor.onDark}
                        strokeWidth={Stroke.medium}
                     />
                  </HeaderButton>
               }
               right={
                  <HeaderButton label="Exit prototype" onPress={onExit}>
                     <Glyph
                        id="close"
                        size={IconSize.md}
                        color={TextColor.onDark}
                        strokeWidth={Stroke.medium}
                     />
                  </HeaderButton>
               }
            >
               <StatStrip tone="inverse" style={styles.stats}>
                  <Stat label="Stars" value="0" />
                  <Stat label="Rewards" value="0" />
                  <Stat label="Pay" value="₹0.00" />
               </StatStrip>
            </ScreenHeader>

            <Sheet>
               {picked ? (
                  <Gutter>
                     <View style={styles.echo}>
                        <Glyph
                           id="chevronRight"
                           size={IconSize.xs}
                           color={TextColor.action}
                           strokeWidth={Stroke.medium}
                        />
                        <Text style={styles.echoText}>Menu tap landed on “{picked}”</Text>
                     </View>
                  </Gutter>
               ) : null}

               <Section title="Redeem your Stars" action="View all">
                  <Rail>
                     {REWARDS.map((reward) => (
                        <Tile
                           key={reward.title}
                           width={RailCard.standard}
                           media={<PlaceholderBlock height={84} />}
                           title={reward.title}
                           sub={`Redeem this for ${reward.cost}★`}
                        />
                     ))}
                  </Rail>
               </Section>

               <Section title="Recommended" action="View all">
                  <Rail>
                     {RECOMMENDED.map((item) => (
                        <ProductCard
                           key={item.name}
                           name={item.name}
                           price={item.price}
                           veg
                           width={RailCard.compact}
                           onAdd={() => {
                              // The harness is about the menu transition, not the cart.
                           }}
                        />
                     ))}
                  </Rail>
               </Section>
            </Sheet>
         </Screen>

         <StaticTabPill />
      </View>
   );
}

/**
 * The real pill comes from the tab navigator, which this screen is not inside, so
 * it is redrawn here from the same tokens. It is decoration — the point of the
 * prototype is what happens to the card, and a card with no tab bar in it does
 * not look like the app.
 */
function StaticTabPill() {
   return (
      <View style={styles.pill} pointerEvents="none">
         <View style={styles.pillCapsule} />
         {TAB_GLYPHS.map((glyph, index) => (
            <View key={glyph} style={styles.pillItem}>
               <Glyph
                  id={glyph}
                  size={23}
                  color={TextColor.onDark}
                  strokeWidth={index === 0 ? 2.15 : Stroke.regular}
               />
            </View>
         ))}
      </View>
   );
}

const PILL_MARGIN = Space.base;
const PILL_CAPSULE = 46;
/**
 * Local, because the app no longer has a tab bar height to import: the real bar
 * is a `UITabBarController` whose height is the system's and changes as it
 * minimizes. The pill drawn below is scenery for the menu transition, so it just
 * needs to be pill-sized.
 */
const PILL_HEIGHT = 64;

const styles = StyleSheet.create({
   root: {
      flex: 1,
   },
   stats: {
      marginTop: Space.lg,
   },

   echo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
      backgroundColor: Surface.tint,
      borderRadius: Radius.md,
      paddingVertical: Space.md,
      paddingHorizontal: Space.base,
   },
   echoText: {
      ...TextStyles.bodySmStrong,
      color: TextColor.primary,
      flexShrink: 1,
   },

   pill: {
      position: 'absolute',
      left: PILL_MARGIN,
      right: PILL_MARGIN,
      bottom: PILL_MARGIN,
      height: PILL_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: Radius.pill,
      backgroundColor: Surface.inverse,
      ...Elevation.floating,
   },
   pillCapsule: {
      position: 'absolute',
      // Spans from 5pt to the 20% mark — the first of five slots, inset the way
      // the real capsule is. Expressed as edges because a `width` in percent
      // cannot also carry the inset.
      left: 5,
      right: '80%',
      height: PILL_CAPSULE,
      borderRadius: Radius.pill,
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderColor: 'rgba(203,162,88,0.55)',
      borderWidth: 1,
   },
   pillItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
   },
});
