/**
 * Web stand-in for `expo-router`.
 *
 * The real router is an app-shell concern — it wants a route tree, a navigation
 * container and a root layout, none of which exist when a single component is
 * rendered alone in a preview card. Components in this DS use it only to *link*
 * (`Link`) or to read/push routes, so the shim keeps those surfaces inert and
 * visually faithful: a `Link` still renders its children and still looks like a
 * link, it just doesn't navigate.
 */

import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

export type Href = string | { pathname: string; params?: Record<string, unknown> };

const noop = () => {};

export const useRouter = () => ({
   push: noop,
   replace: noop,
   back: noop,
   canGoBack: () => false,
   navigate: noop,
   dismiss: noop,
   dismissAll: noop,
   setParams: noop,
});

export const router = useRouter();

/** Route segments. Empty is the honest answer outside a navigator. */
export const useSegments = () => [] as string[];
export const usePathname = () => '/';
export const useLocalSearchParams = () => ({});

export function Link({
   children,
   style,
   asChild: _asChild,
   href: _href,
   ...rest
}: {
   children?: ReactNode;
   style?: unknown;
   asChild?: boolean;
   href?: Href;
   [k: string]: unknown;
}) {
   // Strings get wrapped so a bare `<Link>label</Link>` still paints type;
   // element children are passed through untouched so `asChild` compositions
   // (the common case in this repo) render exactly as they do on device.
   if (typeof children === 'string') {
      return (
         <Text style={style as never} {...rest}>
            {children}
         </Text>
      );
   }
   return <>{children}</>;
}

export function Stack({ children }: { children?: ReactNode }) {
   return <View style={{ flex: 1 }}>{children}</View>;
}
Stack.Screen = function Screen() {
   return null;
};

export const DefaultTheme = {
   dark: false,
   colors: {
      primary: '#00754A',
      background: '#FBF8F3',
      card: '#FFFFFF',
      text: '#1E1E1E',
      border: '#E5E0D8',
      notification: '#D62B1F',
   },
};

export function ThemeProvider({ children }: { children?: ReactNode; value?: unknown }) {
   return <>{children}</>;
}

export function Redirect() {
   return null;
}

export const useNavigation = () => ({ setOptions: noop, navigate: noop, goBack: noop });
export const useFocusEffect = () => {};
