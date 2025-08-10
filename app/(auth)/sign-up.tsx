import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router';


type field = 'firstName' | 'lastName' | 'email' | 'password' | null;

const SignUp = () => {
    const router = useRouter();
    const [focusedInput, setFocusedInput] = useState<field>(null); // Track which field is focused

    const getInputStyle = (name : field) => ([
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

            <Text style={styles.text}>Create your account</Text>
            <Text style={{ fontSize: 16, color: '#666', marginTop: 10 }}>
                Please enter your details to create an account.
            </Text>

            {/* First Name */}
            <View style={{ marginTop: 20 }}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                    style={getInputStyle('firstName')}
                    onFocus={() => setFocusedInput('firstName')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>

            {/* Last Name */}
            <View style={{ marginTop: 20 }}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                    style={getInputStyle('lastName')}
                    onFocus={() => setFocusedInput('lastName')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>

            {/* Email */}
            <View style={{ marginTop: 20 }}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={getInputStyle('email')}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>

            {/* Password */}
            <View style={{ marginTop: 20 }}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={getInputStyle('password')}
                    secureTextEntry
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>

            {/* Password requirements */}
            <View style={{ flexDirection: 'column', gap: 5 }}>
                <Text style={{ color: 'gray' }}>alphanumeric characters</Text>
                <Text style={{ color: 'gray' }}>1 special character</Text>
                <Text style={{ color: 'gray' }}>more than 7 characters</Text>
                <Text style={{ color: 'gray' }}>at least 1 capital letter</Text>
            </View>

            {/* Create Account Button */}
            <TouchableOpacity style={styles.button}>
                <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>Create Account</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={{
                marginTop: 10,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
                <Text>Already have an account? <Link href="/(auth)/sign-in" style={{ color: 'blue' }}>Login</Link></Text>
            </View>
        </View>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingHorizontal: 25,
        gap: 15,
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 15,
        color: '#333',
        fontWeight: 'bold',
    },
    input: {
        padding: 10,
        marginTop: 5,
        backgroundColor: '#f8f8ff',
        borderRadius: 10,
        color: '#333',
        borderWidth: 1,
        borderColor: 'transparent', // Default border color
    },
    inputFocused: {
        borderColor: 'black', // Blue highlight on focus
    },
    button: {
        marginTop: 30,
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center',
    }
});
