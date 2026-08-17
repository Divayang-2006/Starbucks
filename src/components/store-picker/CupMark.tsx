import Svg, { Path, Rect } from 'react-native-svg';

/**
 * A cup silhouette — lid and tapered body, one colour, two primitives.
 *
 * The real `SirenLogo` is an ~8,000 character single path. That is the right
 * mark for the header and the loading plate, where it is 40pt+ and the detail
 * earns its keep, but twelve of them on a map at 16pt would be a lot of native
 * path geometry rendering as mud. A cup reads instantly at pin size and is just
 * as unmistakably ours once it is sitting inside a House Green disc.
 */

type Props = {
   size: number;
   color: string;
   opacity?: number;
};

export function CupMark({ size, color, opacity = 1 }: Props) {
   return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" opacity={opacity}>
         <Rect x={4.6} y={4.6} width={14.8} height={3.4} rx={1.7} fill={color} />
         <Path
            d="M6.6 9.7 H17.4 L15.9 19 Q15.72 20.4 14.3 20.4 H9.7 Q8.28 20.4 8.1 19 Z"
            fill={color}
         />
      </Svg>
   );
}
