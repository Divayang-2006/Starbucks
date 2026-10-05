# Building with this design system

These are **React Native components rendered through react-native-web**, not web
components. That single fact drives every convention below.

## Setup

No provider, no theme wrapper, no context. Import and render:

```jsx
import { Button, Card, ProductCard, Theme } from 'starbucks';
```

Fonts and component styles arrive with the stylesheet — nothing to configure.

## Styling: there are no CSS classes

This system has **no class vocabulary at all**. Do not write `className`, and do
not invent one — nothing will resolve. Style in exactly two ways:

1. **Component props first.** Appearance is expressed as props, not styles:
   `variant`, `size`, `tone`, `full`, `selected`, `disabled`. Reach for a prop
   before a style object; `<Button variant="secondary" size="sm" />` is the
   idiom, a restyled button is not.
2. **Style objects for your own layout glue**, using React Native property
   names (camelCase: `flexDirection`, `paddingHorizontal`, `borderRadius`).

**Never hardcode a colour, space or radius.** Every value comes from `Theme`:

| Group | Members |
|---|---|
| `Theme.Surface` | `app` (warm cream — never grey-white), `raised`, `sunken`, `inverse` (House Green), `inverseDeep`, `tint`, `onDarkFill` |
| `Theme.TextColor` | `primary`, `secondary`, `tertiary`, `onDark`, `onDarkMuted`, `action` |
| `Theme.Action` | `primary`, `primaryPressed`, `primaryDisabled`, `selected`, `onPrimary` |
| `Theme.Border` | `hair`, `hairOnDark`, `strong` |
| `Theme.Accent` / `Status` / `Diet` / `Tier` | `gold`, `goldSoft`, `tan`, `caramel` / `success`, `error`, `errorOnDark`, `warning`, `info` / `veg`, `nonVeg` / `green`, `gold`, `reserve`, `reserveMetal` |
| `Theme.Space` | `xxs` 2, `xs` 4, `sm` 8, `md` 12, `base` 16, `lg` 20, `xl` 24, `xxl` 32, `huge` 48 (4pt scale) |
| `Theme.Radius` | `xs` `sm` `md` `lg` `xl`, `sheet` 28, `pill` 999 |
| `Theme.Sizes` | `tap` 44, `buttonHeight` 52, `chipHeight` 36, `fieldHeight` 48, `productThumb` 96, `inlineControl` 30, `markDisc` 56, `categoryDisc` 72, `trackHeight` 8, `dot` 8 |
| `Theme.RailCard` | `compact` 168, `standard` 236, `feature` 268 — fixed widths so the next card peeks |
| `Theme.TextStyles` | `display` `h1` `h2` `h3` `displaySerif` `titleSerif` `quoteSerif` `body` `bodyStrong` `bodySm` `bodySmStrong` `label` `caps` `micro` `price` `priceLg` |
| also | `Theme.IconSize`, `Theme.Stroke`, `Theme.Elevation`, `Theme.Gutter`, `Theme.Type`, `Theme.Pressed`, `Theme.Duration`, `Theme.Ease`, `Theme.Spring`, `Theme.CategoryAccent` |

## Three rules this system will not forgive

- **Spread a `TextStyles` entry; never pair it with `fontWeight`.** Each font
  file is a single static weight, so weight comes from the family. Asking for a
  weight the file lacks makes the platform synthesise one and smear the glyphs.
- **Fraunces is rationed.** `displaySerif` / `titleSerif` / `quoteSerif` are for
  a rewards hero, a store name, an article title. Never in a list row, chip,
  button or form. Twice on one screen means one is wrong.
- **`Glyph` takes a closed id set.** An invalid id throws and blanks the render:
  `home gift order pay rewards search scan plus minus chevronRight person crown
  pin article heart arrowLeft close menu`

## Where the truth is

Read the real files before styling — they beat any summary. Each component ships
`<Name>.prompt.md` (intent and usage) and `<Name>.d.ts` (the exact props, with
allowed values spelled out as string unions). `styles.css` and its imports carry
the tokens and the three typefaces (Urbanist for all UI, Fraunces for display,
Bebas Neue for the loyalty-card face). The `guidelines/` folder holds the
system's own design and navigation docs.

## An idiomatic screen fragment

```jsx
import { Section, Rail, ProductCard, Button, Theme } from 'starbucks';

<div style={{ background: Theme.Surface.app, paddingTop: Theme.Space.lg }}>
  <Section title="Picked for you">
    <Rail>
      <ProductCard
        name="Tiramisu Frappuccino"
        meta="TALL · 354 ml · 655 kcal"
        price={588}
        veg
        width={Theme.RailCard.compact}
        onAdd={() => {}}
      />
    </Rail>
  </Section>
  <div style={{ paddingHorizontal: Theme.Gutter }}>
    <Button label="See the full menu" variant="secondary" full />
  </div>
</div>
```

Layering runs one way — **chrome ← controls ← brand** — so a chrome component
takes a node in a slot (`action`, `footer`, `trailing`) rather than importing
upward. Use those slots instead of reaching for a new variant.

**Three components have no preview card** — `SessionStrip`, `BuildingHighlight`
and `StorePicker`. Each depends on a native host (a native tab accessory, the
Mapbox SDK, a session provider) that cannot exist on the web. They import and
type-check normally; only their visual preview is absent.
