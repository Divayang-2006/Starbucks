# Starbucks India App — Reference Metadata

> Analyzed **2026-08-10** from: 6 real app screenshots in [`docs/Starbucks_SS/`](Starbucks_SS/),
> the starbucks.in web app (which mirrors the mobile app), the iOS App Store listing, and
> press coverage of the 2026 rewards revamp. This is the source-of-truth reference for
> screen planning, data models, and form fields.
>
> **Note:** screenshots contain the owner's personal data (name, phone, email, DOB). Field
> *structures* are documented here; personal values are intentionally not repeated.

---

## 1. App identity

| Property | Value |
|---|---|
| App | Starbucks India (Tata Starbucks alliance) |
| Version observed | **5.2.4** |
| Platforms | iOS 16.0+ (162.6 MB), Android (`com.starbucks.in`) |
| App Store ID | `id1210203958` (Food & Drink, ★3.9) |
| Languages | English, Hindi |
| Auth extras | Face ID / fingerprint biometric login |
| Catalog scale | 100+ handcrafted beverages, 60+ food items |

---

## 2. Information architecture

### Bottom tab bar (5 tabs, floating dark pill)

| Tab | Web route | Reference icon (fetch on demand, see §9) |
|---|---|---|
| Home | `/dashboard` | `assets/icon/dashbaord.svg` (sic — typo is theirs) |
| Gift | `/giftcards` | `assets/icon/gift-nav.svg` |
| Order | `/ordering` | `assets/icon/menu.svg` |
| Pay | — | `assets/icon/cards.svg` |
| Rewards | `/rewards` | `assets/icon/rewards-active.svg` |

Account is **not a tab** — it's reached from the avatar icon in the Home header
(web route `/profile`). Web-only extras: Store Locator (`/store-locator`), Corporate Gifting.

### Screen inventory (observed ✅ / inferred from nav items 🔎)

**Auth & onboarding**
1. Splash / intro ✅ (implied)
2. Login-SignUp — single mobile-number field 🔎✅ (web)
3. OTP verification 🔎
4. Profile completion (first/last name, DOB, email) 🔎
5. Guest mode (login has a `SKIP` action) ✅ (web)

**Tabs**
6. Home feed ✅ (screenshot 4)
7. Gift — card catalog: Featured / Anytime / Congratulations / Thank You ✅ (web)
8. Gift card detail + purchase (amount, message, recipient) 🔎
9. Order — store picker (Dine-In / Takeaway; ETA per store) ✅ (web)
10. Order — menu browse (tabs + category chips + search) ✅ (web)
11. Product detail w/ customization ✅ (screenshots 5–6)
12. Cart / checkout 🔎 (sticky "Add to Cart" bar observed)
13. Pay — Starbucks Pay card, scan-to-pay, balance ₹, add money 🔎 (Home shows "Pay ₹0.00")
14. Rewards dashboard ✅ (screenshot 3)

**Account stack** (each row is a screen) ✅ (screenshot 2)
15. Account menu
16. Personal Information ✅ (screenshot 1)
17. Starbucks Rewards (same as tab)
18. Orders (history)
19. Earn with Partners
20. My Events
21. Starbucks Pay (management)
22. Other Payment Modes
23. My Addresses (add/edit address)
24. Help Center
25. Saved Articles and News
26. Food Safety
27. Settings (gear icon in Account header)
28. Notifications (bell icon in Account header)
29. Avatar editor (pencil on avatar; preset cup-character avatars)
30. Refer & Earn / invite-code share sheet

**Content**
31. Coffee-culture article reader ("Art & Science of Coffee Brewing") ✅ (Home)
32. Events listing/registration 🔎

**≈ 30–35 screens total.** Suggested build order: tab skeleton → Home → Order (menu + PDP) → Rewards → Pay → Gift → Account stack.

### Screenshot map

