# City imagery

Five tiles for the store picker's city rail. Same discipline as
[`PRODUCT_IMAGERY.md`](PRODUCT_IMAGERY.md): one shoot, one locked specification,
and exactly one line that changes between images. A rail is even less forgiving
than the menu grid — the five tiles are side by side and always on screen
together, so a single one lit differently is the only thing anyone will see.

These are generated stand-ins for a UI recreation. They are not Starbucks
marketing assets and the monuments in them are landmarks, not endorsements.

## What they are for

The rail currently draws text pills. It is becoming a strip of cards: a square
landmark tile, the city name under it, the store count under that. Tapping one
flies the camera and narrows the list, exactly as the pill does now.

Four cities have stores, and the rail's first entry is `All stores`, which is not
a place. See the note on it at the end — it still gets a tile, and the tile is
the reason the set holds together.

| Rail entry | `CityFilter.id` | Filename | Landmark |
| --- | --- | --- | --- |
| All stores | `all` | `all.png` | none — see below |
| Pune | `Pune` | `pune.png` | Shaniwar Wada, the Delhi Darwaza gate |
| Mumbai | `Mumbai` | `mumbai.png` | Gateway of India |
| Bengaluru | `Bengaluru` | `bengaluru.png` | Vidhana Soudha |
| New Delhi | `New Delhi` | `new-delhi.png` | India Gate |

Files go in `assets/city-imgs/`, named by the filter id lowercased with spaces as
hyphens. The id **is** the city string (`geo.ts`), so the mapping is mechanical
and no lookup table is needed.

Landmark choice is silhouette-first. Shaniwar Wada over the Aga Khan Palace,
India Gate over the Qutub Minar, Vidhana Soudha over Bangalore Palace — at 96pt
you are reading an outline, and a building that is only recognisable by its
detail is not recognisable at all.

## The background is not a choice, and it is not transparent

The tile sits inside a pill whose fill **animates**: translucent white over House
Green when unselected, solid cream when selected (`CityRail.tsx`). Anything that
inherits the surface behind it therefore changes contrast as you tap, and a
monument tuned for one state is invisible in the other. That is the same bug the
map pins had.

So the tile brings its own opaque ground and is unaffected by the state under it:

| Layer | Token | Value |
| --- | --- | --- |
| Header band behind the rail | `Surface.inverse` | `#1E3932` |
| Pill, unselected | — | `rgba(255,255,255,0.13)` |
| Pill, selected | `Surface.app` | `#F7F5F0` |
| **The image square** | `Surface.tint` | `#D4E9E2` |

Pale mint, flat, edge to edge. It reads as a deliberate object on both pill
states because it matches neither.

## Two app rules the generator will not guess

- **No baked corner radius.** The card clips to `Radius.lg` itself. A pre-rounded
  image gets double-rounded, and the mint corners show through as four pale
  crescents.
- **No baked shadow.** `Elevation.card` is green-tinted and applied in code. A
  grey drop shadow rendered into the PNG is the single clearest tell of a cheap
  clone, and it will not match the four tiles beside it.

## The master prompt

Swap only the `LANDMARK:` line. Everything below it is a lock and must be sent
verbatim every time.

