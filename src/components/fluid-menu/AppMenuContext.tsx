/**
 * `openMenu`, carried from the layout that owns the panel to the button that
 * opens it.
 *
 * The control that opens the panel belongs *inside* the app content rather than
 * beside it — that is the whole shape of the effect. In the app the content is
 * `NativeTabs` and the button is `AvatarButton` in Home's header: a tab
 * controller and a stack below the thing that owns `openMenu`. A navigator is
 * not something you thread a prop through, so this is the seam.
 *
 * It used to be the *second* seam. `FluidMenu` also handed `openMenu` to a
 * render prop, so a consumer whose content was one component — the lab harness —
 * could take the callback directly and never mount a provider. That was a
 * second mechanism for a job this one already did, and it made the harness
 * exercise everything about the menu except the part most likely to break. The
 * render prop is gone; `FluidMenu` mounts the provider itself, and every
 * consumer including the lab reaches `openMenu` the same way.
 *
 * Deliberately one callback and nothing else. `progress` stays a shared value
 * inside `FluidMenu`: publishing it here would invite a screen to animate
 * against the panel, and anything that reads it from React re-renders once a
 * frame. There is also no `closeMenu` — dismissal is the menu's own job (see
 * `handleSelect` in `FluidMenu.tsx`), and a caller that can close it is a
 * caller that can leave it half-closed.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';

type AppMenuValue = {
   /** Slides the app card away to reveal the account panel. */
   openMenu: () => void;
};

const AppMenuContext = createContext<AppMenuValue | null>(null);

export function AppMenuProvider({
   openMenu,
   children,
}: {
   openMenu: () => void;
   children: ReactNode;
}) {
   const value = useMemo(() => ({ openMenu }), [openMenu]);

   return <AppMenuContext.Provider value={value}>{children}</AppMenuContext.Provider>;
}

export function useAppMenu() {
   const value = useContext(AppMenuContext);
   if (!value) {
      throw new Error(
         'useAppMenu must be used inside <FluidMenu>, which mounts the provider around its children.',
      );
   }
   return value;
}