| File (in `Starbucks_SS/`) | Screen |
|---|---|
| `…00-50-42…` | Personal Information |
| `…00-51-04…` | Account menu |
| `…00-51-37…` | Rewards dashboard |
| `…00-53-34…` | Home feed (full scroll) |
| `…00-56-41…` | PDP — customization collapsed |
| `…00-56-57…` | PDP — add-ons expanded |

---

## 3. Auth & profile field schema

**Login / Sign-up (single entry point, phone-first):**

| Field | Type | Constraints |
|---|---|---|
| Mobile number | `tel`, numeric keypad | exactly 10 digits (India), placeholder "Enter Mobile Number to Continue" |
| → OTP | numeric | sent via SMS after Continue |

No password anywhere. `SKIP` → guest browsing.

**Personal Information screen:**

| Field | Editable | Notes |
|---|---|---|
| FIRST NAME | ✅ free edit | text input, underline style |
| LAST NAME | ✅ free edit | text input |
| BIRTH DATE | ❌ locked after set | displayed `DD/MM/**` (year masked), greyed out |
| MOBILE NUMBER | ✏️ via pencil icon | edit triggers re-verification (OTP) |
| EMAIL ID | ✏️ via pencil icon | |
| — | — | single `Submit` CTA at bottom |

Header shows avatar (editable, cup-character illustration) + full name + tier badge.

---

## 4. Rewards model

| Concept | Value |
|---|---|
| Tiers | **Green** (entry) → **Gold** (1,000 Stars/yr) → **Reserve** (5,000 Stars, added in 2026 revamp) |
| Earn rate | Green: **1 Star per ₹10** · Gold: ×1.2 · Reserve: ×1.3 |
| Tier validity | 12-month window ("You are on the Green Tier **until 09/08/2027**") |
| Milestone rewards | at **200 / 300 / 400 / 600** Stars (icons: drink, % off, food, coffee beans) |
| Perks | Free Customized Mondays (1 free modifier), accelerated earn, exclusive merch, event access |

**Rewards dashboard UI (screenshot 3):**
- Circular gauge: `BALANCE n ⭐ Stars`, arc from Green → Gold, "1000 Stars to Gold" label.
- Horizontal milestone track with reward icons at each star threshold.
- Segmented tabs: `Available Rewards | Redeem Rewards`; card carousel with pagination (`1/2`) + progress bar + "View all".
- **Reward card fields:** status chip (`★ REWARD REDEEMED`), title ("Buy 1 Food, Get 50% Off…"), `EXPIRES ON dd/mm/yyyy`, primary `Use Reward` btn, `Details` link, artwork.
- **Recent Activity:** vertical dotted timeline; each entry = icon, title, availability window, event type ("Reward Earned").
- Refer & Reap Rewards card (tan/gold, sparkle motif) with `Share invite code` — repeated on Account screen too.

**Home stats strip:** `⭐ n Stars · ★ n Rewards · Pay ₹n.nn` — the three key user-state numbers.

---

## 5. Commerce / menu model

**Order modes:** Dine-In, Takeaway (web; app also does Delivery — footer link exists). Store selector shows address + ETA ("00 mins").

**Menu taxonomy:**
- Top-level tabs: `Drinks | Food | At Home Coffee | Merchandise`
- Category chips (circular, image-backed): `New Launch, Best Seller, Drinks, Food, Merch, At Home Coffee, Ready to Eat, Power Picks`

**Product card:** image (square, CDN), veg indicator, name, default size + ml + kcal, price, `+` add button.

Sample live data (Aug 2026):

| Product | Size shown | kcal | Price |
|---|---|---|---|
| Tiramisu Frappuccino | TALL 354 ml | 655 | ₹588.00 |
| Tiramisu Cold Brew | — | 462 | ₹488.25 |
| Iced Coconut Matcha | — | 117 | ₹472.50 |
| Iced Strawberry Matcha | — | 274 | ₹472.50 |
| Apricot Iced Shaken Espresso | TALL 354 ml | 140 | ₹414.75 |
| Black Palm Jaggery Latte | SHORT | 197 | ₹393.75 |
| Malabar Coconut Flat White | SHORT 237 ml | 257 | ₹456.75 |
| Vietnamese Cold Brew | VENTI 591 ml | 220 | ₹535.50 (customized) |

