# Claude Design prompt

Paste into a chat in the **Starbucks Recreation System** project at
claude.ai/design. The design system is already loaded there, so the agent builds
with the real components rather than generic ones.

Two parts — you can send them together or split them into two turns (splitting
gives you a chance to correct the gallery before the screens are built on it).

---

## Part 1 — The component library, as a designed spec

```text
This project has our design system loaded: 86 real components from the Starbucks
app, with their true prop contracts and our three brand typefaces. Build with
these components — never substitute a generic equivalent, never write a CSS
class, and never hardcode a colour, spacing value or radius. Everything comes
from the Theme namespace (Theme.Surface, Theme.Space, Theme.Radius,
Theme.TextStyles and friends). Read the README's conventions section and any
component's .prompt.md / .d.ts before you use it.

Build me a design-system specification page — the document a designer and an
engineer would both work from. Lay it out as one long scrollable page on a warm
cream ground (Theme.Surface.app), organised into these sections in this order:

1. Foundations
   - The colour system, as swatch rows grouped semantically: Surface, TextColor,
     Action, Border, Accent, Status, Diet, Tier. Label every swatch with its
     token path and hex. Show the dark-surface tokens ON House Green, not on
     cream, so they are legible.
   - The type scale: every TextStyles entry set in its real font at its real
     size, labelled with the token name, size and line height. Group the three
     Fraunces serif styles separately and mark them "rationed — display only".
   - The 4pt spacing scale and the radius scale, drawn to scale rather than
     listed as numbers.
   - The Glyph set: all 18 icons at IconSize.lg, each labelled with its id.

2. Controls — Button (all five variants at both heights, plus disabled and
   loading), IconButton, Segmented, Stepper, Field, SearchField.

3. Chrome — the layout and surface primitives: Card, Chip, ChipRow, ListRow,
   ListSection, Section, SectionHeader, Rail, Grid, Tile, Sheet, ScreenHeader,
   ActionBar, EmptyState, Divider, Stat, StatStrip.

4. Brand — Avatar, Balance, PriceTag, ProductThumb, ProductCard (tile and row),
   ProgressTrack, StarBalance, StoreRow.

5. Composed — LoyaltyCard, the account menu (MenuPanel with MENU_ITEMS), and the
   store list and detail.

For every component show: its name, a one-line description of what it is for,
its primary variant axis swept, and its realistic resting state. Use real
content throughout — our catalogue (Tiramisu Frappuccino ₹588, Iced Coconut
Matcha ₹472.50, Malabar Coconut Flat White ₹456.75) and our real stores
(Koregaon Park, North Main Road, Pune). Never use lorem ipsum or placeholder
names.

Three components have no preview card because they need a native host that does
not exist on the web — SessionStrip, BuildingHighlight and StorePicker. List
them in an appendix with that explanation rather than trying to render them.
```

---

## Part 2 — Three new screens

```text
Now design three new screens for the app, using only our design system's
components and tokens. Our navigation has moved to two poles: Chat and Card are
the two tab roots, and everything else is reached from the slide-out account
menu (FluidMenu). Item is not a tab — it is pushed from within a tab.

Design each screen at 390×844, on Theme.Surface.app, with our own ScreenHeader
band at the top rather than an invented header.

SCREEN 1 — Chat (tab root)
Ordering by conversation instead of by browsing a menu. The screen is a
conversation between the customer and the store.
- ScreenHeader with the store name and an AvatarButton that opens the account
  menu.
- A conversation thread: customer messages right-aligned, store replies
  left-aligned. Style the bubbles from tokens — Theme.Surface.raised for
  incoming, Theme.Surface.inverse with TextColor.onDark for outgoing.
- When the assistant suggests drinks, it renders real ProductCard tiles inline
  inside the reply, in a Rail — this is the point of the screen, so make it the
  visual centre.
- ChipRow of quick replies above the composer ("Same as last time", "Something
  iced", "Under 200 kcal").
- A composer pinned at the bottom: a Field with a send IconButton, wrapped in
  BottomChrome so it clears the tab bar.
- Show one order being confirmed in-thread with a PriceTag and a Stepper.

SCREEN 2 — Card (tab root)
The customer's identity and money in one place — this is the Starbucks card.
- The LoyaltyCard front, large and centred, as the hero.
- Balance beneath it (kicker "BALANCE", value "₹1,240.00") and StarBalance.
- ProgressTrack showing progress to the next reward, with the milestone count.
- An ActionBar with two actions: "Scan to pay" (primary, glyph "scan") and
  "Add money" (secondary, glyph "plus").
- A ListSection of recent transactions — store name, date, amount — using
  ListRow with PriceTag in the trailing slot.
- A StatStrip showing Stars earned this year and visits.

SCREEN 3 — Item (pushed, not a tab)
The product detail screen, reached by tapping a ProductCard.
- A large hero image area using ProductThumb's fill treatment, with a back
  HeaderButton (glyph "arrowLeft") floating over it and a heart IconButton.
- Name in TextStyles.h1, the meta line ("TALL · 354 ml · 655 kcal") in micro,
  and a DietMark for the FSSAI indicator.
- PriceTag showing a discounted price (was ₹520, now ₹456.75).
- Size selection with Segmented (Short / Tall / Grande / Venti).
- Customisation groups as ChipRow sections inside a Sheet — milk, sweetness,
  espresso shots — with SectionHeader above each.
- A Stepper for quantity.
- A sticky ActionBar at the bottom: summary on the left showing the running
  total, "Add to Cart" as the primary action, wrapped in BottomChrome.

For all three, respect our rules: Fraunces only for a display moment (never in a
row, chip or button), never pair fontWeight with a Type family, and only use
glyph ids from our closed set. Show me each screen as a separate frame.
```

---

## If you want to adjust the tab mapping

The stage-2 plan on record was two poles as **Products + Cart**. The prompt above
reads Chat and Card as the two tab roots, with Item pushed. If that is wrong,
change the second paragraph of Part 2 — nothing else depends on it.