```
Render the landmark named below as a single isometric 3D model to the exact
specification that follows. The specification is identical for every image in
this set and must not be reinterpreted.

LANDMARK: <name, city — e.g. Gateway of India, Mumbai: the basalt triumphal arch
on the waterfront, central archway flanked by four turrets>

--- LOCKED SPECIFICATION (identical for every image in this set) ---

CANVAS
- Square 1:1, 2048 x 2048.
- Background: one flat solid colour, hex #D4E9E2 (pale mint). Absolutely
  uniform — no gradient, no vignette, no texture, no paper grain, no sky, no
  horizon, no ground plane extending to the edges.
- Square corners. Do not round the corners of the image.

FORM
- One building only, modelled as a clean isometric 3D object, as if a small
  physical model of it were sitting on a table.
- The building stands on a low square base tile with slightly bevelled edges. The
  base is part of the model, not the background, and its front-facing corner
  points at the viewer.
- Simplified, not detailed. Read the silhouette and the two or three features
  that identify the building; discard cornices, mouldings, window mullions,
  signage and surface ornament. The whole model should survive being reduced to
  96 pixels wide.

CAMERA
- True isometric, 30 degrees above horizontal, rotated 45 degrees so one corner
  of the base faces the viewer. No perspective convergence, no vanishing point,
  no tilt, no dutch angle.
- Orthographic projection. Parallel lines stay parallel.
- Entire model in sharp focus. No depth of field, no bokeh, no motion blur.

SCALE AND PLACEMENT (identical across all landmarks)
- The model is centred horizontally and occupies 78% of the frame width.
- The base tile's lowest point sits at 88% down the frame.
- Render every landmark to this SAME on-canvas size regardless of its real-world
  height. A wide low arch and a tall tower must fill the frame equally — match
  the bounding box, not the architecture.

MATERIAL AND PALETTE
- Matte clay or soft moulded plastic. No gloss, no metal, no glass, no
  reflections, no transparency, no visible texture maps.
- Building body: deep green, hex #1E3932.
- Planes catching the key light: mid green, hex #006241.
- Edge highlights, steps, columns and any pale stone detail: warm cream, hex
  #F7F5F0, used sparingly — no more than a fifth of the visible surface.
- Base tile: mid green, hex #006241, one flat value.
- One accent only, hex #CBA258 (warm gold), on a single small feature — a finial,
  a dome, a flag, a doorway. If the building has no obvious candidate, omit the
  accent entirely rather than inventing a place for it.
- No other colours anywhere in the image.

LIGHTING
- Large soft key from the upper left at 45 degrees. Soft white bounce fill from
  the lower right.
- One soft contact shadow directly beneath the base tile, contained within the
  frame, no more than 12% darker than the background. Nothing cast onto the
  background beyond it.
- No rim light, no hard specular hotspots, no dramatic contrast, no ambient
  occlusion crunch in the corners.

EXCLUDE
No text, captions, labels, city names, watermarks, or graphic overlays. No
people, vehicles, boats, birds, trees, plants, clouds, water, flags of nations,
or environmental context of any kind. No roads, no surrounding buildings, no
skyline. No borders, frames, or rounded corners. No drop shadow on the image
itself. No collage, no multiple views, no exploded diagram, no scale figures.
```

### The `all.png` exception

`All stores` is not a city and must not be given a landmark — borrowing one
city's monument to mean "everywhere" makes that city look selected. It takes the
same prompt with the `FORM` block replaced:

> FORM OVERRIDE FOR THE ALL-STORES TILE: no building. The same low square base
> tile, empty, with four small rounded map pins standing on it at different
> heights, evenly scattered, all in the same deep green as the building body with
> the gold accent on the tallest pin's head. Everything else — canvas, camera,
> scale, material, palette, lighting, exclusions — is unchanged.

Generate this one **last**, once the four cities have settled, so it inherits
their light rather than setting it.

## Working method

1. Generate **Mumbai** first and iterate until the background is genuinely flat
   `#D4E9E2` and the isometric angle is true. The Gateway of India is the best
   reference subject in the set: it is symmetrical, its silhouette survives
   simplification, and it has an obvious gold candidate in the central archway.
   That image becomes the style reference.
2. For every subsequent tile, attach the approved Mumbai image and add: "Match
   the camera angle, projection, scale, material, palette, lighting and
   background of the attached image exactly. Only the building changes."
3. Spot-check the background hex with a colour picker. Generators drift cool on
   mint; `#D0E6E0` instead of `#D4E9E2` shows as a faint square against the tile
   beside it.
4. Lay all five out in a row at 96pt before accepting any of them. They are never
   seen alone, and the only test that matters is whether one of them jumps.
5. Export PNG. Keep a transparent-background copy too if the generator can make
   one — a later screen may want the model over a photo, and re-cutting a baked
   mint square is worse than having asked for it now.
