/**
 * The n-up figure strip: Stars · Rewards · Pay in the Home header, and whatever
 * the Account and order-detail screens end up counting.
 *
 * Split into a cell and a strip because the rules between the cells are the
 * fiddly part — equal-width cells with a hairline that does not touch either
 * edge, drawn on green where the hairline has to be the on-dark token. Home had
 * that written out with a `statDivider` view interleaved by hand.
 *
 * Value over label, not label over value. The number is what the strip is for;
 * the caps label underneath is a caption on it. Reversing them makes the strip
 * read as a form.
 */

import {
   Children,
   cloneElement,
   Fragment,
   isValidElement,
   type ReactElement,
   type ReactNode,
} from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Divider } from './divider';
import { CapsKicker } from './screen-header';

import { Space, TextColor, TextStyles } from '@/theme';

type StatProps = {
   label: string;
   value: string;
   tone?: 'light' | 'inverse';
};

export function Stat({ label, value, tone = 'light' }: StatProps) {
   const inverse = tone === 'inverse';

   return (
      <View style={styles.stat}>
         <Text
            style={[styles.value, inverse && styles.valueInverse]}
            numberOfLines={1}
            maxFontSizeMultiplier={1.2}
         >
            {value}
         </Text>
         <Text style={[styles.label, inverse && styles.labelInverse]} numberOfLines={1}>
            {label}
         </Text>
      </View>
   );
}

type StripProps = {
   /** `Stat` cells, direct children only — the tone and the rules are applied to them. */
   children: ReactNode;
   tone?: 'light' | 'inverse';
   style?: StyleProp<ViewStyle>;
};

export function StatStrip({ children, tone = 'light', style }: StripProps) {
   /**
    * The strip carries the tone for its cells, the way `ListSection` carries
    * `divided` for its rows. Setting it per cell means three chances to set it
    * wrong and one strip with a white figure between two green ones.
    */
   const cells = Children.toArray(children)
      .filter(isValidElement)
      .map((cell) => cloneElement(cell as ReactElement<{ tone?: 'light' | 'inverse' }>, { tone }));

   return (
      <View style={[styles.strip, style]}>
         {cells.map((cell, index) => (
            /**
             * Keyed by index because the caller's cells have no stable identity
             * and the list is fixed at author time — a stat strip is never
             * reordered or filtered at runtime.
             */
            <Fragment key={index}>
               {index > 0 ? (
                  <Divider
                     tone={tone}
                     orientation="vertical"
                     length={RULE_LENGTH}
                     style={styles.rule}
                  />
               ) : null}
               {cell}
            </Fragment>
         ))}
      </View>
   );
}

/**
 * Short of the cell height on purpose. A full-height rule turns three figures
 * into a table; this one just separates them.
 */
const RULE_LENGTH = 34;

const styles = StyleSheet.create({
   strip: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   rule: {
      marginHorizontal: Space.md,
   },
   stat: {
      flex: 1,
      gap: Space.xxs,
   },
   value: {
      ...TextStyles.h2,
      color: TextColor.primary,
   },
   valueInverse: {
      color: TextColor.onDark,
   },
   label: {
      ...CapsKicker,
      color: TextColor.secondary,
   },
   labelInverse: {
      color: TextColor.onDarkMuted,
   },
});
