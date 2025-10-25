import useAuthStore from "@/store/useAuthStore";
import { signInWithGoogle as googleSignIn } from "@/util/googleAuth";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useGithubAuth } from "@/util/githubAuth";
import { currentGreeting } from "@/util/lib";

type field = 'email' | 'password' | null;

const SignIn = () => {

    const router = useRouter();
    const [focusedInput, setFocusedInput] = useState<field>(null); // Track which field is focused
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const login = useAuthStore((state) => state.login);
    const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);

    const { isLoading, promptAsync } = useGithubAuth();

    const handleSignIn = async () => {
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }
        try {
            setError(null);
            await login(email, password);
            router.replace("/(drawer)/(tabs)");
        } catch (err: any) {
            if (err instanceof FirebaseError) {
                if (err.code === 'auth/user-not-found') {
                    setError("No user found with this email.");
                    return;
                }
            }

            setError(err.message || "Something went wrong");
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            setIsGoogleLoading(true);
            setError(null);

            // Use native Google Sign-In
            const result = await googleSignIn();

            if (result && result.idToken) {
                // Sign in with Firebase using the ID token
                await signInWithGoogle(result.idToken);
                router.replace("/(drawer)/(tabs)");
            } else {
                throw new Error('Failed to get ID token from Google');
            }
        } catch (err: any) {
            console.error('Google sign-in error:', err);
            setError(err.message || "Google sign-in failed");
            Alert.alert('Error', 'Google sign-in failed. Please try again.');
        } finally {
            setIsGoogleLoading(false);
        }
    }

    const getInputStyle = (name: field) => ([
        styles.input,
        focusedInput === name && styles.inputFocused // Apply highlight if focused
    ]);


    return (
        <View
            style={styles.container}
        >
            <View>
                <Text style={styles.text}>Hello {currentGreeting()}</Text>
                <Text style={{ fontSize: 16, color: '#666', marginTop: 10 }}>It is great to be have here</Text>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
            <View style={{ flexDirection : "column",gap : 10}}>
                <Text style={{ fontSize: 15, color: '#333', fontWeight: 'bold' }}>Email Address</Text>
                <TextInput
                    style={getInputStyle('email')}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            
                <Text style={{ fontSize: 15, color: '#333', fontWeight: 'bold' }}>Password</Text>
                <TextInput
                    style={getInputStyle('password')}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    keyboardType="default"
                />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                <View>
                    <Text style={{ width: 50, textAlign: 'center' }}>or</Text>
                </View>
                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            </View>

            <View style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 10,
            }}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        borderRadius: 20,
                        backgroundColor: '#f8f8ff',
                        padding: 10,
                        opacity: isGoogleLoading ? 0.6 : 1,
                    }}
                    onPress={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                >
                    <Image source={require("@/assets/images/icons8-google.svg")} style={{
                        width: 30,
                        height: 30,
                    }} />
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#333',
                    }} >
                        {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f8ff',
                    gap: 10,
                    borderRadius: 20,
                    padding: 10,
                }}
                    onPress={() => promptAsync({ windowName: "Expense Tracker" })}
                >
                    <AntDesign name="github" size={29} color="black" />
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#333',
                    }}>{isLoading ? 'Signing in...' : 'Sign in with Github'}</Text>
                </TouchableOpacity>
            </View>


            <TouchableOpacity style={{
                backgroundColor: 'black',
                padding: 15,
                borderRadius: 10,
                elevation: 5,
                alignItems: 'center',
            }} onPress={handleSignIn}>
                <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>Continue</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, color: '#333', fontWeight: 'bold' }}>Don&apos;t have an account? </Text>
                <Link href="/sign-up">
                    <Text style={{ fontSize: 16, color: 'blue', fontWeight: 'bold' }}>Sign up</Text>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        gap: 30,
        backgroundColor: '#fff',
        justifyContent: 'space-evenly',
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
        color: '#333',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputFocused: {
        borderColor: 'black', // Blue highlight on focus
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 10,
        borderRadius: 5,
        borderLeftWidth: 4,
        borderLeftColor: '#f44336',
    },
    errorText: {
        color: '#c62828',
        fontSize: 14,
    },
})

export default SignIn;