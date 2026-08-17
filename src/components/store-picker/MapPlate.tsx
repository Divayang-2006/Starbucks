import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
   Easing,
   useAnimatedStyle,
   useSharedValue,
   withRepeat,
   withTiming,
} from 'react-native-reanimated';

import { SirenLogo } from '@/components/onboarding/SirenLogo';
import { Space, Surface, TextColor, TextStyles } from '@/theme';

/**
 * What fills the map's frame when there is no map: while the style loads, on
 * web, without a token, or after a load error.
 *
 * It is a *plate*, not an error state — House Green with the siren bled off the
 * corner, the same printed-mark treatment the loyalty card uses. The screen
 * behind it is fully usable in every one of these cases, so this must not read
 * as a failure; it reads as the map's absence being accounted for.
 *
 * The siren is worth its ~8,000 character path here: at 240pt the detail is the
 * whole point, and there is exactly one of it.
 */

export type PlateReason = 'loading' | 'unsupported' | 'noToken' | 'error';

const COPY: Record<PlateReason, { title: string; body: string }> = {
   loading: {
      title: 'Setting the map down',
      body: 'A moment while the tiles arrive.',
   },
   unsupported: {
      title: 'The map is native-only',
      body: 'Maps need a dev build on this project. Every store is in the list below.',
   },
   noToken: {
      title: 'No map token yet',
      body: 'Add EXPO_PUBLIC_MAPBOX_TOKEN to .env and restart with --clear. The list below works regardless.',
   },
   error: {
      title: 'The map did not load',
      body: 'Usually the connection or the token. The list below still knows where everything is.',
   },
};

const BREATH = { duration: 1600, easing: Easing.inOut(Easing.quad) } as const;

type Props = {
   reason: PlateReason;
   /**
    * How much of the plate the sheet is standing on. The plate fills the whole
    * map frame, so without this the copy would sit behind the sheet.
    */
   bottomInset: number;
};

export function MapPlate({ reason, bottomInset }: Props) {
   const copy = COPY[reason];
   const breath = useSharedValue(0);

   useEffect(() => {
      // Loading breathes; the three terminal states hold still. A pulsing
      // permanent state would keep promising something is about to happen.
      if (reason !== 'loading') {
         breath.set(withTiming(0, { duration: 240 }));
         return;
      }
      breath.set(withRepeat(withTiming(1, BREATH), -1, true));
   }, [reason, breath]);

   const markStyle = useAnimatedStyle(() => ({ opacity: 0.06 + breath.get() * 0.05 }));

   return (
      <View style={styles.plate}>
         <Animated.View style={[styles.mark, markStyle]} pointerEvents="none">
            <SirenLogo width={260} color={TextColor.onDark} />
         </Animated.View>
         <View style={[styles.copy, { paddingBottom: bottomInset + Space.xl }]}>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.body}>{copy.body}</Text>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   plate: {
      ...StyleSheet.absoluteFill,
      backgroundColor: Surface.inverse,
      justifyContent: 'flex-end',
      overflow: 'hidden',
   },
   mark: {
      position: 'absolute',
      right: -78,
      top: -52,
   },
   copy: {
      paddingHorizontal: Space.xl,
      gap: Space.xs,
   },
   title: {
      ...TextStyles.h3,
      color: TextColor.onDark,
   },
   body: {
      ...TextStyles.bodySm,
      color: TextColor.onDarkMuted,
      maxWidth: 300,
   },
});
