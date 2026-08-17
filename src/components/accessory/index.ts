/**
 * Chrome that lives above the tab bar rather than inside a tab.
 *
 * Its own folder, not `chrome/`, because the distinction is a lifecycle one and
 * worth keeping visible: everything in `chrome/` is mounted by a screen and dies
 * with it, everything here is mounted by the tab controller and outlives every
 * screen. A component cannot be moved between the two folders without changing
 * what it is allowed to assume — nothing here may hold state, because iOS
 * renders each accessory twice, once per placement.
 */

export { SessionStrip } from './session-strip';
