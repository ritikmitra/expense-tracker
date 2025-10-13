import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawerContent from "./CustomDrawerContent";



export default function DrawerLayout() {

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        overlayColor: "#000000b7",
        drawerStyle : {
          width : "70%"
        }
      }}
    >
      {/* Keep your tabs as the main screen */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerShown: false, // Hide header since your tab screens handle it
          drawerItemStyle: { display: "none"  } // hides it from drawer list
        }}
      />
      {/* These routes can be opened from the custom drawer */}
      <Drawer.Screen name="settings" options={{ title: "Settings", headerShown: false }} />
      <Drawer.Screen name="about" options={{ title: "About" , headerShown : false , drawerStyle : {display : "none"} }} />
    </Drawer>
  );
}
