import { type ReactElement } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Accent, Action, Surface } from '@/theme';

import { ALL_CITIES } from './geo';

/**
 * Placeholder art for the city rail's landmark cards.
 *
 * **These are stand-ins with a deadline.** `docs/CITY_IMAGERY.md` specifies the
 * real thing — isometric clay models of Shaniwar Wada, the Gateway of India,
 * Vidhana Soudha and India Gate, rendered 1:1 on a flat mint ground. When those
 * PNGs land in `assets/city-imgs/`, this whole file becomes one `<Image>` and
 * nothing around it changes: the card already sizes a square slot and clips it.
 *
 * What they have to prove in the meantime is that the *layout* works — that five
 * cards read as a set, that a 72pt square is enough to tell one place from
 * another, and that the selected state is legible. Five identical grey blocks
 * would prove none of that, so each is a distinct massing: a wide fortress gate,
 * a triumphal arch, a long civic block under a dome, a single tall arch.
 *
 * They are deliberately crude. Flat elevations on an isometric base tile rather
 * than real isometric geometry, because a placeholder that looks finished is one
 * nobody replaces.
 *
 * The palette is the spec's, exactly, so the swap is not also a colour change:
 * mint ground, House Green massing, mid green base and lit planes, cream for
 * openings, and one gold accent per tile and no more.
 */

type Props = {
   /** `CityFilter.id` — a city name, or `ALL_CITIES`. */
   city: string;
   size: number;
};

const BODY = Surface.inverse;
const LIT = Action.primary;
const STONE = Surface.app;
const GOLD = Accent.gold;

/** The isometric plinth every tile stands on. Drawn first, so massing sits over it. */
function Base() {
   return <Path d="M32 44 L58 52 L32 60 L6 52 Z" fill={LIT} />;
}

/** Shaniwar Wada — a wide fort gate between two square bastions. */
function Pune() {
   return (
      <>
         <Base />
         <Rect x={8} y={20} width={11} height={32} fill={BODY} />
         <Rect x={45} y={20} width={11} height={32} fill={BODY} />
         <Rect x={12} y={26} width={40} height={26} fill={BODY} />
         <Path d="M28 52 V38 a4 4 0 0 1 8 0 V52 Z" fill={STONE} />
         <Circle cx={32} cy={22} r={2.6} fill={GOLD} />
      </>
   );
}

/** Gateway of India — one central arch, four corner turrets. */
function Mumbai() {
   return (
      <>
         <Base />
         <Rect x={14} y={24} width={36} height={28} fill={BODY} />
         <Rect x={13} y={16} width={7} height={9} fill={BODY} />
         <Rect x={44} y={16} width={7} height={9} fill={BODY} />
         <Path d="M26 52 V36 a6 6 0 0 1 12 0 V52 Z" fill={STONE} />
         <Path d="M24 24 a8 8 0 0 1 16 0 Z" fill={GOLD} />
      </>
   );
}

/** Vidhana Soudha — a long low civic block under a central dome. */
function Bengaluru() {
   return (
      <>
         <Base />
         <Rect x={8} y={32} width={48} height={20} fill={BODY} />
         <Rect x={24} y={22} width={16} height={30} fill={BODY} />
         <Path d="M24 22 a8 8 0 0 1 16 0 Z" fill={BODY} />
         <Rect x={6} y={48} width={52} height={4} fill={STONE} />
         <Circle cx={32} cy={12} r={2.4} fill={GOLD} />
      </>
   );
}

/** India Gate — a single arch, and nothing else to mistake it for. */
function NewDelhi() {
   return (
      <>
         <Base />
         <Rect x={18} y={20} width={28} height={32} fill={BODY} />
         <Rect x={15} y={16} width={34} height={5} fill={BODY} />
         <Path d="M26 52 V32 a6 6 0 0 1 12 0 V52 Z" fill={STONE} />
         <Rect x={29} y={11} width={6} height={4} fill={GOLD} />
      </>
   );
}

/**
 * The all-stores tile. Pins, not a landmark — borrowing one city's monument to
 * mean "everywhere" makes that city look selected.
 */
function AllStores() {
   const pin = (cx: number, cy: number, fill: string) => (
      <Path
         key={`${cx}-${cy}`}
         d={`M${cx} ${cy + 11} L${cx - 4.5} ${cy + 2} a4.5 4.5 0 1 1 9 0 Z`}
         fill={fill}
      />
   );

   return (
      <>
         <Base />
         {pin(32, 20, GOLD)}
         {pin(17, 30, BODY)}
         {pin(46, 30, BODY)}
         {pin(32, 37, BODY)}
      </>
   );
}

const TILES: Record<string, () => ReactElement> = {
   [ALL_CITIES]: AllStores,
   Pune,
   Mumbai,
   Bengaluru,
   'New Delhi': NewDelhi,
};

export function CityTile({ city, size }: Props) {
   /**
    * A city with no drawing gets the plinth alone rather than nothing. The rail
    * is built from live store data, so a fifth city can appear the moment one
    * does — an empty square is a missing asset, a bare plinth is a tile waiting
    * for one.
    */
   const Art = TILES[city] ?? Base;

   return (
      <Svg width={size} height={size} viewBox="0 0 64 64">
         <Art />
      </Svg>
   );
}
