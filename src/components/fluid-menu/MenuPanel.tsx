/**
 * The panel: two round controls at the top, then the rows.
 *
 * Laid out under the app card rather than beside it — the card is a sibling that
 * happens to cover the right-hand two thirds, so this fills the screen and lets
 * the rows run underneath it. That is why `MenuRow` has right padding it can't
 * show: a row's tap target reaches behind the card, which is exactly what you
 * want when the card is not accepting touches anyway.
 *
 * The controls lead the rows in. They are the frame; the rows are the content,
 * and content arriving before its frame reads as a glitch.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
   Extrapolation,
   interpolate,
   useAnimatedStyle,
   type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glyph } from '@/components/chrome/glyphs';
import { Accent, Border, Radius, Space, Surface, TextColor, TextStyles } from '@/theme';

import { MenuRow } from './MenuRow';
import type { MenuItem } from './items';

type Props = {
   items: readonly MenuItem[];
   progress: SharedValue<number>;
   /** Initials for the avatar disc. Empty falls back to the person glyph. */
   initials?: string;
   /** Secondary line under the controls. The store, in practice. */
   caption?: string;
   /**
    * Whether the Account control wears its gold dot.
    *
    * It used to be drawn unconditionally, which made it a decoration that reads
    * as a claim: the panel announced unread activity on every open, with no
    * prop, no state and no session field behind it — nothing that could ever
    * retract it. Off by default now, and the day something real is unread this
    * is where it says so.
    */
   unread?: boolean;
   /**
    * Whether the panel is the only thing on screen as far as assistive tech is
    * concerned. `pointerEvents` on the card stops fingers and does nothing for
    * VoiceOver, so without this the reader walks straight past the scrim into
    * Home and the five tab items behind it.
    *
    * Only ever set while open. Closed, every element here animates to
    * `opacity: 0` and is already skipped, so there is nothing to hide.
    */
   modal?: boolean;
   onSelect: (item: MenuItem) => void;
   onProfile: () => void;
   onClose: () => void;
};

export function MenuPanel({
   items,
   progress,
   initials,
   caption,
   unread = false,
   modal = false,
   onSelect,
   onProfile,
   onClose,
}: Props) {
   const insets = useSafeAreaInsets();

   /** Front-loaded: finished by progress 0.4, which is before row 0 lands. */
   const chromeStyle = useAnimatedStyle(() => {
      const a = interpolate(progress.get(), [0, 0.4], [0, 1], Extrapolation.CLAMP);
      return {
         opacity: a,
         transform: [{ scale: 0.86 + 0.14 * a }],
      };
   });

   const captionStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.get(), [0.15, 0.55], [0, 1], Extrapolation.CLAMP),
   }));

   return (
      <View
         style={[styles.root, { paddingTop: insets.top + Space.sm }]}
         pointerEvents="box-none"
         accessibilityViewIsModal={modal}
      >
         <Animated.View style={[styles.chrome, chromeStyle]}>
            <RoundButton label="Account" onPress={onProfile}>
               {initials ? (
                  <Text style={styles.initials} maxFontSizeMultiplier={1.1}>
                     {initials}
                  </Text>
               ) : (
                  <Glyph id="person" size={21} color={TextColor.onDark} strokeWidth={1.8} />
               )}
               {unread ? <View style={styles.unreadDot} /> : null}
            </RoundButton>

            <RoundButton label="Close menu" onPress={onClose}>
               <Glyph id="close" size={20} color={TextColor.onDark} strokeWidth={1.9} />
            </RoundButton>
         </Animated.View>

         {caption ? (
            <Animated.Text style={[styles.caption, captionStyle]} numberOfLines={1}>
               {caption}
            </Animated.Text>
         ) : null}

         <View style={styles.rows}>
            {items.map((item, index) => (
               <View
                  key={item.id}
                  // A change of group is a gap. Rules would fight the gradient.
                  style={index > 0 && item.group !== items[index - 1].group ? styles.groupGap : null}
               >
                  <MenuRow item={item} index={index} progress={progress} onPress={onSelect} />
               </View>
            ))}
         </View>
      </View>
   );
}

/**
 * Translucent white on green, per DESIGN_SYSTEM §2 — `Surface.onDarkFill` is the
 * token for exactly this, and it is the same fill Home's header controls use, so
 * the control the panel opens with matches the one that opened it. No shadow: it
 * sits on a coloured field, and a shadow there only muddies the gradient under it.
 */
function RoundButton({
   label,
   onPress,
   children,
}: {
   label: string;
   onPress: () => void;
   children: React.ReactNode;
}) {
   return (
      <Pressable
         accessibilityRole="button"
         accessibilityLabel={label}
         hitSlop={Space.sm}
         onPress={onPress}
         style={({ pressed }) => [styles.round, pressed && styles.pressed]}
      >
         {children}
      </Pressable>
   );
}

/** Above the 44pt floor in `Sizes.tap`, with room for two initials. */
const CONTROL = 46;

const styles = StyleSheet.create({
   root: {
      ...StyleSheet.absoluteFill,
      paddingBottom: Space.xl,
   },
   chrome: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Space.xl,
      // Scaling from its own centre would swing both buttons inward; from the top
      // left they grow in place.
      transformOrigin: 'top left',
   },
   caption: {
      ...TextStyles.caps,
      textTransform: 'uppercase',
      color: TextColor.onDarkMuted,
      paddingHorizontal: Space.xl,
      marginTop: Space.lg,
   },
   /**
    * `flex: 1` with the rows centred: the list is the screen's subject, and
    * pinning it under the controls leaves a pool of dead green at the bottom of a
    * tall device.
    */
   rows: {
      flex: 1,
      justifyContent: 'center',
      paddingRight: Space.base,
   },
   groupGap: {
      marginTop: Space.xl,
   },
   round: {
      width: CONTROL,
      height: CONTROL,
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Surface.onDarkFill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Border.hairOnDark,
   },
   initials: {
      ...TextStyles.label,
      color: TextColor.onDark,
   },
   /** Gold, because it is the Stars accent and the only warm note this green takes. */
   unreadDot: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 7,
      height: 7,
      borderRadius: Radius.pill,
      backgroundColor: Accent.gold,
   },
   pressed: {
      opacity: 0.65,
   },
});
