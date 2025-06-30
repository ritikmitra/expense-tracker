import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';

const SignUp = () => {

    const router = useRouter();
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={()=>router.back()}>
                <MaterialIcons name='arrow-back-ios-new' size={24} style={{
                    marginBottom: 10
                }} />
            </TouchableOpacity>
            <Text style={styles.text}>Create your account</Text>
            <Text style={{ fontSize: 16, color: '#666', marginTop: 10 }}>
                Please enter your details to create an account.
            </Text>
            <View style={{
                marginTop: 20,
            }}>
                <Text style={{ fontSize: 15, color: '#333', fontWeight: 'bold' }}>First Name</Text>
                <TextInput
                    style={{
                        padding: 10,
                        marginTop: 5,
                        backgroundColor: '#f8f8ff',
                        borderRadius: 5,
                    }}
                />
            </View>
            <View style={{
                marginTop: 20,
            }}>
                <Text style={{ fontSize: 15, color: '#333', fontWeight: 'bold' }}>Last Name</Text>
                <TextInput
                    style={{
                        padding: 10,
                        marginTop: 5,
                        backgroundColor: '#f8f8ff',
                        borderRadius: 5,
                    }}
                />
            </View>
            <View style={{
                marginTop: 20,
            }}>
                <Text style={{ fontSize: 15, color: '#333', fontWeight: 'bold' }}>Email Address</Text>
                <TextInput
                    style={{
                        padding: 10,
                        marginTop: 5,
                        backgroundColor: '#f8f8ff',
                        borderRadius: 5,
                    }}
                />
            </View>
            <View style={{
                marginTop: 20,
            }}>
                <Text style={{ fontSize: 15, color: '#333', fontWeight: 'bold' }}>Password</Text>
                <TextInput
                    style={{
                        padding: 10,
                        marginTop: 5,
                        backgroundColor: '#f8f8ff',
                        borderRadius: 5,
                    }}
                    secureTextEntry
                />
            </View>
            <View style={{
                flexDirection: 'column',
                gap: 5,
            }}>
                <Text style={{
                    color: 'gray',
                }}>alphanumeric characters </Text>
                <Text style={{ color: 'gray' }} >1 special character</Text>
                <Text style={{ color: 'gray' }}>more than 7 characters</Text>
                <Text style={{ color: 'gray' }}>atleast 1 capital letter</Text>
            </View>
            <TouchableOpacity style={{
                marginTop: 30,
                backgroundColor: 'black',
                padding: 15,
                borderRadius: 10,
                elevation: 5,
                alignItems: 'center',
            }}>
                <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>Create Account</Text>
            </TouchableOpacity>
            <View style={{
                marginTop: 10,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
                <Text>Already have an account? <Text style={{ color: 'blue' }}>Login</Text></Text>
            </View>
        </View>
    )
}

export default SignUp


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingHorizontal : 25,
        gap: 15,
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
    },
})