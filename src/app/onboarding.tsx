import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { ONBOARDING_FONTS } from '@/components/onboarding/fonts';
import { Palette } from '@/components/onboarding/theme';

export default function OnboardingScreen() {
  const [loaded] = useFonts(ONBOARDING_FONTS);

  return (
    <>
      <StatusBar style="dark" />
      {loaded ? (
        <OnboardingFlow />
      ) : (
        // Hold the flow's own background colour so there's no white flash
        // between the route transition and the fonts being ready.
        <View style={{ flex: 1, backgroundColor: Palette.cream }} />
      )}
    </>
  );
}
