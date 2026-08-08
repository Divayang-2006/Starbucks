import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

// Never fires — hydration happens exactly once, so there is no external change to subscribe to.
const subscribe = () => () => {};

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 *
 * `useSyncExternalStore` rather than the more obvious `useState` + `useEffect`: the server
 * snapshot is `false` and the client snapshot is `true`, so React resolves hydration in a
 * single pass. Setting state inside an effect would do the same thing one cascading render
 * later, which is what `react-hooks/set-state-in-effect` flags.
 */
export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const colorScheme = useRNColorScheme();

  return hasHydrated ? colorScheme : 'light';
}
