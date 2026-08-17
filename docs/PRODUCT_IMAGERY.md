# Product imagery

Every menu image is one shot from one shoot. The whole point of the menu grid is
that only the *product* changes between tiles — not the light, not the angle, not
the scale, not the background. One inconsistent tile is more visible than ten
mediocre consistent ones.

These are generated (ChatGPT / Gemini) from the real Starbucks product photo as a
reference. This is a UI recreation; the images are stand-ins for layout and are
not to be presented as Starbucks marketing assets.

## The background is not a choice

`ProductThumb` paints its box `Surface.sunken` — `#EFECE5` — before the photo
lands on it. The image background must be that exact flat value, so the photo
dissolves into its own tile and the tile reads as a recessed square on the white
card.

| Surface | Token | Value |
| --- | --- | --- |
| Screen | `Surface.app` | `#F7F5F0` |
| Card holding the row | `Surface.raised` | `#FFFFFF` |
| **The image square** | `Surface.sunken` | `#EFECE5` |

Not white — the tile disappears into the card. Not grey — it turns a warm cream
palette cold. Not a gradient, not a vignette: the tile is 96pt and any falloff at
that size just looks like a dirty JPEG.

## Two app rules the generator will not guess

- **No baked corner radius.** The tile clips to `Radius.lg` itself with
  `overflow: 'hidden'`. A pre-rounded image gets double-rounded.
- **Keep the bottom-left corner quiet.** The FSSAI diet mark sits on a white pad
  inset `Space.xs` from the bottom-left. Nothing important goes in the bottom-left
  ~22% of the frame.

## The master prompt

Attach the real reference photo, then paste this. Swap only the `PRODUCT:` line
between items — everything below it is a lock and must be sent verbatim every
time.

```
Re-shoot the product in the attached reference photo to the exact studio
specification below. The product itself must match the reference precisely —
same cup, same lid, same drink layers and colours, same foam, same garnish, same
proportions. Do not redesign, restyle, or reinterpret the product. Only the
photography changes.

PRODUCT: <item name — e.g. Tiramisu Frappuccino, Tall cup, clear dome lid,
whipped cream, cocoa dusting>

--- LOCKED SPECIFICATION (identical for every image in this set) ---

CANVAS
- Square 1:1, 2048 x 2048.
- Background: one flat solid colour, hex #EFECE5 (warm cream). Absolutely
  uniform — no gradient, no vignette, no texture, no paper grain, no backdrop
  sweep, no visible floor or wall, no horizon line.
- Square corners. Do not round the corners of the image.

SUBJECT PLACEMENT (identical across all items)
- Exactly one product, centred horizontally.
- The product occupies 72% of the frame height, with the base of the cup at 86%
  down the frame. Render every item to this SAME on-canvas height regardless of
  its real-world size — a Short and a Venti must appear the same height in frame.
- Nothing enters the bottom-left corner of the frame (leave the lower-left 22%
  square visually empty background).

CAMERA
- Straight-on frontal, eye level, camera at the vertical mid-point of the cup.
- 85mm equivalent lens, no perspective distortion, no tilt, no dutch angle.
- Full product in sharp focus front to back. No shallow depth of field, no bokeh,
  no motion blur.

LIGHTING
- Large soft key from the upper left at 45 degrees, white bounce fill from the
  right.
- One soft highlight running down the left edge of the cup. No hard specular
  hotspots, no rim light, no dramatic contrast.
- Neutral white balance, 5500K. No warm or cool colour cast on the background —
  the background must remain exactly #EFECE5 in every pixel it occupies.

SHADOW
- One soft elliptical contact shadow directly beneath the product, feathered,
  approximately 12% opacity, falling slightly to the lower right.
- The shadow must not touch any frame edge. No cast shadow on a wall, no
  reflection, no mirrored surface, no visible tabletop.

RENDERING
- Photorealistic commercial product photography. Crisp edges, accurate material
  detail — condensation on cold cups, ice definition, foam texture, the sheen of
  the plastic dome lid.
- The Starbucks siren logo faces the camera, centred on the cup, undistorted and
  legible.

EXCLUDE
No text, captions, labels, watermarks, price tags, or graphic overlays. No props,
garnishes, coffee beans, spilled grounds, cinnamon sticks, napkins, straws lying
loose, plates, saucers, trays, wooden boards, marble slabs, or table surfaces. No
hands, people, or body parts. No steam or smoke. No lifestyle or cafe
environment. No background objects of any kind. No borders, frames, drop shadows
on the image itself, or rounded corners. No collage, no multiple angles, no
before/after, no size comparison.
```

## Category exception — food

Drinks, packaged coffee and merchandise are all straight-on frontal. Plated food
straight-on is a wall of bread, so food gets **one** alternate angle and nothing
else changes:

> CAMERA OVERRIDE FOR FOOD: elevated three-quarter at 35 degrees above
> horizontal, still centred, still 85mm equivalent, still no tilt. Background,
> lighting, shadow, scale and exclusions are unchanged.

Use 35 degrees for every food item. Two locked angles across the whole catalogue,
never three.

## Working method

1. Generate the **first** item and iterate until the background is genuinely flat
   `#EFECE5` and the framing matches. That image becomes the style reference.
2. For every subsequent item, attach **both** the new product reference *and* the
   approved first image, and add: "Match the lighting, camera angle, scale,
   shadow and background of the second attached image exactly."
3. Spot-check the background hex with a colour picker. Generators drift warm;
   a tile that is `#EEEAE2` instead of `#EFECE5` shows as a faint square against
   the tile behind it.
4. Export PNG. If your generator can produce transparency, also keep a
   transparent-background copy — the PDP hero draws the product over a
   category-tinted scrim (`CategoryAccent.tint`), where a baked cream square
   would box it in.
