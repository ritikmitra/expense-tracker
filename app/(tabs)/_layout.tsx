import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    View,
    StyleSheet,
    Pressable,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function CustomTabBar({ state, descriptors, navigation }: any) {

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    let iconName: any = "circle-outline";
                    switch (route.name) {
                        case "index":
                            iconName = "plus";
                            break;
                        case "create":
                            iconName = isFocused ? "home" : "home-outline";
                            break;
                        case "insights":
                            iconName = isFocused ? "chart-box" : "chart-box-outline";
                            break;
                    }

                    const isHome = route.name === "index";

                    return (
                        <Pressable
                            key={route.key}
                            onPress={onPress}
                            style={[styles.tabButton, isHome && styles.homeButton]}
                        >
                            {isHome ? (
                                <View style={styles.homeIconContainer}>
                                    <LinearGradient
                                        colors={["black", "gray"]}
                                        style={styles.gradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <MaterialCommunityIcons
                                            name={iconName}
                                            size={32}
                                            color="#ffffff"
                                        />
                                    </LinearGradient>
                                </View>
                            ) : (
                                <View
                                    style={isFocused ? styles.activeIcon : styles.inactiveIcon}
                                >
                                    <MaterialCommunityIcons
                                        name={iconName}
                                        size={28}
                                        color={isFocused ? "#0AA87E" : "#666666"}
                                        style={{ opacity: isFocused ? 1 : 0.7 }}
                                    />
                                </View>
                            )}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#e5e5e5",
    },
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 80,
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === "ios" ? 10 : 2,
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        marginHorizontal: 8,
    },
    homeButton: {
        marginTop: -40,
    },
    homeIconContainer: {
        width: 68,
        height: 68,
        borderRadius: 34,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        overflow: "hidden",
    },
    gradient: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    inactiveIcon: {
        alignItems: "center",
        justifyContent: "center",
        height: 48,
        width: 48,
        borderRadius: 34,
    },
    activeIcon: {
        alignItems: "center",
        justifyContent: "center",
        height: 48,
        width: 48,
        borderRadius: 64,
        backgroundColor: "rgba(10, 168, 126, 0.1)",
    },
});

export default function TabLayout() {


    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            <Tabs.Screen
                name="create"
                options={{
                    title: "Profile",
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                }}
            />
            <Tabs.Screen
                name="insights"
                options={{
                    title: "Invites",
                }}
            />
        </Tabs>
    );
}
