import { View, Text, StyleSheet, Pressable, ScrollView, StyleProp, TextStyle } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { Switch } from 'react-native-switch';

const Settings = () => {
  const navigation = useNavigation();
  const [notification, setNotification] = useState(false);
  const [theme, setTheme] = useState(false);
  const [haptics, setHaptics] = useState(false);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios-new" size={22} color="#000" />
        </Pressable>
        <Text style={styles.header}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* SECTION: GENERAL */}
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.card}>
          <SettingItem
            icon={notification ? "notifications" : "notifications-none"}
            label="Notifications"
            value={notification}
            onValueChange={setNotification}
          />
          <Separator />
          <SettingItem
            icon={theme ? "light-mode" : "dark-mode"}
            label="Dark Theme"
            value={theme}
            onValueChange={setTheme}
          />
        </View>

        {/* SECTION: FEEDBACK */}
        <Text style={styles.sectionTitle}>Experience</Text>
        <View style={styles.card}>
          <SettingItem
            icon="vibration"
            iconStyle={{ transform: [{ rotate: "45deg" }] }}
            label="Haptics"
            value={haptics}
            onValueChange={setHaptics}
          />
        </View>
      </ScrollView>
    </View>
  );
};

// ✅ Reusable Setting Item
const SettingItem = ({ icon, label, value, onValueChange, iconStyle } : {icon : any, label : string, value : boolean,onValueChange :  ((value: boolean) => void) | undefined , iconStyle? : StyleProp<TextStyle>}  ) => (
  <Pressable android_ripple={{ color: '#eee' }} style={styles.item}>
    <View style={styles.leftContent}>
      <MaterialIcons name={icon} size={26} color="#333" style={iconStyle} />
      <Text style={styles.itemText}>{label}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      circleSize={25}
      barHeight={28}
      backgroundActive="#4A3AFF"
      backgroundInactive="#D1D1D6"
      circleBorderWidth={0}
      renderActiveText={false}
      renderInActiveText={false}
      switchLeftPx={2.5}
      switchRightPx={2.5}
      switchWidthMultiplier={2}
      circleActiveColor="#ffffff"
      circleInActiveColor="#ffffff"
    />
  </Pressable>
);

// ✅ Divider between settings
const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7", // light gray background like iOS
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
  },
  sectionTitle: {
    fontSize: 14,
    color: "#6e6e73",
    marginTop: 25,
    marginBottom: 8,
    marginHorizontal: 20,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 15,
    overflow: "hidden",
    // iOS-style shadow
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: 17,
    marginLeft: 12,
    color: "#1c1c1e",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e5e5ea",
    marginLeft: 55,
  },
});

export default Settings;
