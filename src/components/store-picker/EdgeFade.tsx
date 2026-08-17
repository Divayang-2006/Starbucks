import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

/**
 * A vertical fade pinned to the top or bottom edge of the map, so the header
 * chrome and the sheet lip have something to sit against.
 *
 * Drawn with react-native-svg rather than expo-linear-gradient — the gradient is
 * two stops and svg is already a dependency, so this costs nothing and keeps the
 * SDK 57 package list where it is.
 *
 * It fades to House Green, never to black. This is the one place a scrim could
 * quietly reintroduce the neutral shadow the design system rules out.
 */

type Props = {
   edge: 'top' | 'bottom';
   height: number;
   color: string;
   /** Opacity at the edge itself. The far end is always fully transparent. */
   opacity?: number;
};

export function EdgeFade({ edge, height, color, opacity = 0.9 }: Props) {
   const id = `store-picker-fade-${edge}`;
   const top = edge === 'top';

   return (
      <Svg
         style={[styles.fade, top ? styles.top : styles.bottom, { height }]}
         pointerEvents="none">
         <Defs>
            <LinearGradient id={id} x1="0" y1={top ? '0' : '1'} x2="0" y2={top ? '1' : '0'}>
               <Stop offset="0" stopColor={color} stopOpacity={opacity} />
               {/* A midpoint stop stops the fade banding across a short run. */}
               <Stop offset="0.55" stopColor={color} stopOpacity={opacity * 0.28} />
               <Stop offset="1" stopColor={color} stopOpacity={0} />
            </LinearGradient>
         </Defs>
         <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
   );
}

const styles = StyleSheet.create({
   fade: {
      position: 'absolute',
      left: 0,
      right: 0,
   },
   top: { top: 0 },
   bottom: { bottom: 0 },
});
