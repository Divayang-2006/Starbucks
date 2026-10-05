# Reply to Batch 1 — approve, patch, then Batch 2

Attach `assets/figma_files/siren.svg` with this message. It unblocks Batch 2.

---

```text
Batch 1 approved with a patch list. Taking your four notes in order first.

1. THE IDEMPOTENCY DEPARTURE — accepted, and you were right to make it.
Delete-then-recreate on a variable collection would detach every binding in the
file, so a re-run of 01 after Batch 5 would silently unbind all 31 cards. Boards
are disposable, variables are not. Keep this split for every later script: any
object that other objects BIND to gets updated in place, never recreated.

2. "TWO STOPS DARKER" AT ×0.81 — accepted. I checked the arithmetic
independently and your correction is the right one: #00754A × 0.81 is #005F3C and
#002E1F × 0.81 is #002519. The redline's original #005E3B → #00251A was wrong on
three of four channels. Good catch on your own output.

3. GUEST — confirmed, with a change to how it differentiates.
Keep #1E3932 → #0B1F1A. It is on-token and the instinct is right. But at that hue
it sits within a few degrees of both Forest and Reserve, so colour alone will not
tell a guest card from an edition. Differentiate by CONTENT, not hue:

  · The name slot reads GUEST, not a member name.
  · The last-four slot is a dashed rule, not digits.
  · The tier badge slot is empty — a guest has no tier.
  · Balance boolean defaults to off.

A card carrying no member data can never be mistaken for one that does, which is a
sturdier distinction than four degrees of green. Guest stays an Edition value so no
card-shaped slot is ever empty.

4. THE SIREN — attached, and thank you for not drawing it. siren.svg is the
one-colour glyph on a 24×24 viewBox, white fill, single path, layer named "siren
mark". It is the same asset the app itself uses, so the Figma card and the built
card will carry an identical mark.

Build it per the reference card: scaled 4.92× against a 236×148 face, hung off the
BOTTOM-RIGHT so the card edge crops it, at 0.2 opacity — that is the reference
reading, not the master's 0.1. And the gloss sweep goes ABOVE it. The crop and the
gloss are the two things that make it read as printed into the plastic rather than
placed on top, so if a layer order ever looks ambiguous, those two resolve it.

Scale it proportionally. You measured 150px on the 300 card and 106px on the 236
card — 0.50 vs 0.449 of card width, which is not the same mark at two sizes. One
ratio, applied once, in the component.

5. THE BEBAS CALL — your read is correct, not backwards. 18 appears 60 times
because item names appear many times per screen and a screen title appears once.
18 = item names, 24 = screen title. Keep it.

────────────────────────────────────────────────────────────────────────────
PATCH TO 01 — a token gap, and it is my fault not yours

You built 39 colour variables from the list in my brief. The brief was incomplete:
it gave you only the `base` value of each drink-family accent when each family
actually has three. The real set is base / deep / tint per family, plus a default
family. So 01 is missing 15 tokens:

  Drink/espressoBase      #9D5116   Drink/espressoDeep     #5A2C0B   Drink/espressoTint     #F5E7D8
  Drink/coldBrewBase      #5B3A29   Drink/coldBrewDeep     #33200F   Drink/coldBrewTint     #EFE4DC
  Drink/frappuccinoBase   #7E5B86   Drink/frappuccinoDeep  #43294A   Drink/frappuccinoTint  #EFE6F1
  Drink/matchaBase        #3E7C59   Drink/matchaDeep       #1F4530   Drink/matchaTint       #E1EFE5
  Drink/refresherBase     #B23A5C   Drink/refresherDeep    #671E33   Drink/refresherTint    #F7E2E7
  Drink/defaultBase       #1E3932   Drink/defaultDeep      #0B1F1A   Drink/defaultTint      #D4E9E2

  Action/onPrimary        #FFFFFF   — type and glyphs on Action.primary
  Status/info             #1E3932   — informational, House Green

`deep` matters more than it looks: it is the gradient end for the PDP hero scrim,
which is the one surface where the accent system becomes visible at all. Shipping
only `base` would leave the scrim unbuildable and the accents unused for a second
time. Restructure the Drink group as base/deep/tint per family and rebuild the
board. Take the count from 39 to 56.

One description to fix while you are in there: Accent/tan currently reads "Counter
/ shelf warm tone." That instructs the next person to build the shelf out of
Accent.tan, which is how H2 happened — the shelf is Surface.sunken #EFECE5. Tan is
for Refer & Reap and other tan promo cards. Descriptions are load-bearing here,
since you correctly made them the mechanism that stops C4 recurring.

────────────────────────────────────────────────────────────────────────────
THREE THINGS TO VERIFY BEFORE I RUN IT

You already shipped one resize-ordering bug — textAutoResize after resize. Please
re-check these three, since I would rather find them now than half-applied.

a) RESIZE VS SIZING MODE, ON FRAMES. The board does it one way and the cells do it
   the other. Board: counterAxisSizingMode = "FIXED" and then resize(). Cells,
   edition cells, scale columns and shadow cells: resize(196, 10) and then
   counterAxisSizingMode = "FIXED". If resize() on a hugging auto-layout frame
   forces BOTH axes to FIXED, every one of those cells is pinned to 10px tall and
   clips its own content. Pick the board's order and use it everywhere.

b) THE GRADIENT TRANSFORM. gradientTransform is [[cos, sin, 0], [-sin, cos, 1]].
   The translation terms are 0 and 1 rather than the centring terms, so a rotated
   gradient may land off-centre and clip its end stops. Check the Gold edition chip
   specifically — with five stops, an off-centre transform shows up there first and
   nowhere else.

c) THE FILL SCOPE ARRAY. ["FRAME_FILL", "SHAPE_FILL", "ALL_FILLS"] mixes a superset
   with its own members. Confirm Figma accepts it rather than rejecting the whole
   scopes assignment — if it rejects, every colour variable silently ends up
   unscoped and the picker stops filtering, which quietly removes the guardrail the
   collection exists to provide.

Also: EFCT, UI_FONT and UI_BOLD are declared and never used. Harmless, but strip
them so the next script does not inherit them.

────────────────────────────────────────────────────────────────────────────
GO

Patch 01 to 56 tokens, fix the tan description, confirm or fix a/b/c, and re-issue.
Then Batch 2 — the master card fixed to the reference stack, the component with its
14 variants, and Badge / Tier. Use the attached siren.

Everything from the last message still stands: plugin scripts for structure, SVG
for artwork with real <text> elements never outlined paths, variant roots named
"Edition=House, Face=Front", 1:1 placeholder frames for every product image, and
no screens beyond SCREEN_MAP.md.
```

---

## Notes for you, not for Claude Design

**The siren is a trademark.** `assets/figma_files/siren.svg` comes from the
simple-icons glyph already vendored in
[SirenLogo.tsx](src/components/onboarding/SirenLogo.tsx). Fine for a private
recreation exercise, which is what this is — but it is Starbucks' registered mark,
so it can't ride along into anything you publish or ship.

**The token gap was mine.** My Prompt 1 listed only the `base` value of each drink
accent, so the script faithfully built what it was told. Worth knowing because it
is the second time a brief omission has propagated into the file — the first was
`bodyStrong`, which Claude Design caught in J1.

**Item (a) is the one most likely to actually bite.** They fixed exactly this bug
for text nodes and then left the inverse ordering on five frame sites. If it does
force both axes, the boards render as a stack of 10px slivers — obvious the moment
you look, and harmless to your screens either way, since 01 only touches
Foundations.
