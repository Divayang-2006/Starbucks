/**
 * The design-system surface published to claude.ai/design.
 *
 * This is a sync input, not app code — nothing in `src/` imports it. It exists
 * so the converter bundles exactly the surface we mean to publish rather than
 * sweeping `src/` and dragging in route files, hooks and fixtures.
 *
 * Layering mirrors `src/components/chrome/index.ts`: chrome ← controls ← brand.
 *
 * Two deliberate omissions, both taken from the barrels' own instructions:
 *
 *  · `AppMenuProvider` is not exported. `src/components/fluid-menu/index.ts` is
 *    explicit that nothing outside that folder should name it — `FluidMenu`
 *    mounts it around its own children, and a second one silently shadows the
 *    real `openMenu`, leaving an avatar that opens nothing.
 *  · `@/theme` is exported as a *namespace*, not spread. Chrome exports a
 *    `Gutter` component and the theme exports a `Gutter` number; a flat
 *    `export *` from both would make the name ambiguous and ESM would silently
 *    drop it. `Theme.Gutter` keeps the token reachable and the component intact.
 */

// Must stay first — installs the `process`/`__DEV__` globals that Metro would
// otherwise provide. See the shim's header for why this ordering is load-bearing.
import './shims/process-polyfill';

/* ── Design tokens, as one namespace: Theme.Surface, Theme.Space, … ────── */
export * as Theme from '@/theme';

/* ── chrome ← controls ← brand ─────────────────────────────────────────── */
export * from '@/components/chrome';
export * from '@/components/controls';
export * from '@/components/brand';
export * from '@/components/accessory';

/* ── The slide-out account menu. FluidMenu is the public entry point; the
      three pieces below are its parts, published so the design agent can
      compose a menu rather than only drop the finished one. ─────────────── */
export { FluidMenu } from '@/components/fluid-menu/FluidMenu';
export { MenuBackdrop } from '@/components/fluid-menu/MenuBackdrop';
export { MenuPanel } from '@/components/fluid-menu/MenuPanel';
export { MenuRow } from '@/components/fluid-menu/MenuRow';
export { StageMock } from '@/components/fluid-menu/StageMock';

// `MenuPanel`'s `items` prop is REQUIRED, so publishing the panel without the
// row data leaves a consumer unable to render it at all. `./items` imports only
// types, so this ships as pure data — no second copy of React Native.
export { MENU_ITEMS, type MenuItem, type MenuItemId } from '@/components/fluid-menu/items';

/* ── Onboarding: the card-as-form flow and the loyalty card it builds. ─── */
export { CardBack } from '@/components/onboarding/CardBack';
export { CardFront } from '@/components/onboarding/CardFront';
export { CardLine } from '@/components/onboarding/CardLine';
export { CardPattern } from '@/components/onboarding/CardPattern';
export { HoloTilt } from '@/components/onboarding/HoloTilt';
export { LoyaltyCard } from '@/components/onboarding/LoyaltyCard';
export { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
export { OtpInput } from '@/components/onboarding/OtpInput';
export { PrimaryButton } from '@/components/onboarding/PrimaryButton';
export { ProgressDots } from '@/components/onboarding/ProgressDots';
export { SirenLogo } from '@/components/onboarding/SirenLogo';
export { StylePicker } from '@/components/onboarding/StylePicker';
export { PocketBack, PocketFront } from '@/components/onboarding/Wallet';

/* ── Store picker: map, list, detail and their parts. ───────────────────── */
export { BuildingHighlight } from '@/components/store-picker/BuildingHighlight';
export { ActivityChart, BusyTimes } from '@/components/store-picker/BusyTimes';
export { CityRail } from '@/components/store-picker/CityRail';
export { ConfirmButton } from '@/components/store-picker/ConfirmButton';
export { CupMark } from '@/components/store-picker/CupMark';
export { EdgeFade } from '@/components/store-picker/EdgeFade';
export { ChevronGlyph, CloseGlyph, CrosshairGlyph, SearchGlyph } from '@/components/store-picker/Glyphs';
export { MapPlate } from '@/components/store-picker/MapPlate';
export { PickerHeader } from '@/components/store-picker/PickerHeader';
export { Accessibility, Amenities, ContactRows, PlacesAttribution } from '@/components/store-picker/PlaceFacts';
export { ServicePills } from '@/components/store-picker/ServicePills';
export { StoreDetail } from '@/components/store-picker/StoreDetail';
export { StoreList } from '@/components/store-picker/StoreList';
export { StoreMap } from '@/components/store-picker/StoreMap';
export { StorePicker } from '@/components/store-picker/StorePicker';
export { StorePin } from '@/components/store-picker/StorePin';
export { StoreSheet } from '@/components/store-picker/StoreSheet';
