# Claude Design — Prompt 2: execute the audit, as importable output

**Attach again, all three.** The audit said plainly that `SCREEN_MAP.md` was not in
the file or the project, so its inventory had nothing to check itself against.
Whatever happened last time, attach these before sending:

- `docs/SCREEN_MAP.md`
- `docs/APP_METADATA.md`
- `docs/DESIGN_SYSTEM.md`

---

## The prompt

```text
The audit is accepted. Below are answers to all seven judgement calls, the header
conflict, and the approval scope you asked for — then the one thing that changes
how you deliver.

YOU CANNOT WRITE TO THE FILE, SO DON'T TRY

You told me your access to Starbucks.fig is read-only. Understood, and that's fine.
Everything below is to be delivered as artefacts I import myself. Do not describe
changes in prose and leave me to execute them by hand — the entire point of this
phase is that 31 hand-drawn cards became four geometries, and prose instructions
would produce a fifth.

DELIVERY FORMAT — read this carefully, it is the whole ask

Two kinds of artefact, and the split matters because each format can carry things
the other cannot.

1. FIGMA PLUGIN SCRIPTS — for structure.
   Plain JavaScript against the Figma Plugin API, which I run from a plugin console
   against the open file. Scripts are the only way to create variables, styles,
   auto-layout and real component sets with variant properties. SVG cannot carry
   any of those.

   Rules for every script you write:
   · Numbered and independently runnable: 01-tokens.js, 02-card.js, 03-curtain.js …
     I must be able to run 02 without having run 03.
   · Idempotent. Re-running must not create duplicates — look up by name, and
     delete-then-recreate rather than appending.
   · Async-correct: await figma.loadFontAsync() for every font/style pair before
     setting any characters, and await every variable and style call.
   · Log a summary at the end — what was created, updated, skipped.
   · Fail loudly with a clear message rather than half-applying.
   · Comment each block with which audit finding it closes (C1, H2, M5 …).

2. SVG FILES — for artwork.
   One file per drawing, for the irreducible vector work: the siren, the scalloped
   awning edge, the squiggle divider, the bevel arcs, the corner vignette, the gloss
   sweep, the diet marks, the icon set.

   Rules for every SVG:
   · Real <text> elements with font-family, never outlined paths. If you convert
     text to paths, every label in the file becomes an uneditable vector and the
     deliverable is worthless to me.
   · Fonts by their exact Google Fonts names: Urbanist, Instrument Serif, Bebas Neue.
   · Exact geometry at 1×. No transforms baked into a wrapper.
   · Layers named meaningfully — the SVG group names become Figma layer names, and I
     need to be able to find "gloss sweep" to check it sits above "siren".
   · Where an SVG is a component variant, name its root exactly in Figma's variant
     syntax — "Edition=House, Face=Front" — so that after import I can select them,
     Create multiple components, Combine as variants, and have the properties
     populate themselves rather than typing 14 names.

   Prefer embedding path data directly in the scripts where it is short. Only ship a
   separate SVG when the path is too long to inline comfortably.

Give me the file contents in full, in code blocks I can copy. Do not summarise a
script or elide the middle of one.

THE SEVEN JUDGEMENT CALLS — answered

J1 — brief vs Foundations board. The board wins for the three serif sizes and the
brief wins for everything else. Reasoning: those serif numbers were re-tuned
deliberately when we swapped Fraunces for Instrument Serif, which has a different
optical size, so 34/40 and 26/32 are a correction and not drift. quoteSerif 18/27
goes back in — the board dropped it by omission, not decision. bodyStrong 16/22 is
real and my brief simply failed to list it; add it. Rebuild the Foundations · Type
board from the merged result so the two stop disagreeing.

J2 — card radius. Accept your recommendation: add 14 to the radius scale as the
card radius. 16 is visibly soft on a 148-tall card. The scale becomes
4 · 8 · 12 · 14 · 16 · 20 · sheet 28 · pill 999.

J3 — which gold. The 5-stop metallic wins; the flat 2-stop is deleted. The entire
reason we did the card work was to stop it reading as a graphic, and the 5-stop is
the one that reads as metal. Your "but it's eight frames of change" objection stops
applying the moment the card is a component — that is precisely what
componentisation buys, so spend it.

J4 — edition vs tier. Your instinct that they're independent is right, but three
axes multiply into an unusable set, so resolve it differently: TIER IS NOT AN AXIS
ON THE CARD AT ALL.

  Edition is the face. It is chosen by the member in the face picker, and it is a
  single axis of seven values: House, Forest, Jade, Sage, Reserve, Gold, Guest.
  Gold is the 5-stop metallic from J3 — it enters as an edition, not a tier.
  Guest is an edition too, which is what guarantees no card-shaped slot is ever
  empty.

  Tier is a small badge. Build it as its own component — Badge / Tier with values
  Green, Gold, Reserve — and nest an instance of it in a named slot on the card.
  A Gold-tier member who picks the Jade face gets the Jade face and a Gold badge,
  which is how loyalty cards actually behave.

  In-product, reaching Gold or Reserve unlocks the Gold and Reserve editions. That
  is a rule about availability, not about the component.

J5 — tab bar coverage. The tab bar appears on every tab root, full stop. Cart ·
Empty and Map · Store picker are missing it and that is a defect, not a decision.
On Cart · Filled the sticky Pay bar REPLACES the tab bar rather than stacking above
it — two floating bars at once is heavy and LAP doesn't do it either. So the sticky
bar is a separate component, not a variant of the tab bar: they have different
lifecycles, one is global navigation and the other is contextual, and making one a
variant of the other couples them permanently.

J6 — the clipped card on Wallet · Add money. Accept: convert to a real clipped
instance so the card stays editable.

J7 — the decision boards. Accept: archive Card tiers ×2 and Foundations · Display
face candidates to a new 00-Reference page. Don't delete them. They are the only
record of why Instrument Serif won, and I will want that in six months.

THE CART HEADER CONFLICT — answered, and it settles the split

Cart · Filled is right. Cart · Empty is wrong.

The rule, which resolves your entire section 02: the Curtain belongs to TAB ROOTS.
It is the shared header that animates rather than remounts, and it shows the card
at rest. Every tab root gets it. Everything that is pushed, presented or pre-auth —
Settings, the Wallet sub-screens, Login, Sign up — gets the title-only treatment.

So the "two apps" you found are not two apps. They are one app whose two header
treatments were drawn as separate objects instead of as two values of one
component. Your Curtain / Header with Content = Member / Guest / Title is exactly
the right fix, and it is the single most important thing in this phase. Building it
collapses nine private headers into one, gets Map its header, and makes the Cart
conflict impossible to reintroduce.

APPROVAL SCOPE

Take all of section 03 Critical, all of 04 High, and all of 05 Medium. Your
reasoning is right that these are the same handful of wrong values repeated, so
they are one sweep rather than nine tasks. Specifically including:

· C4's third finding — the Text.tertiary-at-body-sizes pattern. Do it as one sweep
  across all frames, not 30 edits. Anything below 18pt currently on #79817E goes to
  Text.secondary #5C6A65.
· H7 and H8 — every type size below 14px is off-scale, and both declared Bebas
  sizes are unused. Since the cause was the 1.271× card scaling, most of this is
  fixed by rebuilding the card at 236×148. For what remains, snap to the scale.
  Give Bebas a real scale rather than the seven ad-hoc sizes: propose one and show
  me what each existing size maps to.
· M10 — rebuild Foundations · Colour with all ~40 tokens, including the five
  drink-family accents. You are right that this is the cause and not a symptom.
· M6 — build Diet.nonVeg #B0332B as well. Half a pair is not a component.
· M7 — move the 26 loose rasters to a new 04-Assets page.
· M8 — rename to "Area · Screen · State" throughout. FluidMenu's animation
  parameters move out of the frame names into the frame descriptions. Login step 1
  becomes "Login · 1 of 2 · Phone".
· M9 — of each duplicate pair, the one with 236×148 geometry survives.

COMPONENTS — build all of your section 09, with one structural rule

Your component list is right and I'm approving it as specified, with this rule
applied throughout, because it is what stops the set becoming unusable:

  USE VARIANTS ONLY FOR AXES THAT CHANGE LAYOUT. Everything that is merely
  show-or-hide becomes a boolean property, and everything that is swap-one-thing-
  for-another becomes an instance-swap property. Variants multiply; properties
  don't.

Applied to your table:

Card / Membership — 14 variants: Edition (House, Forest, Jade, Sage, Reserve, Gold,
Guest) × Face (Front, Back). Boolean props: Siren, Balance. Instance-swap slot:
Tier badge. Text props: Name, Balance, Last four, Member since. Base 236×148, r14.
The six-layer stack in the reference order every time — gradient, siren cropped at
the bottom-right, corner vignette, gloss sweep ABOVE the siren, bevel arcs, raised
type. Backs derive two stops darker than their front. Siren=off is the expanded-
Curtain placement where the scallop clips it anyway.

Curtain / Header — 6 variants: State (Expanded, Collapsed) × Content (Member,
Guest, Title). Nested Card instance, avatar slot, title slot.

Tab bar — 4 variants: Active (Item, Cart, Wallet, Map). Sticky bar is separate,
per J5.

Product tile — 3 variants on Width (168, 236, 268) only. Diet and Badge are boolean
props, the diet mark is an instance swap. Owns the 1:1 placeholder frame as a named
child and owns the contact-shadow ellipse.

List row — 2 variants on Height (84, 112) only. Leading and Trailing are
instance-swap slots, which is what makes the Cart row and the Settings row one
object instead of two.

Chip — 2 variants: Default, Selected. Selected is Action.selected #1E3932, closing
C3 permanently.

Squiggle, Diet mark, Stepper — single components. One 340×2.2 squiggle at the
canonical amplitude. Diet marks at a legal 16pt. Stepper at a 44 target.

Also build, because they recur and aren't in your list: Button (primary, secondary,
disabled, at 52), Field, Avatar, Section header, Price tag, and the Badge / Tier
component J4 introduces.

Apply auto-layout to every component that has a content axis — rows, chips,
buttons, the tab bar, section headers. A component without auto-layout drifts the
moment its text changes length, which is how we got here.

ONE MISSING SCREEN TO BUILD

Sign up · 2 of 3 · Date of birth. You're right that this matters more than a
missing frame usually would — without it the flip has nothing to flip from, so the
file doesn't contain the choreography the whole idea rests on. This is a hole in an
existing flow, not a new screen, so it is in scope now. Front face, card-as-form,
"DATE OF BIRTH" micro-caps label, DD/MM/YYYY, heading "WHEN IS YOUR BIRTHDAY?" and
sub "So we can send you something on the day".

The PDP hero is a real gap too, but it's on SCREEN_MAP so it belongs to the next
phase, not this one. Don't draw it yet.

ORDER OF DELIVERY

Follow your own sequence — it's correct, and four of my six confirmed items close
as a side effect of it. Stop after each batch and show me before continuing.

  Batch 1  01-tokens.js — variable collections for all ~40 colours, the spacing and
           radius and size scales, text styles for the full type scale including
           the merged serif sizes and the new Bebas scale, and effect styles for
           the three green shadows. Plus the rebuilt Foundations · Colour and
           Foundations · Type boards. This closes M10 at the root, so it goes first.
  Batch 2  02-card.js plus siren / vignette / gloss / bevel SVGs — the master card
           fixed to the reference stack, then the component with its 14 variants,
           then Badge / Tier.
  Batch 3  03-curtain.js — the Curtain with all six variants, and the awning SVG.
  Batch 4  04-components.js — everything else in the list above.
  Batch 5  05-screens.js plus screen SVGs — swap all 31 card copies and all 14
           headers to instances, apply the section 04 and 05 sweeps, rebuild Map ·
           Store picker, build Sign up · 2 of 3, and do the page reorganisation
           (00-Reference, 04-Assets) and the renaming.

With each batch, give me a short redline: which findings it closes, and anything
you hit that the audit didn't predict.

STANDING RULES, UNCHANGED

· Figma only. Never modify or offer to modify the codebase.
· Never draw or generate a product image. Every product image is an empty 1:1
  placeholder frame, clearly named, sized to the layout. I supply the images.
· No screens beyond SCREEN_MAP.md and the one named above. If you think something
  is missing, tell me — don't draw it.
· Real content only: Tiramisu Frappuccino ₹588, Iced Coconut Matcha ₹472.50,
  Malabar Coconut Flat White ₹456.75; Koregaon Park and North Main Road, Pune.

Start with Batch 1.
```

