# Screen map

Every screen the app needs, what it is for, and the data it carries. Grounded in
[`APP_METADATA.md`](APP_METADATA.md) §2–§6 — which was built from real Starbucks
India screenshots — not invented. Anything not observed there is marked.

**Pruning rule applied:** a row in the account menu is only a screen if it has
content the menu itself cannot hold. Four candidate screens were cut and are
listed at the bottom with the reason.

Status: **built** = exists in Figma · **next** = designed, not drawn · **later**.

---

## 0. Already built in Figma

| Screen | Notes |
|---|---|
| `Auth · Get your card` | Landing. Card as hero, Guest path. |
| `Login · Phone` → `Login · 2 of 2 · Your card + code` | Number → fetch card → OTP. |
| `Sign up · 1 of 3 · Name` → `2 · Birthday` → `3 · Mobile` | Card-as-form. Card flips before step 3. |
| `Item · Curtain expanded` / `collapsed` | The menu, under the Curtain. |
| `Cart · Filled` / `Cart · Empty` | |
| `Card · Wallet (fanned stack)` · `Wallet · Guest` · `Wallet · Card face picker` | |
| `Map · Store picker` | Needs the header retro-fitted. |
| `FluidMenu · Mid-drag / Open / Settle` | |

---

## 1. The seven account screens you asked about

### 1.1 Profile — `profile`

**What it is for.** The only screen where identity is edited. Everything else in
the app *reads* the member; this one writes them.

**Data** (from §3, and the constraints are real — copy them):

| Field | Editable | Rule |
|---|---|---|
| Avatar | ✅ | Preset cup-character illustrations, not a photo upload. |
| First name | ✅ free edit | |
| Last name | ✅ free edit | |
| Birth date | ❌ **locked once set** | Renders `DD/MM/**` — year masked. Greyed. |
| Mobile number | ✏️ via pencil | Editing triggers **re-verification by OTP**. |
| Email | ✏️ via pencil | Same. |

Header carries avatar + full name + **tier badge**. One `Save changes` at the
bottom, not per-field saves.

**Why it matters here:** birth date locking and OTP-on-phone-change are the two
details that make this feel like a real account screen rather than a form.

**Components:** `ScreenHeader`, `Avatar`, `Field`, `ListRow`, `Button`, `Chip` (tier).

---

### 1.2 Starbucks Pay — `pay`

**What it is for.** The money view of the card. This is *not* a second wallet —
it is the wallet's transactional face. Wallet = which card and what it looks
like; Pay = balance, top-up, and the barcode you hold up at the till.

**Data:**
- Active card (tier face, last 4, balance `₹n.nn`)
- **Scan to pay** — barcode/QR, brightness boost, auto-refresh
- Auto-reload: on/off, trigger threshold, top-up amount, source
- Transaction list: date, store, amount, Stars earned, type (`Purchase` /
  `Reload` / `Refund`)
- Other payment modes (UPI, cards) — for top-ups only

**Screens:** `Pay · Card` (default) · `Pay · Scan` (full-bleed barcode, max
brightness) · `Pay · Add money` (amount chips ₹100/300/500/1000 + custom, source
picker, confirm) · `Pay · Activity` (filterable list).

**Components:** the tier card, `Balance`, `ActionBar`, `ListRow`, `Segmented`, `Stepper`.

---

### 1.3 Gift Cards — `gift`

**What it is for.** Buying a card *for someone else*. Distinct from your own
card in every way that matters: it has artwork, a recipient, and a message.

**Data** (§ Gift card model):
- Categories: `FEATURED / ANYTIME / CONGRATULATIONS / THANK YOU`
- Card: artwork, name, one-line description
- Real names to use: India Exclusive, Starbucks Coffee, U Keep Me Warm,
  Congrats, More Than Words, A Sip of Appreciation
- Purchase: amount, **message to recipient**, recipient name + mobile, delivery
  date (now / schedule), sender name

**Screens:** `Gift · Catalogue` (chips + 2-up grid — already the `Grid` call
site) · `Gift · Card detail` (artwork hero, amount chips, message field with
character count, recipient, `Send ₹n`).

**Components:** `ChipRow`, `Grid`, `Tile`, `Field`, `ActionBar`.

---

### 1.4 Beverage Subscription — `subscription`

**What it is for.** A recurring plan — the only genuinely commercial screen in
the account stack. On Home it appears as a promo banner with `Know More`, so
this is that banner's destination.

**Data** (not in the screenshots — **inferred, confirm before building**):
- Plan tiers: drinks per day/month, price, eligible drink categories
- Current state: active / lapsed / never subscribed
- If active: renews on, drinks used this cycle, pause, cancel
- Terms: which stores, which sizes, exclusions

**Screens:** `Subscription · Offer` (when not subscribed — hero, what's
included, price, `Start subscription`) · `Subscription · Active` (usage ring,
renewal date, pause/cancel).

**Flag:** this is the least evidenced screen in the set. Everything above is a
reasonable model of a coffee subscription, not an observation of theirs.

---

### 1.5 Rewards & Stars — `rewards`

**What it is for.** The loyalty engine, and the most data-dense screen in the
app. Also reachable as a tab.

