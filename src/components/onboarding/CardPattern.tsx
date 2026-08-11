import { Circle, G, Path } from "react-native-svg";

import type { PatternId } from "./cardStyles";
import { CARD } from "./theme";

/**
 * Guilloché, near enough: concentric rings struck from off the right edge, the
 * way the engine-turned security print on a real card runs.
 */
const ARCS = [58, 92, 126, 160, 194, 228];

/** 45deg rulings. Generated wide enough to cover the card at that angle. */
const HAIRLINES = Array.from({ length: 26 }, (_, i) => {
   const x = -CARD.height + i * 16;
   return `M ${x} ${CARD.height} L ${x + CARD.height} 0`;
});

const DOTS: { cx: number; cy: number }[] = [];
for (let y = 12; y < CARD.height; y += 24) {
   for (let x = 12; x < CARD.width; x += 24) DOTS.push({ cx: x, cy: y });
}

/**
 * The printed texture over a card face. Returns SVG children, so it has to be
 * rendered inside the face's own <Svg>. Nothing is clipped here — the face
 * layer already has a rounded `overflow: hidden`, which trims the corners.
 */
export function CardPattern({ pattern }: { pattern: PatternId }) {
   if (pattern === "arcs") {
      return (
         <G>
            {ARCS.map((r) => (
               <Circle
                  key={r}
                  cx={CARD.width + 10}
                  cy={CARD.height * 0.22}
                  r={r}
                  fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth={1}
               />
            ))}
         </G>
      );
   }

   if (pattern === "hairlines") {
      return (
         <G>
            {HAIRLINES.map((d) => (
               <Path
                  key={d}
                  d={d}
                  stroke="rgba(255,255,255,0.055)"
                  strokeWidth={1}
               />
            ))}
         </G>
      );
   }

   return (
      <G>
         {DOTS.map((dot) => (
            <Circle
               key={`${dot.cx}-${dot.cy}`}
               cx={dot.cx}
               cy={dot.cy}
               r={1.6}
               fill="rgba(255,255,255,0.09)"
            />
         ))}
      </G>
   );
}
