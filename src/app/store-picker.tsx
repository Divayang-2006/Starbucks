/**
 * Gate one — the launch screen, behind the `!store` guard in `_layout.tsx`.
 *
 * Thin on purpose: the screen itself is `@/components/store-picker/StorePicker`,
 * because `/change-store` renders exactly the same thing in `change` mode and a
 * route file is the wrong place for a body two routes share.
 */

import { StorePicker } from '@/components/store-picker/StorePicker';

export default function StorePickerScreen() {
   return <StorePicker mode="gate" />;
}