---

## Notes for you, not for Claude Design

**Why scripts and not just SVG.** SVG can't carry variables, styles, auto-layout or
variant properties — the four things this phase is actually about. Drag-dropped
SVGs would give you 31 correct-looking cards that still can't be edited once, which
is the exact problem the audit diagnosed. The plugin script is the only route to
real components. SVG stays in the mix for the artwork, where it's genuinely better.

**The variant-naming trick is load-bearing.** Naming an SVG root `Edition=House,
Face=Front` means Figma's "Combine as variants" reads the properties off the names
instead of you typing fourteen of them. Worth checking the first batch honours it.

**The J4 answer is the one to push back on if any.** The audit assumed edition and
tier were independent axes, which would have given you 5 × 3 × 2 = 30 variants
before booleans. Folding tier into a nested badge and making Gold an *edition* gets
you to 14 and matches how loyalty cards behave — a Gold member who picks the Jade
face should get the Jade face. But it does mean "Gold card" now means a face you
choose rather than a tier you reach, and if you'd rather Gold be earned-only, say
so and the availability rule changes, not the component.

**The header answer settles the "two apps" finding.** Your own design philosophy
already contained it: the Curtain is for tab screens. Everything the audit filed as
"the title-awning family" is just non-tab screens, which is correct behaviour drawn
as a separate object instead of a variant. Nine private headers collapse into one
component, and Map gets its header as a side effect.

**If a script fails when you run it**, paste the error back — they're numbered and
independently runnable specifically so one failure doesn't cost you the batch.
