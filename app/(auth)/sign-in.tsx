import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type field = 'email' | null;

const SignIn = () => {

    const router = useRouter();
    const [focusedInput, setFocusedInput] = useState<field>(null); // Track which field is focused

    const getInputStyle = (name: field) => ([
        styles.input,
        focusedInput === name && styles.inputFocused // Apply highlight if focused
    ]);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()}>
                <MaterialIcons name='arrow-back-ios-new' size={24} style={{
                    marginBottom: 10,
                    transform: [{ translateX: -10 }]
                }} />
            </TouchableOpacity>
            <View>
                <Text style={styles.text}>Hello ! Good Morning</Text>
                <Text style={{ fontSize: 16, color: '#666', marginTop: 10 }}>It is great to be have here</Text>
            </View>
            <View style={{
                marginTop: 20,
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 10,
            }}>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    borderRadius: 20,
                    backgroundColor: '#f8f8ff',
                    padding: 10,
                }}>
                    <Image source={require("@/assets/images/icons8-google.svg")} style={{
                        width: 30,
                        height: 30,
                    }} />
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#333',
                    }} >Sign in with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f8ff',
                    gap: 10,
                    borderRadius: 20,
                    padding: 10,
                }}>
                    <Image source={require("@/assets/images/icons8-facebook.svg")} style={{
                        width: 30,
                        height: 30,
                    }} />
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#333',
                    }}>Sign in with Facebook</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                <View>
                    <Text style={{ width: 50, textAlign: 'center' }}>or</Text>
                </View>
                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            </View>
            <View style={{
                marginTop: 20,
            }}>
                <Text style={{ fontSize: 15, color: '#333', fontWeight: 'bold' }}>Email Address</Text>
                <TextInput
                    style={getInputStyle('email')}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>
            <TouchableOpacity style={{
                backgroundColor: 'black',
                padding: 15,
                borderRadius: 10,
                elevation: 5,
                alignItems: 'center',
            }}>
                <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingHorizontal: 25,
        gap: 35,
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        color: "#333",
    },
    input: {
        padding: 10,
        marginTop: 5,
        backgroundColor: '#f8f8ff',
        borderRadius: 5,
    },
    inputFocused: {
        borderColor: 'black', // Blue highlight on focus
    },
})

export default SignIn;