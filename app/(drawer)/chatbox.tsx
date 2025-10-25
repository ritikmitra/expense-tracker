import ChatScreen from '@/components/chat/ChatScreen';
import { Message } from '@/components/chat/MessageBubble';
import useExpenseStore from '@/store/useExpenseStore';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const GreetingMessage = `
 👋 **Hello there!**  
Welcome back to your **Expense Tracker Assistant** 💰  

I'm here to help you manage your finances with ease.  
You can ask me things like:

- 💵 *"Add an expense for groceries"*  
- 📊 *"Show my total expenses this week"*  
- 🧾 *"List my health-related expenses"*  

Let's make tracking your spending simple and smart! 🚀
`;

export default function ChatBox() {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const { bottom, top } = useSafeAreaInsets()
    const { expenses } = useExpenseStore();
    const [sampleMessages, setSampleMessages] = useState<Message[]>([
        {
            id: '1',
            text: GreetingMessage,
            timestamp: new Date(Date.now() - 3600000),
            isSent: false,
        }
    ]);
    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

        return () => {
            showSubscription.remove();
            hideSubscription.remove()
        };
    }, []);

    const handleKeyboardShow = (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        setIsKeyboardVisible(true);
    };

    const handleKeyboardHide = (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        setIsKeyboardVisible(false);
    };

    const { height } = useWindowDimensions()

    const dyanmicKeyboardHeight = top + bottom + keyboardHeight
    const navigate = useNavigation();
    const [loading, setLoading] = useState(false);

    // Create animated values for each dot using refs so they stay stable across renders
    const dot1 = useRef(new Animated.Value(0));
    const dot2 = useRef(new Animated.Value(0));
    const dot3 = useRef(new Animated.Value(0));

    useEffect(() => {
        if (!loading) return;

        // capture current Animated.Value instances so the cleanup uses the same references
        const d1 = dot1.current;
        const d2 = dot2.current;
        const d3 = dot3.current;

        // animate the opacity for each dot when loading becomes true
        const sequence = Animated.sequence([
            Animated.timing(d1, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(d2, {
                toValue: 1,
                duration: 300,
                delay: 100,
                useNativeDriver: true,
            }),
            Animated.timing(d3, {
                toValue: 1,
                duration: 300,
                delay: 300,
                useNativeDriver: true,
            }),
        ]);

        sequence.start();

        // reset dots when loading becomes false
        return () => {
            d1.setValue(0);
            d2.setValue(0);
            d3.setValue(0);
            sequence.stop();
        };
    }, [loading]);

    

    const renderTypingIndicator = () => (
        <View style={styles.typingContainer}>
            <Text style={styles.typingText}>Bot is typing...</Text>
            <View style={styles.typingDots}>
                {/* Each dot is an Animated.View */}
                <Animated.View
                    style={[
                        styles.dot,
                        {
                            opacity: dot1.current,
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.dot,
                        {
                            opacity: dot2.current,
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.dot,
                        {
                            opacity: dot3.current,
                        },
                    ]}
                />
            </View>
        </View>
    );


    const dynamicStyles = StyleSheet.create({
        flexVala: {
            flex: 1,
        },
        height: {
            height: height - dyanmicKeyboardHeight
        }

    })


    return (
        <View style={[styles.container, isKeyboardVisible ? dynamicStyles.height : dynamicStyles.flexVala]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigate.goBack()}>
                    <MaterialIcons name="arrow-back-ios-new" size={22} color="#000" />
                </Pressable>
                <Text style={styles.headerText}>Ex AI</Text>
                {loading && renderTypingIndicator()}
            </View>
            <ChatScreen
                initialMessages={sampleMessages}
                setLoading={setLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',

    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 10,
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        backgroundColor: '#fff',
        maxWidth: '80%',
    },
    typingText: {
        fontSize: 14,
        color: '#888',
    },
    typingDots: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    dot: {
        width: 6,
        height: 6,
        backgroundColor: '#888',
        borderRadius: 3,
        marginHorizontal: 2,
    },
});
