/**
 * The slide-out account menu, as one import.
 *
 * Two halves that have to travel together: `FluidMenu`, which owns the motion
 * and produces `openMenu`, and `useAppMenu`, which is how the button two
 * navigator levels down gets hold of it. A consumer holding one and not the
 * other is a consumer with a bug — either a panel nothing can open, or a hook
 * that throws.
 *
 * `AppMenuProvider` is deliberately *not* here, and used to be. `FluidMenu`
 * mounts it around its own children now, so a consumer that could reach it is a
 * consumer that could mount a second one and shadow the real `openMenu` with a
 * different panel's — the failure being an avatar that opens nothing, silently.
 * Nothing outside this folder should name it.
 *
 * Everything else a consumer needs is re-exported here, including `MENU_ITEMS`
 * and its types, so `./items` is not a path anyone reaches for either.
 * `StageMock` is the one exception and is absent on purpose: it is scenery for
 * the lab harness rather than part of the mechanism, and the one file that wants
 * it reaches for it by path.
 */

export { useAppMenu } from './AppMenuContext';
export { FluidMenu } from './FluidMenu';
export { MENU_ITEMS, type MenuItem, type MenuItemId } from './items';
