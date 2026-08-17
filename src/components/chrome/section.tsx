/**
 * The two layout rules every screen was writing out by hand.
 *
 * The audit found `sheet` / `section` / `gutter` copy-pasted into six
 * StyleSheets. Three rules, six copies, and one of them had already drifted —
 * `order.tsx` used `Space.lg` between sections where the other four used
 * `Space.xxl`. That is what a copy-pasted rule does: it does not stay copied.
 *
 * `Sheet` now owns the outer gap (see `SHEET_GAP` there). These two own the
 * inside:
 *
 * - `Section` is a titled block. `gap: Space.md` between the header and its
 *   content, because a header and the thing it labels are one object and want
 *   to sit closer than two sections do.
 * - `Gutter` is the horizontal inset. It exists as a component because full-bleed
 *   children — rails, chip rows — must *not* have it, so a screen ends up
 *   alternating gutter/no-gutter siblings, and a wrapper reads that alternation
 *   better than a style prop on every other child.
 *
 * Naming note: this `Gutter` shadows the `Gutter` *number* exported by
 * `@/theme`. A file that needs both imports the token as
 * `Gutter as GutterWidth`; the component gets the plain name because wrapping is
 * the common case and reaching for the raw number is not.
 */

import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { SectionHeader } from './section-header';

import { Gutter as GutterWidth, Space } from '@/theme';

/** Between a section header and its content. Also between rows inside a section. */
export const SECTION_GAP = Space.md;

type SectionProps = {
   /** Given a title, the section renders its own `SectionHeader`. */
   title?: string;
   kicker?: string;
   action?: string;
   onAction?: () => void;
   tone?: 'light' | 'inverse';
   /**
    * Inset the *content* — never the header, which manages its own gutter so
    * that a section holding a full-bleed rail still has an aligned title.
    */
   gutter?: boolean;
   gap?: number;
   children?: ReactNode;
   style?: StyleProp<ViewStyle>;
};

export function Section({
   title,
   kicker,
   action,
   onAction,
   tone = 'light',
   gutter = false,
   gap = SECTION_GAP,
   children,
   style,
}: SectionProps) {
   return (
      <View style={[{ gap }, style]}>
         {title ? (
            <SectionHeader
               title={title}
               kicker={kicker}
               action={action}
               onAction={onAction}
               tone={tone}
            />
         ) : null}

         {gutter ? <Gutter style={{ gap }}>{children}</Gutter> : children}
      </View>
   );
}

type GutterProps = {
   children: ReactNode;
   style?: StyleProp<ViewStyle>;
};

export function Gutter({ children, style }: GutterProps) {
   return <View style={[styles.gutter, style]}>{children}</View>;
}

const styles = StyleSheet.create({
   gutter: {
      paddingHorizontal: GutterWidth,
   },
});
