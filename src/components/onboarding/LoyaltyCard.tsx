import { useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
   type SharedValue,
   useAnimatedReaction,
   useAnimatedStyle,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { CardBack } from "./CardBack";
import type { FaceWiring } from "./CardFace";
import { CardFront } from "./CardFront";
import type { Face } from "./fields";
import { tapFeedback } from "./haptics";
import { CARD, Palette } from "./theme";

type Props = FaceWiring & {
   /** 0 = front, 1 = back. Anything in between is mid-turn. */
   flip: SharedValue<number>;
};

/**
 * The card as a two-sided object.
 *
 * The turn is deliberately two half-turns rather than one 180deg flip. A flip
 * that ends at 180 leaves whichever face is showing inside a mirrored,
 * permanently transformed subtree — and that subtree contains live text
 * inputs, where mirrored rendering and transformed caret hit-testing are
 * exactly the things that break on Android. Going 0 -> 90 with the front lit,
 * then -90 -> 0 with the back lit, ends at *zero* rotation either way. Both
 * faces are always upright and untransformed at rest, and `backfaceVisibility`
 * — famously unreliable on Android — never enters into it.
 */
export function LoyaltyCard({ flip, ...wiring }: Props) {
   /**
    * Mirrors `flip` across the halfway mark, a frame or so behind it. Touches
    * and screen readers need a plain boolean; only the visuals can live on the
    * UI thread.
    */
   const [showing, setShowing] = useState<Face>("front");

   useAnimatedReaction(
      () => flip.get() >= 0.5,
      (isBack, was) => {
         if (was === null || isBack === was) return;
         scheduleOnRN(setShowing, isBack ? "back" : "front");
         // Fired at the edge-on moment, which is what sells it as an object
         // being turned over rather than a view being cross-faded.
         scheduleOnRN(tapFeedback);
      },
   );

   const shellStyle = useAnimatedStyle(() => {
      const p = flip.get();
      const deg = p < 0.5 ? p * 180 : (p - 1) * 180;
      return {
         transform: [{ perspective: 700 }, { rotateY: `${deg}deg` }],
      };
   });

   const frontStyle = useAnimatedStyle(() => ({
      opacity: flip.get() < 0.5 ? 1 : 0,
   }));

   const backStyle = useAnimatedStyle(() => ({
      opacity: flip.get() < 0.5 ? 0 : 1,
   }));

   const front = showing === "front";

   return (
      <Animated.View style={[styles.shell, shellStyle]}>
         <Animated.View
            style={[styles.layer, frontStyle]}
            pointerEvents={front ? "auto" : "none"}
            accessibilityElementsHidden={!front}
            importantForAccessibility={front ? "auto" : "no-hide-descendants"}
         >
            <CardFront {...wiring} />
         </Animated.View>

         <Animated.View
            style={[styles.layer, backStyle]}
            pointerEvents={front ? "none" : "auto"}
            accessibilityElementsHidden={front}
            importantForAccessibility={front ? "no-hide-descendants" : "auto"}
         >
            <CardBack {...wiring} />
         </Animated.View>
      </Animated.View>
   );
}

const styles = StyleSheet.create({
   // Shadow and clipping live on separate views on purpose: `overflow: hidden`
   // on iOS clips the view's own shadow away.
   shell: {
      width: CARD.width,
      height: CARD.height,
      borderRadius: CARD.radius,
      shadowColor: Palette.pocketEdge,
      shadowOpacity: 0.32,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 14 },
      elevation: 14,
   },
   layer: {
      ...StyleSheet.absoluteFill,
      borderRadius: CARD.radius,
      overflow: "hidden",
   },
});
