import * as Haptics from 'expo-haptics';

/**
 * Named for the two events this screen has rather than for the taptic styles,
 * so the call sites read as intent. Haptics reject on web and on devices with
 * the engine disabled; none of that is worth surfacing, so it is swallowed.
 */

/** Landing on a pin — a light tick, because you might tap five of them. */
export function pinFeedback() {
   Haptics.selectionAsync().catch(() => {});
}

/**
 * Committing to a store. A success notification rather than an impact: the OS
 * gives these a two-beat rhythm that reads as a decision being accepted, which
 * is exactly what clearing the gate is.
 */
export function commitFeedback() {
   Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
