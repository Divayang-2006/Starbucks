# Claude Design — Figma brief

Hand this to Claude Design together with the Figma file. Attach **three** docs, not
one:

| Attach | Why |
|---|---|
| `docs/SCREEN_MAP.md` | The build list. |
| `docs/APP_METADATA.md` | SCREEN_MAP cites its §2–§6 on nearly every row. Without it every data reference in the map dangles. |
| `docs/DESIGN_SYSTEM.md` | Backs up the token table below. |

Send **Phase 1** first and review what comes back before sending **Phase 2** — the
audit will surface things worth correcting before twenty new screens are built on
top of them.

---

## Phase 1 — Audit, polish, componentise

```text
You have our Figma file for a Starbucks India app recreation. This is a design-only
task: never write, read or modify code, and never propose code changes. Figma only.

WHAT THE APP IS

A faithful recreation of the Starbucks India app, iOS-first, all frames 390×844.
Its structure is borrowed from LAP, a German coffee-shop app by App&Flow — the
scalloped header, the product "shelf", the floating pill tab bar. Its identity is
entirely Starbucks: greens and cream, never LAP's navy. We took LAP's bones and
Starbucks' skin, deliberately, and that tension is the whole design.

THE TOKENS. Every colour, size and radius below is a real token. Never invent a
value, never eyeball one, never use a hex that isn't on this list.

Surfaces      app #F7F5F0 (warm cream — NEVER a grey-white) · raised #FFFFFF ·
              sunken #EFECE5 · inverse #1E3932 "House Green" · inverseDeep #0B1F1A ·
              tint #D4E9E2 · onDarkFill rgba(255,255,255,0.14)
Text          primary #14231E (green-black, not #000 — black buzzes on cream) ·
              secondary #5C6A65 · tertiary #79817E (≥18pt only, never body) ·
              onDark #FFFFFF · onDarkMuted rgba(255,255,255,0.72) · action #006241
Borders       hair #E3DFD6 · hairOnDark rgba(255,255,255,0.16) · strong #CFC9BC
Action        primary #006241 · pressed #004E34 · disabled #B9C6BF ·
              selected #1E3932 (selected chips use House Green, NOT the CTA green)
Accent        gold #CBA258 · goldSoft #F0E2C0 · tan #E5D3B3 · caramel #9D5116
Status        success #007A4D · error #C0362C · errorOnDark #FF9B8F (error on green
              is 2.3:1 and fails — dark surfaces get their own value) · warning #B26B00
Diet          veg #0A8A3C · nonVeg #B0332B — FSSAI-mandated. Do not restyle these.
Tier          green #006241 · gold #CBA258 · reserve #0B1F1A · reserveMetal #B0703C

Drink-family accents tint ONLY the PDP hero scrim, that screen's section rules, its
selected chips, and the favourite heart. Tab bar, sticky Add-to-Cart bar and every
CTA stay brand green. espresso #9D5116 · coldBrew #5B3A29 · frappuccino #7E5B86 ·
matcha #3E7C59 · refresher #B23A5C. Merch, food and at-home coffee get no accent on
purpose — the idea only reads as intentional while it stays confined to drinks.

Shadows are green-tinted, never neutral black: #1E3932 at 10%, y+4, blur 12 for
cards; 14%, y-6, blur 24 for sheets; 18%, y+8, blur 20 for floating. A grey shadow
on a cream surface is the single clearest tell of a cheap clone.

Spacing  4pt scale: 2 4 8 12 16 20 24 32 48. Screen gutter 16.
Radius   4 8 12 16 20 · sheet 28 · pill 999
Sizes    tap target 44 (nothing interactive below it) · button 52 · chip 36 ·
         field 48 · product thumb 96 · inline control 30 · mark disc 56 ·
         category disc 72 · track 8 · dot 8
Rails    card widths 168 (product tiles) / 236 (standard) / 268 (feature). Absolute,
         not percentage — the peek of the next card is what says "this scrolls".
Icons    16 18 20 22, stroke 1.6 default / 1.8 on fills / 2.2 for 16pt on green.

TYPE. Three faces, three jobs.

Urbanist carries the entire UI; weight makes hierarchy, not family.
Instrument Serif is the display serif and it is RATIONED — rewards hero, store
names, article titles, seasonal headers. Never in a list row, chip, button or form.
If it appears twice on one screen, one of them is wrong.
Bebas Neue is condensed caps only: the card face (where it stands in for
embossing), item names, and screen titles.

display 34/40 extrabold · h1 28/34 bold · h2 22/28 bold · h3 18/24 semibold
displaySerif 32/38 · titleSerif 24/30 · quoteSerif 18/27
body 16/22 · bodySm 14/20 · label 13/16 medium
caps 11/14 semibold, +0.9 tracking, uppercased at the call site
micro 11/14 · price 16/20 semibold · priceLg 20/24 bold

Never pair a weight with a family that already is that weight — each face is a
single static instance, so asking for a weight it doesn't contain gets a
synthesised, smeared one.

(You may see Fraunces named in older material. We swapped it for Instrument Serif;
Figma and the docs are correct and the code is deliberately not yet updated. Do not
try to reconcile them.)

THE FIVE SIGNATURE MOTIFS. These are what make the app itself rather than a
generic coffee app. Preserve them exactly; when a new screen needs a decision, ask
which of these it belongs to.

1. THE CURTAIN. A shared header across the tab screens that ANIMATES rather than
   remounts. At rest it shows the membership card. On scroll it retracts upward,
   leaving only the card's top edge and the member's name visible. The avatar in it
   opens the account menu. Two states are already drawn — "Curtain expanded" and
   "Curtain collapsed". Every tab screen shares this one header; it is the single
   strongest identity cue in the app, so no tab screen may invent its own.
2. THE SCALLOPED AWNING. The dark green header band's bottom edge is a sine wave,
   like a shop awning. LAP's motif, our green.
3. THE SHELF. Products sit as cutouts on a beige counter band, each with a soft
   contact-shadow ellipse at its foot so it reads as standing on the shelf rather
   than floating. The section label sits BELOW the shelf, not above it. This
   inversion is intentional — don't "fix" it.
4. THE FLUID TAB BAR AND MENU. A floating pill tab bar. The avatar opens a full
   account menu of nine rows grouped 6 · 2 · 1 — separated by whitespace, never by
   rules. Log Out is always last and always in Status.error.
5. THE SQUIGGLE. A hand-drawn wavy line as section divider.

THE MEMBERSHIP CARD — read this twice, it is the most important object in the app.

The card is the app's icon. It is the hero of the auth screens, it lives in the
Curtain on every tab screen, and it is also a real payment card: balance, last four
digits, a tier, and per-card last-ordered / recommended items. A member can hold
several. A signed-out user gets a default Guest card that fills every card-shaped
slot, so no slot is ever empty.

It must feel like a physical object, not a graphic. That comes from a material
stack in this EXACT layer order, bottom to top:

  1. Tier gradient fill
  2. The Starbucks siren, scaled 4.92× and hung off the BOTTOM-RIGHT corner so the
     card edge crops it. The crop is the point — a siren floating fully inside the
     card reads as a sticker.
  3. Corner vignette
  4. Gloss sweep — ABOVE the siren. This is non-negotiable and it is the easiest
     thing to lose when reorganising layers. Light passing over the mark is what
     makes it read as printed into the plastic.
  5. Bevel arcs
  6. Raised type, Bebas Neue

Geometry 236×148. Tiers: Green #006241→#002E1F, Gold #CBA258, Reserve
#0B1F1A with #B0703C metal. The five green editions, front gradients: House
#00754A→#002E1F · Forest #28463C→#0C1A15 · Jade #118F66→#04402C · Sage
#5F7E6E→#233830 · Reserve #233B32→#0A100D. Backs are always two stops darker than
their front. White must stay legible on every face and ink must stay legible on the
cream signature panel — so no pale or high-chroma edition, ever.

CARD-AS-FORM. Our login and sign-up screens do NOT use form fields. The card IS the
form: the question sits above the card, and the answer is printed onto the card
face under a micro-caps label, as though embossed. The field order is the
choreography — name (front), date of birth (front), then mobile number, which is on
the BACK, so the card flips between step 2 and step 3. Never draw a boxed text
input on these screens.

WHAT I WANT FROM YOU IN THIS PHASE

Do not build new screens yet.

A. Audit every frame in the file and give me a written report before you change
   anything. Check for: cards that are flat graphics instead of the material stack
   above; screens missing the Curtain header; off-token colours, spacings and
   radii; type that breaks the serif ration or the weight rule; inconsistent frame
   naming; contrast failures; tap targets under 44; and drifted geometry between
   screens that should match. Group findings by severity and tell me which are
   judgement calls rather than defects.

B. These six are known and confirmed — fix them, plus whatever else your audit
   turns up that I approve:

   1. "Login · 2 of 2 · Your card + code" — flat card, needs the material stack.
   2. "Sign up · 1 of 3 · Name" — flat card.
   3. "Sign up · 3 of 3 · Mobile" — flat card. This is the flipped back face.
   4. "Item · Curtain collapsed" — flat card. Only a sliver of the card shows here,
      but that sliver includes the siren's top portion, so it does need the siren.
   5. "Cart · Filled" — still has drawn vector cups. Replace them with 1:1
      placeholder frames per the image rule below.
   6. "Map · Store picker" — missing the Curtain header entirely. Its search and
      filter pills currently sit where the header belongs, so this one needs
      rebuilding rather than patching. Getting the header onto the map matters:
      the header is the app's identity.

C. Componentise. Right now the card is copy-pasted into every frame it appears in,
   which is why six of them drifted. Turn it into a proper component with variants
   for tier (Green / Gold / Reserve) and edition, a boolean for showing the siren,
   and swappable name / balance / last-four text. One placement — the expanded
   Curtain — clips the siren below the scallop and never renders it, which is what
   the boolean is for. Then do the same for the Curtain header, the tab bar, the
   product tile, the list row, and any other object that appears on three or more
   screens. Replace every existing copy with an instance.

HARD RULES, ALL PHASES

· Figma only. Never modify, or offer to modify, the codebase.
· PRODUCT IMAGES: never draw or generate one. Wherever a product image belongs,
  place an empty 1:1 square placeholder frame, clearly named, sized to the layout.
  I am producing all product imagery myself and will drop it in. This applies to
  every screen, every rail, every thumbnail, every hero.
· No extra screens. Build only what SCREEN_MAP.md lists. If you believe something
  is missing, tell me — do not draw it.
· Real content only. Our catalogue and our stores, never lorem ipsum: Tiramisu
  Frappuccino ₹588, Iced Coconut Matcha ₹472.50, Malabar Coconut Flat White
  ₹456.75; stores at Koregaon Park and North Main Road, Pune.
· Name frames "Area · Screen · State", matching the file's existing convention.

Start with the audit report. Wait for my approval before fixing anything.
```