### Product Detail (PDP) schema — from screenshots 5–6

**Header:** full-bleed hero photo; overlay buttons: back, expand/fullscreen, ♥ favourite.
**Meta row:** `● VEGETARIAN` (green square-dot), `~220 KCAL`, title (serif display), description with `Read More`, allergen chips (`MILK`).

**Customization groups** (collapsible section "CUSTOMISE YOUR DRINK", subtitle shows current selection e.g. "VENTI, Regular milk"):

| Group | Rule | Options (+price delta) |
|---|---|---|
| Size | select one | SHORT 237 ml · TALL 354 ml (−₹47.25 vs Venti shown as relative) · GRANDE 473 ml · VENTI 591 ml — cup images, per-size price |
| Milk | select one | Regular +₹0 · Skimmed +₹0 |
| Non-dairy alternatives | select one | Soy +₹68.25 · Almond +₹89.25 · Oats +₹89.25 |

**Add-ons** (collapsible "AMP UP YOUR DRINK WITH ADD-ONS", shows "(Default)" summary):

| Group | Rule | Options (+delta each) |
|---|---|---|
| Syrups & Sauces | **select up to 4**, qty steppers `− n +` | White Mocha Sauce ₹57.75 · Mocha Sauce ₹57.75 · Classic Syrup (sweet) ₹57.75 · Caramel Drizzle ₹57.75 |
| Hazelnut Flavour | select one | Less Sweet / Unsweetened / Regular — ₹68.25 |
| Vanilla Flavour | select one | Less Sweet / Unsweetened / Regular — ₹68.25 |
| Caramel Flavour | select one | Regular / Less Sweet / Unsweetened — ₹68.25 |
| Whipped Topping | select one | No Whipped +₹0 (default, qty 1) · With Whipped +₹36.75 |
| Ice Cream Scoop | select one | Vanilla ₹89.25 · Java Chip ₹89.25 · Caramel Macchiato ₹89.25 |

**Sticky footer bar (dark green):** `CURRENT ITEM` label + product name + live computed total (`₹535.50`) + full-width `Add to Cart` pill.

Pricing pattern: every option displays a **delta** (`+₹x.xx`); totals recompute live. Prices are ~5% GST-inclusive style values (`.25/.50/.75` endings everywhere).

### Gift card model (web)

Categories: `FEATURED / ANYTIME / CONGRATULATIONS / THANK YOU`. Card = artwork + name + one-line description + `Add Item`. Sample cards: "India Exclusive", "Starbucks Coffee", "U Keep Me Warm", "Congrats", "More Than Words", "A Sip of Appreciation".

---

## 6. Home screen module stack (screenshot 4, top→bottom)

1. **Hero header** — photo background (barista pour), Starbucks siren logo, `Hi, {firstName}`, gift-card icon + avatar icon (→ Account).
2. **Stats strip** — Stars · Rewards · Pay balance.
3. **"Redeem your Stars"** — reward carousel (pagination `1/7`, `View all`); locked state = greyed `Unlock Reward` button when stars insufficient (e.g. "Free Customization — Redeem this for 200★").
4. **Promo banner cards** — e.g. Beverage Subscription (`Know More`), co-branded campaign ("Dots Doodles × Starbucks — Back to campus", `Get Now`).
5. **Video merch card** — autoplaying, rounded, mute toggle ("Your Drink's New Bestie — Pink Bearista glass cold cup").
6. **"Handcrafted Curations"** — 6 circular image chips: New Launch, Best Seller, Drinks, Food, Merch, At Home Coffee.
7. **"Recommended"** — horizontal product rail (image, name, size subtitle, price, `+`).
8. **"Learn more about the World of Coffee"** — editorial article cards (`Coffee Culture` chip, title, `Learn More`) + `Discover More`.
9. **Compliance footer** — "An average active adult requires 2,000 kcal energy per day…" + `FSSAI Lic. No. 10015022003801`.

