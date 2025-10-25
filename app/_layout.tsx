import SafeScreen from "@/components/SafeScreen";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";



export default function RootLayout() {
  return (
    <SafeScreen>
      <StatusBar style="dark" />
      <KeyboardProvider>
        <Slot />
      </KeyboardProvider>
    </SafeScreen>
  )
}