---

## Phase 2 — The remaining screens

Send after Phase 1 lands and the component library exists.

```text
Now build the remaining screens from SCREEN_MAP.md. Everything in the brief above
still applies — the tokens, the five motifs, the card spec, and all the hard rules,
especially the 1:1 placeholder rule for product images and the no-extra-screens
rule.

Use the components you made in Phase 1. Every card is an instance, every header is
an instance. If a screen needs something that doesn't exist yet, make it a
component first and then place it.

Build in SCREEN_MAP's own order, and deliver in batches so I can review as we go:

  Batch 1  PDP sheet · Manage card · Add money
  Batch 2  Rewards, and Reward detail
  Batch 3  Profile · Settings · Notifications
  Batch 4  Gift catalogue · Gift card detail
  Batch 5  Stories index · Stories reader · Support index · Support topic · Contact
  Batch 6  Order history · Store detail · Refer & Earn

Stop after each batch and show me what you have.

Two things to be careful of:

The Beverage Subscription screens are the least evidenced in the map — SCREEN_MAP
flags them as inferred rather than observed. Design them last, keep them
conservative, and tell me explicitly which decisions you invented.

Rewards is the most data-dense screen and the most observed, so follow SCREEN_MAP
§1.5 literally: the circular Green→Gold gauge, the milestone track at 200/300/400/
600, the segmented Available/Redeem carousel with 1/2 pagination, and the vertical
DOTTED timeline for recent activity. That dotted timeline is a real detail from the
app, not a stylistic choice — keep it.

Rewards and Stories are the two screens where Instrument Serif earns real estate.
Everywhere else, the ration holds: once per screen, never in a row, chip or button.
```

---

## Notes for you, not for Claude Design

- **Why the audit comes first.** Six known defects are listed, but they all share
  one cause — the card was copy-pasted rather than instanced. The audit is there to
  find the rest of that class before twenty new screens inherit it.
- **The componentisation ask is in Phase 1 on purpose.** You'd said you'd do it by
  hand. Letting Claude Design do it means Phase 2's twenty screens are built from
  instances from the start, instead of needing the same retrofit later.
- **`CLAUDE_DESIGN_PROMPT.md`** in this folder is the older prompt from the
  design-sync work — a different task (rendering the component library into
  claude.ai/design). It isn't superseded by this file; they just do different jobs.