---

## 7. Design language (observed)

**Color** (eyeballed from screenshots; verify against exports before coding):

| Role | Approx |
|---|---|
| Primary CTA green (`Submit`, `Use Reward`, active chips) | `#006241` |
| Dark forest green (headers, sticky bars, tab bar) | `#1E3932` |
| App background cream | `#F7F5F0` / `#F2F0EB` |
| Card white | `#FFFFFF` |
| Gold/star accent | `#C7A252`–`#CBA258` |
| Tan promo card bg (Refer & Reap) | `#E5D3B3`-ish with darker sparkle motifs |
| Destructive (Log Out) | red `#D62B1F`-ish |
| Text primary | near-black `#1E1E1E`; secondary grey `#7C7C7C` (⚠ ~3.6:1 on cream — fails WCAG AA) |

Our palette is **not** a straight copy of the above — see [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) for what we changed and why.

**Typography:** Starbucks brand sans ("SoDo Sans"-style) throughout — the app is **single-family**, hierarchy comes from weight alone. ALL-CAPS letterspaced micro-labels for form labels, list rows, and section kickers (`FIRST NAME`, `CURRENT ITEM`).

> Corrected 2026-08-11: an earlier revision recorded PDP product titles as a serif display face. They are the brand sans at heavy weight (screenshot 5, "Vietnamese Cold Brew"). There is no serif anywhere in the reference app.

**Shape & motifs:**
- Dark-green header area with a **white sheet rounded ~28px at the top** sliding over it (Personal Info, Account, Rewards).
- Pill buttons everywhere (full-radius); dark floating pill tab bar.
- Circular avatar with double ring (white + green) and pencil badge.
- Underline-style text fields (no boxes) with grey ALL-CAPS labels.
- Dotted vertical timeline for activity; circular progress gauge for tier.
- Decorative leaf line-art on dark green; sparkles/stars on gold cards.
- Steppers `− n +` for quantity options; light-grey pill chips for single-select options (dark green fill when selected).
- Light theme only — no dark mode observed.

---

## 8. India-market specifics (must replicate)

- ₹ pricing with paise (`.25/.50/.75` deltas), GST-inclusive.
- **Veg indicator** (green dot in rounded square — FSSAI mandated) on every consumable.
- **kcal count** shown on every product card and PDP.
- FSSAI license number + 2,000 kcal advisory in Home footer.
- Phone-first auth (10-digit, +91 implied), OTP, no passwords.
- English + Hindi localization.
- Tata Starbucks branding ("Tata Starbucks" in web titles), "Starbucks + 27 Bake House" store concept exists.

---

## 9. Assets — fetch on demand (not stored in repo)

Reference assets are **deliberately not committed to git** (Starbucks IP). When an asset is
needed for reference during development, fetch it ad hoc from the official public endpoints
below (verified working with `curl`, 2026-08-10):

```
Product images:   https://starbucksstatic.cognizantorderserv.com/Items/{Small|Large}/{itemId}.jpg
Category tiles:   https://starbucksstatic.cognizantorderserv.com/Category/Small/{Name}.jpg
CMS uploads:      https://preprodtsbstorage.blob.core.windows.net/cms/uploads/{file}
Web UI icons:     https://www.starbucks.in/assets/icon/{name}.svg|png
Web images:       https://www.starbucks.in/assets/images/{name}.png
```

Note: `curl` works against starbucks.in; some HTTPS clients reject its incomplete cert chain.

---

## 10. Gaps — screenshots still wanted

- Order tab: store picker, cart, checkout, order tracking
- Pay tab: card/QR scan screen, add money, transaction history
- Gift: purchase + redemption flow
- OTP screen, sign-up completion, avatar editor
- Settings, Notifications, My Addresses, Help Center
- Any empty states, loaders, error states
- Font confirmation (export/inspect IPA or measure letterforms)
