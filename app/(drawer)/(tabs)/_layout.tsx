import { useRouter, Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    View,
    StyleSheet,
    Pressable,
    Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import AddExpenseModal from "./create";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import SplashScreen from "@/components/SplashScreen";
import useAuthStore from "@/store/useAuthStore";
import { StatusBar } from "expo-status-bar";

function CustomTabBar({ state, descriptors, navigation, onCreatePress }: any) {
    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {state.routes.map((route: any, index: number) => {
                    const isFocused = state.index === index;

                    const onPress = () => {
                        if (route.name === "create") {
                            onCreatePress?.(); // 🔥 trigger modal instead of navigating
                            return;
                        }

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
                        case "create":
                            iconName = "plus";
                            break;
                        case "index":
                            iconName = isFocused ? "home" : "home-outline";
                            break;
                        case "insights":
                            iconName = isFocused ? "chart-box" : "chart-box-outline";
                            break;
                    }

                    const isHome = route.name === "create";

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
                                        color={isFocused ? "#000000ff" : "#666666"}
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



// 👇 This is your actual layout function
export default function TabLayout() {
    const [modalVisible, setModalVisible] = useState(false);

    const { initAuth, user, loading } = useAuthStore();

    useEffect(() => {
        initAuth(); // 👈 subscribe to Firebase Auth
    }, [initAuth]);

    if (loading) return <SplashScreen />; // Show splash while Firebase checks auth
    if (!user) return <SplashScreen />; // Or redirect to login if user is null


    return (
        <BottomSheetModalProvider>
            
            <Tabs
                screenOptions={{
                    headerShown: false,
                }}
                tabBar={(props) => (
                    <CustomTabBar {...props} onCreatePress={() => setModalVisible(true)} />
                )}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                    }}
                />
                <Tabs.Screen
                    name="create"
                    options={{
                        title: "create",
                    }}
                />
                <Tabs.Screen
                    name="insights"
                    options={{
                        title: "insights",
                    }}
                />
            </Tabs>

            {/* 🔥 Modal triggered by 'create' tab */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={modalOverlayStyles.modalOverlay}>
                    {/* <View style={modalOverlayStyles.modalContent}>
                        <Text style={{ fontSize: 18 }}>This is your modal!</Text>
                        <Pressable onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
                            <Text style={{ color: "blue" }}>Close</Text>
                        </Pressable>
                    </View> */}
                    <AddExpenseModal setModalVisible={setModalVisible} />
                </View>
            </Modal>
        </BottomSheetModalProvider>
    );
}

const modalOverlayStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: 300,
        padding: 24,
        backgroundColor: "white",
        borderRadius: 12,
        alignItems: "center",
    },
});


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
        borderRadius: 50,
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
        backgroundColor: "rgba(39, 43, 42, 0.1)",
    },
});