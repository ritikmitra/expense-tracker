import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "@/store/useAuthStore";
import { signOutFromGoogle } from "@/util/googleAuth";
import { DrawerActions } from "@react-navigation/native";
import { fallbacksIntialUrls } from "@/util/lib";


function settingsOutline({ color, size }: { color: string, size: number }) {
  return <Ionicons name="settings-outline" color={color} size={size} />
}
function informationCircleOutline({ color, size }: { color: string, size: number }) {
  return <Ionicons name="information-circle-outline" color={color} size={size} />
}
function chatBubbleEllipsesOutline({ color, size }: { color: string, size: number }) {
  return <Ionicons name="chatbubble-ellipses-outline" color={color} size={size} />
}

export default function CustomDrawerContent(props: Readonly<DrawerContentComponentProps>) {

  const { profile, user, logout } = useAuthStore()

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, backgroundColor: "#fff", borderRadius: 5, margin: 10 }}
    >
      {/* Profile Section */}
      <View
        style={{
          padding: 20,
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#eee"
        }}
      >
        <Image
          source={{ uri: user?.photoURL ?? fallbacksIntialUrls(profile?.firstName, profile?.lastName) }} // temporary avatar
          style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
        />
        <Text style={{ fontSize: 18, fontWeight: "600" }}>{profile?.firstName + " " + profile?.lastName}</Text>
        <Text style={{ fontSize: 14, color: "gray" }}>{profile?.email}</Text>
      </View>

      {/* Drawer Items */}
      <View style={{ paddingVertical: 10 }}>
        <DrawerItem
          key="settings"
          label="Settings"
          icon={settingsOutline}
          onPress={() => props.navigation.navigate("settings")}
        />
        <DrawerItem
          key="about"
          label="About"
          icon={informationCircleOutline}
          onPress={() => props.navigation.navigate("about")}
        />
        <DrawerItem
          key="chat"
          label="Chat"
          icon={chatBubbleEllipsesOutline}
          onPress={() => props.navigation.navigate("chat")}
        />
      </View>

      {/* Logout Section */}
      <View style={{ marginTop: "auto", padding: 10.5, borderTopWidth: 1, borderTopColor: "#eee" }}>
        <TouchableOpacity
          onPress={async () => { props.navigation.dispatch(DrawerActions.closeDrawer()); await signOutFromGoogle(); await logout() }}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons name="log-out-outline" size={22} color="red" />
          <Text style={{ marginLeft: 10, color: "red", fontWeight: "600" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}
