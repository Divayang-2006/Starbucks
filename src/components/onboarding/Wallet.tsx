import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { Palette, WALLET } from './theme';

/**
 * Builds the front panel outline: rounded rectangle whose top edge dips in the
 * middle. That curve is the only shape here `borderRadius` cannot express,
 * which is exactly why this piece is SVG and the back panel is a plain View.
 */
function pocketPath(w: number, h: number, r: number, dip: number): string {
  return [
    `M ${r},0`,
    `C ${w * 0.3},0 ${w * 0.34},${dip} ${w / 2},${dip}`,
    `C ${w * 0.66},${dip} ${w * 0.7},0 ${w - r},0`,
    `Q ${w},0 ${w},${r}`,
    `L ${w},${h - r}`,
    `Q ${w},${h} ${w - r},${h}`,
    `L ${r},${h}`,
    `Q 0,${h} 0,${h - r}`,
    `L 0,${r}`,
    `Q 0,0 ${r},0`,
    'Z',
  ].join(' ');
}

/** Sits behind the card. Just a dark rounded rectangle. */
export function PocketBack() {
  return <View style={styles.back} />;
}

/**
 * Sits in front of the card. Because it is rendered after the card in JSX it
 * paints on top, so the card appears to slide inside. No masking involved.
 */
export function PocketFront() {
  return (
    <View style={styles.front} pointerEvents="none">
      <Svg width={WALLET.width} height={WALLET.frontHeight}>
        <Defs>
          <LinearGradient id="pocketFace" x1="0" y1="0" x2="0.4" y2="1">
            <Stop offset="0" stopColor={Palette.pocket} />
            <Stop offset="1" stopColor={Palette.pocketEdge} />
          </LinearGradient>
        </Defs>
        <Path
          d={pocketPath(WALLET.width, WALLET.frontHeight, WALLET.radius, WALLET.lipDip)}
          fill="url(#pocketFace)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    position: 'absolute',
    top: WALLET.backTop,
    width: WALLET.width,
    height: WALLET.backHeight,
    borderRadius: WALLET.radius,
    backgroundColor: Palette.pocketEdge,
  },
  front: {
    position: 'absolute',
    top: WALLET.frontTop,
    width: WALLET.width,
    height: WALLET.frontHeight,
  },
});
