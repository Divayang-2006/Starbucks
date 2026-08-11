import * as Haptics from 'expo-haptics';

/**
 * Haptics reject on web and on iOS devices with the Taptic Engine disabled.
 * Nothing here is worth surfacing to the user, so swallow it.
 */
export function tapFeedback() {
  Haptics.selectionAsync().catch(() => {});
}

export function landFeedback() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

/**
 * Notification haptics, not impact ones. The OS gives these a distinct
 * two-beat rhythm that reads as a verdict rather than a tap — which is exactly
 * what the OTP is delivering.
 */
export function passFeedback() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function rejectFeedback() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
}
