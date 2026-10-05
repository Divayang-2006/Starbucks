# Reply to Batches 2 and 3 — stop, revert, rebuild from the file

Roll back in Figma first: **File → Show version history**, restore the version
saved before `02-card`. Keep Batch 1 — the Foundations boards are good and the
token work is sound. Only 02 and 03 come out.

---

```text
Stop. Batches 2 and 3 have to be reverted and redone, and the reason is a process
one rather than a list of bugs.

WHAT WENT WRONG

You re-authored the design from my written description. The job was to repair the
design that is already in the file.

Those are different tasks and they produce different artefacts. My brief was a
description of intent — "gloss sweep above the siren", "hung off the bottom-right",
"six layers in this order". A description is lossy. The file contains the actual
thing: real gradient stops, real opacities, real angles, a real shaped sweep with
its own falloff. You rebuilt from the lossy copy and the result is a different card
that satisfies my sentences without looking like the design.

Your own audit already identified the correct source. Section C2: the Gold card on
Item · Curtain expanded carries all six layers in the right order, with the corner
vignette as a radial gradient at 55% and the gloss as a shaped 0.55 → 0.04 sweep.
You wrote, verbatim, "Treat it as the reference; everything else is measured
against it." That was right and it is still right. It was not used.

THE RULE FOR EVERY REMAINING BATCH

  The FILE is the source of truth for how things LOOK.
  The AUDIT is the source of truth for what is WRONG.
  Change only what the audit measured as a defect. Everything else is copied
  forward from the reference node, byte for byte.

Concretely: build the card component by CLONING the reference card's layers and
then correcting the measured defects on the clone — geometry to 236×148, radius to
14, the siren scale to one ratio, the type snapped to the scale. Do not create new
gradients, new sweeps, new vignettes or new bevels from my description. If a layer
on the reference is correct, it moves across untouched.

Same for the Curtain: clone the existing expanded and collapsed frames, fix what
was measured, keep everything else.

If you cannot clone a layer for a technical reason, say so and stop. Do not
substitute an approximation and carry on — that is precisely what produced this.

WHAT I CAN SEE IS WRONG, FROM THE RENDER

The card
· The gloss is a hard-edged opaque diagonal band across the whole face. The
  reference is a shaped sweep falling 0.55 to 0.04. What is there now reads as a
  white stripe painted on the card, not light moving across it. This single layer
  is most of why the card no longer looks like the design.
· The siren sits on the right edge, roughly centred vertically, essentially whole.
  It must hang off the BOTTOM-RIGHT corner so the card edge crops it. The crop is
  the entire point — an uncropped mark reads as a sticker, which is the exact note
  that started this work.
· I cannot see a corner vignette or the bevel arcs. The reference has both.

The Curtain, expanded
· The fanned cards overflow the 390 frame and are clipped mid-word: "MEMBER SINCE
  202", "₹1,24", "AARA". Text cut through the middle of a word is not a judgement
  call.
· In one variant both cards render as desaturated grey. Grey is not in the palette
  and matches no edition in the set of seven.
· The fan sits so low in the band that the cards are mostly cut away, which throws
  away the thing the Curtain exists to show.

The Curtain, collapsed
· It shows a centred Bebas title on an empty green band — no card sliver, no
  avatar. That is the title-awning treatment, which is the pattern we agreed was
  the wrong half of your "two apps" finding. The collapsed Curtain retracts to
  leave the CARD EDGE and the identity visible; it does not become a title bar.
· The avatar is present when expanded and gone when collapsed. It is the only route
  into the account menu, so it cannot disappear on scroll.
· The store name is Instrument Serif when expanded and Bebas caps when collapsed.
  One component, one type treatment, in both states.

HOW TO DELIVER FROM NOW ON

Before you swap anything into the file, show me a side-by-side: the reference node
exported as PNG next to your rebuilt version at the same size. One pair per object.
I approve the pair, then you swap.

This costs you one extra step and it makes a repeat of this impossible, because a
visual regression is obvious in a side-by-side and invisible in a redline of
measured values. Your redlines have been accurate throughout — every number you
reported was a number you actually measured. The numbers were not the problem.

WHAT I AM NOT ASKING FOR

I am not asking you to redo the analysis. The audit is good, and Batch 1 is good —
the Foundations boards render correctly, the tokens are right, and the 54-token
count was your correction of my arithmetic, not mine of yours. None of that is in
question.

I am asking for the componentisation to preserve the appearance it is
componentising. Same structure you specified in section 09 — 14 card variants,
6 Curtain variants, boolean and instance-swap props rather than variant explosion.
Rebuilt from the file's own layers instead of from my prose.

Revert 02 and 03, then re-issue 02 with the side-by-side pair for the card before
touching anything else.
```

---

## Notes for you, not for Claude Design

**Batch 1 is genuinely fine** — keep it. The colour board has all 54 tokens in
correct groups, the drink accents made it in with base/deep/tint, and the type
board's specimens are set in real styles. Reverting past it would cost you good work.

**The root cause is worth naming for later.** Once the card became a *description*
in a prompt rather than a *node* in the file, every rebuild was a game of telephone.
The audit spotted the single complete card and named it the reference — the fix is
just to actually use it as one.

**The side-by-side requirement is the durable part of this message.** Every redline
so far has been numerically accurate and visually wrong at the same time, which is
possible because a measured value can be correct while the thing it measures looks
nothing like the original. A PNG pair catches that in one glance.
