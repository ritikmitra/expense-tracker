import SafeScreen from "@/components/SafeScreen";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <SafeScreen>
      <StatusBar style="dark" />
      <Slot />
    </SafeScreen>
  )
}
