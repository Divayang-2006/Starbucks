# The prompt — paste into Claude Web

**Attach `LINKEDIN_SERIES_CONTEXT.md` to the same message.** Without it, the
output will be generic and you'll get exactly the LinkedIn slop this brief exists
to avoid.

Two turns. Turn 1 gets the plan. Turn 2 gets the posts. Splitting them lets you
correct the strategy before eleven posts are written on top of it.

---

## Turn 1 — the series plan

```text
You are a senior content strategist who writes for engineers and designers — the
kind of writer whose posts get shared by people who hate LinkedIn. I need a
LinkedIn post series planned, then written.

I've attached the full project context. Read it completely before you respond.
It is the only source of truth: every claim in every post must trace back to a
line in it. Do not add facts, do not embellish, do not invent numbers. Section 9
is a hard constraint list — treat it as non-negotiable.

THE SERIES

Eleven posts. Each one takes a single UI mechanism I built and shows what is
better about it. Several of them are anchored to a real, public complaint about
the actual Starbucks India app (context §3) — the review states the problem, my
build is the answer.

THE THING MOST WRITERS GET WRONG HERE, SO READ IT TWICE

Do not explain the UI. Nobody wants a walkthrough of my interface.

The screenshot explains what it looks like. The post's only job is to make the
reader feel the difference — what was annoying before, what isn't now, and the
decision that got me there. If a sentence describes what an element does, cut it.
If it says why it beats the obvious alternative, keep it.

Test for every post: could I have written this about any app? If yes, it's dead.

FORMAT — enforce all of these

- 90–160 words. Some as low as 60. Never over 180. Short and sweet is the ask.
- Line 1 is a hook of 4–9 words that works with the preview truncated, and is
  not a question, not a statistic dressed as a hook, and not "Here's how I…".
- One idea per post. If a post has two, it's two posts.
- Whitespace-heavy. 1–2 sentence paragraphs. But do NOT make every line its own
  paragraph — that reads as a person doing a LinkedIn impression.
- A real number wherever the context provides one. "3.6:1 → 5.2:1" beats
  "improved contrast" every time.
- Zero emoji in the body. At most one in the hook, and only if it genuinely
  earns its place — default to none.
- No hashtag spam. Exactly 3, at the end, lowercase-natural, not #Design
  #UX #UI #Innovation.
- End with either a real question I'd actually want answered, or nothing. A weak
  CTA is worse than no CTA.

CREATIVE STRATEGIES I WANT YOU TO USE — vary them, don't repeat one

Pick the sharpest fit per post. Do not use the same structure twice in a row:

1. Review-as-cold-open. The complaint is line 1 (quoted verbatim from what I
   give you). Everything after it is the answer.
2. The reversal. I built it, argued for it, then deleted it. Context §8 has six
   of these and they are the most credible material I have.
3. The rejected alternative. Name what I almost did, and why it would have been
   worse. Specificity is the whole trick.
4. The refusal. What I deliberately left empty or didn't build, and why that was
   the harder call. (§6.10 is the best one.)
5. The constraint that became the design. The FSSAI diet mark forcing a quiet
   corner in every product photo. The per-store menu forcing the map to be the
   first screen.
6. The hidden number. A ratio, a scale factor, a derivation — the thing nobody
   sees that everything depends on.
7. Contrarian-but-true. "I deleted my own tab bar and the app got better."

Use each of these at least once across the eleven. Never open two consecutive
posts with the same rhetorical move.

WHAT TO DELIVER IN THIS TURN — plan only, no posts yet

A table with one row per post:

  # | Hook (draft) | The mechanism (context §) | Strategy used | Review anchored (R#, or —) | Visual I need to capture

Then, below the table:
- Posting order, with a one-line reason for the sequence. Post 1 has to earn the
  next ten, so tell me which one you'd lead with and why.
- The 3 posts you think will travel furthest, and honestly, the 2 weakest — I'd
  rather cut two than post eleven of uneven quality.
- Anything in the context you think I'm underselling.
- A cadence recommendation.

Do not write any post copy yet. Show me the plan.
```

---

## Turn 2 — write them

Send after you've adjusted the table.

```text
Plan approved [note any changes here].

Write all of them in full, in order, each in its own code block so I can copy
them cleanly.

For every post also give me, underneath it:
- ALT TEXT for the image, written properly for screen readers.
- THE VISUAL: exactly what to capture — which screen, which state, still or
  screen-recording, and if it's a recording, how many seconds and what has to
  happen in it.
- FIRST COMMENT: the link/context I should drop in the comments rather than the
  body, if there is one.

Three rules that override everything else:

1. Every post ends with the disclaimer line, in my own plain voice — not a legal
   notice, and never the same wording twice. Unofficial concept study, no
   affiliation with Starbucks. Make it read like a person saying it, and vary it
   across the series.

2. Where a post is anchored to a review, LEAVE A PLACEHOLDER:
   [REVIEW QUOTE — I will paste the exact text]. Do not write a review. Do not
   guess at wording. Do not paraphrase one into quotation marks. Fabricating a
   review would destroy the premise of the entire series, and I will notice.

3. Re-read context §9 before you submit. If any sentence claims speed, metrics,
   affiliation, or a screen that isn't built, delete it and tell me what you
   deleted.

Then, separately: give me the 3 alternate hooks you rejected for post 1, so I can
see the range you were choosing from.
```

---

## Notes for you, not for Claude

**Why the review placeholder matters.** Anchoring on real reviews is the strongest
idea in this series and the easiest to ruin. A model asked for "a negative
Starbucks review" will happily produce a plausible one, and a plausible fake is
worse than no review — someone will search for it. Screenshot the store listing,
paste the text yourself, crop out the reviewer's name.

**Sourcing your review screenshots.** Google Play → Starbucks India
(`com.starbucks.in`) → Ratings and reviews → sort by Most recent, filter 1★.
App Store India → Starbucks India (`id1210203958`) → Ratings & Reviews → Most
Critical. Themes already verified in context §3; you just need the exact wording
and the screenshot.

**The trademark question is unresolved and it's the one thing that could actually
bite you.** The siren is on the card face, the MapPlate, and every product image.
A concept study posted with a clear "unofficial, not affiliated" label is
ordinary portfolio practice and is very unlikely to attract attention — but the
mark being visible in public captures is a real exposure, not a theoretical one.
Decide before post 1, not after post 6. The cheapest version: keep the disclaimer
prominent, and consider swapping the mark for your own placeholder glyph in the
shots you publish.

**Lead with a reversal, not a showcase.** The instinct is to open with the
prettiest thing — the holographic card or the FluidMenu. Resist it. "I built a
custom tab bar, then deleted it" earns you an audience that will still be there
for the pretty one at post 6. Opening with the showcase gets a like and no
follow.

**Cadence.** Two a week beats eleven in a fortnight. The series is the asset —
each post should be able to reference the last one.

**If the output comes back generic**, the fix is almost always the same: the post
described the UI instead of arguing for it. Send it back with "this explains what
the screen does — tell me what decision it represents and what I rejected."