**Data** (§4 — all observed, use verbatim):
- Tiers: **Green → Gold** (1,000 Stars/yr) **→ Reserve** (5,000)
- Earn rate: Green 1 Star per ₹10 · Gold ×1.2 · Reserve ×1.3
- Tier validity: 12-month window — "You are on the Green Tier until 09/08/2027"
- Milestones at **200 / 300 / 400 / 600** Stars, icons: drink, % off, food, beans
- Perks: Free Customized Mondays, accelerated earn, exclusive merch, event access

**Layout** (from screenshot 3):
1. Circular gauge — `BALANCE n ⭐ Stars`, arc Green→Gold, "1000 Stars to Gold"
2. Horizontal milestone track with a reward icon at each threshold
3. Segmented `Available Rewards | Redeem Rewards` + card carousel with `1/2`
   pagination and a progress bar
4. Reward card: status chip (`★ REWARD REDEEMED`), title, `EXPIRES ON
   dd/mm/yyyy`, `Use Reward`, `Details`, artwork
5. Recent Activity — **vertical dotted timeline**: icon, title, availability
   window, event type
6. Refer & Reap Rewards card (tan/gold, sparkle) + `Share invite code`

**Sub-screen:** `Reward · Detail` — full terms, eligible items, expiry, `Use`.

**Components:** `ProgressTrack`, `StarBalance`, `Segmented`, `Card`, `ListRow`, `Stat`.

---

### 1.6 Coffee Stories — `stories`

**What it is for.** Editorial. The one place the brand talks about coffee rather
than selling it — and the only screen where **Instrument Serif** earns real
estate beyond a single line.

**Data:**
- Article: hero image, `Coffee Culture` category chip, title, author, read time,
  body (rich text), publish date
- Saved / bookmarked state (the account stack has "Saved Articles and News")

**Screens:** `Stories · Index` (chips by category, cards with `Learn More`) ·
`Stories · Reader` (hero, serif title, body, share, save).

**Real title to use:** "The Art & Science of Coffee Brewing".

**Components:** `Tile`, `Section`, `Chip`.

---

### 1.7 Help & Support — `support`

**What it is for.** Self-serve answers first, contact second. Cheap to build,
and its absence is conspicuous.

**Data:**
- FAQ topics: Orders, Payments & Refunds, Rewards, Card & Balance, Account, Stores
- Article: question, answer body, "was this helpful"
- Contact: chat, email, phone, hours
- Legal & compliance: **Food Safety**, FSSAI licence, T&Cs, Privacy

**Screens:** `Support · Index` (search + topic rows + contact block) ·
`Support · Topic` (accordion list) · `Support · Contact`.

**Components:** `SearchField`, `ListSection`, `ListRow`, `EmptyState`.

---

## 2. Required screens not in your list

These are load-bearing — the app is broken or dishonest without them.

| Screen | Why it is required |
|---|---|
| **Product detail (PDP)** | Task 1. Bottom-up sheet: cutout hero on shelf, name, size (`short/tall/grande/venti`, and cold sizes), milk, shots, sweetness, toppings, `DietMark`, kcal, price recalculated live, `Add to Cart`. Observed in screenshots 5–6. |
| **Order history** | "Orders" is in the real account menu. Feeds *Reorder in one tap*, which the Wallet and empty Cart both already promise. Data: order id, store, date, items, total, status, `Reorder`. |
| **Settings** | Notifications toggles, language, appearance, permissions (location, camera for scan), delete account. The gear in the real Account header. |
| **Notifications** | The bell in the real Account header. Data: title, body, timestamp, read state, deep link. |
| **Manage card** | Task 2's target. Rename, set default, change face, remove, report lost, transfer balance. Reached from the Wallet. |
| **Store detail** | Already have components (`StoreDetail`, `Amenities`, `BusyTimes`, `ActivityChart`). Hours, amenities, busy times, contact, `Set as my store`. |
| **Refer & Earn** | Appears twice in the real app (Rewards + Account). Invite code, share sheet, what both sides get. |

---

## 3. Deliberately cut

Per your "no unnecessary screens" rule:

| Cut | Reason |
|---|---|
| Earn with Partners | No partner programme modelled. Add when one exists. |
| My Events | Event access is a *Reserve perk*; until events exist it is an empty screen. |
| My Addresses | Only needed if Delivery ships. Dine-In and Takeaway need a store, not an address. |
| Avatar editor | A sheet on Profile, not a screen — it is one grid of preset illustrations. |
| Other Payment Modes | A section inside `Pay · Add money`, not its own destination. |
| Food Safety | A row inside Support. It is one compliance page. |

---

## 4. Build order

1. **PDP sheet** — the biggest hole; the menu currently leads nowhere.
2. **Manage card + Add money** — completes the wallet loop the screens promise.
3. **Rewards** — most data-dense, most observed, most brand-defining.
4. **Profile + Settings + Notifications** — the account spine.
5. **Gift catalogue + detail** — self-contained commerce.
6. **Stories + Support** — content, cheapest to build.
7. **Order history + Refer & Earn** — depend on 1–3 existing first.

---

## 5. Screen count

Roughly **34 screens** including states, against the ~30–35 estimated in
`APP_METADATA.md` §2. Fourteen exist in Figma. Twenty remain.
