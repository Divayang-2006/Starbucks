# Onboarding flow

Ported 2026-08-10 from the Recreation project (`C:\Users\divay\OneDrive\Desktop\Recreation`)
and reskinned for Starbucks. The flow is a **card-as-form**: a membership card is the
form — you type your details straight onto its printed lines, it flips over for the
phone number, then drops into a wallet while the screen turns green for OTP entry.

## Where it lives

- Route: [`src/app/onboarding.tsx`](../src/app/onboarding.tsx) — registered in the root
  Stack with a fade transition. Entry today is a dev link on the Home tab; auth gating
  comes later.
- Everything else: [`src/components/onboarding/`](../src/components/onboarding/) — a
  self-contained island. It does not touch the app-shell theme (`src/constants/theme.ts`);
  it has its own `theme.ts` (chrome palette + card geometry), `fonts.ts` (Urbanist +
  Bebas Neue), `fields.ts` (the form schema), and `cardStyles.ts` (card editions).

## Data fields (matches the real Starbucks India app)

| Step | Field | Rules |
|---|---|---|
| 1 | Name (card front) | ≥ 2 chars, max 18 |
| 2 | Birth date (card front) | `DD/MM/YYYY`, real-date validated |
| 3 | Mobile (card back, signature panel) | 10 digits, India `00000 00000` grouping |
| 4 | OTP | 6 digits, auto-verifies on the last digit (mock — any code passes except a repeated digit like `000000`) |

Email is deliberately **not** in the flow — the real app collects it later in Personal
Information, which is where ours will too. No passwords anywhere, matching the real app.

## The Starbucks cards

Five green editions in `cardStyles.ts` — the picker never leaves the brand family:
**House** (default), **Forest**, **Jade**, **Sage**, **Reserve** (near-black). Each is a
TL→BR gradient face, a darker back, a magstripe, and a guilloché pattern (arcs /
hairlines / dots), all drawn in SVG — zero image assets.

The **siren watermark** (`CardFront.tsx`): the one-colour siren printed at 118 pt in
white at 16 % opacity, hung off the bottom-right corner so the card edge trims it
(~30 pt off the right, ~34 pt off the bottom), clipped by the card's real corner
radius, sitting under the gloss sweep. `LOGO_CORNER` flips it to bottom-left.
The mark itself is `SirenLogo.tsx` (single SVG path, fill as a prop — also used
small in the welcome badge).

## The holographic welcome (`HoloTilt.tsx`)

On the welcome screen the claimed card follows the device's tilt (±6°,
perspective-projected) and a diagonal light band slides across the face
against the lean — the trimmed siren catches it as it passes. Driven by
`expo-sensors` DeviceMotion *attitude* (not gyro rate), sampled at ~30 Hz and
retargeted through 120 ms timing curves so it glides instead of stepping. The
first reading after the claim becomes neutral, so however the phone is held
is "flat". No sensor (desktop web) → the card sits still. The tilt is
disabled during the form on purpose — while you're typing, the card is a form.

## Still mock / to build

- OTP verification is a mock (no backend by design — this project is UI-only).
- No persistence: finishing the flow just `router.back()`s. "Has onboarded" state
  and routing gates are future work.
- Copy on the welcome screen states the real earn rate (1 star / ₹10, first reward
  at 200 stars).

## Conventions inherited from the source (keep them)

- 3-space indent inside `src/components/onboarding/` (matches upstream).
- Reanimated 4 style: `.get()`/`.set()`, `scheduleOnRN` from `react-native-worklets`.
- Never set `fontWeight` next to a `Type.*` family — each family file is one weight.
- No `KeyboardAvoidingView` — keyboard height is measured manually.
