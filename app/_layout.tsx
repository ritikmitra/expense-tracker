import SafeScreen from "@/components/SafeScreen";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";


export default function RootLayout() {
 const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

    if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }


  return (
    <SafeScreen>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeScreen>
  )
}
