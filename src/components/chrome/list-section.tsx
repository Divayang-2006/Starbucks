/**
 * A group of `ListRow`s sharing one background, with hairlines between them and
 * none at the ends.
 *
 * Two screens solved this and neither solution was reusable. `pay.tsx` cancelled
 * `Card`'s padding with `padding: 0` and then re-added it per row plus a manual
 * `index > 0 && divided`; `rewards.tsx` skipped the card entirely and drew its
 * own dotted gutter. The row-index arithmetic is the part worth deleting — it is
 * off-by-one bait, and it has to be repeated at every call site.
 *
 * So this component owns exactly one thing the caller cannot get wrong: the
 * first child has no rule above it and every other child does. It does that by
 * cloning `divided` onto its children, which means the children must be
 * `ListRow`s (or anything else accepting `divided`) and must be direct children —
 * a `.map()` is fine, a wrapper `<View>` around them is not.
 *
 * On green, this is a translucent panel rather than a white card: a drop shadow
 * on House Green reads as dirt, and `Surface.onDarkFill` is the established way
 * to lift a surface off it.
 */

import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Card } from './card';
import { Gutter, Section } from './section';

import { Radius, Surface } from '@/theme';

type Props = {
   /** Given a title, the group renders a `SectionHeader` above itself. */
   title?: string;
   kicker?: string;
   action?: string;
   onAction?: () => void;
   tone?: 'light' | 'inverse';
   /** Off when the caller is already inside a `Gutter`. */
   gutter?: boolean;
   /** `ListRow`s. Direct children only — see the note above. */
   children: ReactNode;
   style?: StyleProp<ViewStyle>;
};

export function ListSection({
   title,
   kicker,
   action,
   onAction,
   tone = 'light',
   gutter = true,
   children,
   style,
}: Props) {
   const rows = Children.toArray(children)
      .filter(isValidElement)
      .map((child, index) =>
         cloneElement(child as ReactElement<{ divided?: boolean; tone?: 'light' | 'inverse' }>, {
            divided: index > 0,
            tone,
         }),
      );

   const panel =
      tone === 'inverse' ? (
         <View style={[styles.panel, styles.panelInverse, style]}>{rows}</View>
      ) : (
         <Card style={[styles.panel, style]}>{rows}</Card>
      );

   const body = gutter ? <Gutter>{panel}</Gutter> : panel;

   if (!title) return body;

   return (
      <Section title={title} kicker={kicker} action={action} onAction={onAction} tone={tone}>
         {body}
      </Section>
   );
}

const styles = StyleSheet.create({
   /**
    * Zero padding: the rows carry their own inset so a hairline can run the full
    * width of the panel. A padded container would leave the rule floating with a
    * gap at each end, which reads as a mistake rather than as a division.
    */
   panel: {
      padding: 0,
   },
   panelInverse: {
      backgroundColor: Surface.onDarkFill,
      borderRadius: Radius.xl,
   },
});
