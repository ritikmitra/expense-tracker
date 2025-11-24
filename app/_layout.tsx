import SafeScreen from "@/components/SafeScreen";
import { ThemeProvider,DarkTheme,DefaultTheme, } from "@react-navigation/native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {useColorScheme} from "react-native"

export default function RootLayout() {

  const colorScheme = useColorScheme()
  
  return (
    <SafeScreen>
      <StatusBar style="dark" />
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <KeyboardProvider>
          <Slot />
        </KeyboardProvider>
      </ThemeProvider>
    </SafeScreen>
  )
}
