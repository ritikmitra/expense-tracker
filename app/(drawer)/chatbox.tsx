import ChatScreen from '@/components/chat/ChatScreen';
import { Message } from '@/components/chat/MessageBubble';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';


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

    const sampleMessages: Message[] = [
        {
            id: '1',
            text: GreetingMessage,
            timestamp: new Date(Date.now() - 3600000),
            isSent: false,
        },
        {
            id: '2',
            text: GreetingMessage,
            timestamp: new Date(Date.now() - 3600000),
            isSent: true,
        },
    ];

    const handleSendMessage = (text: string) => {
        console.log('Message sent:', text);
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    };

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

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigate.goBack()}>
                    <MaterialIcons name="arrow-back-ios-new" size={22} color="#000" />
                </Pressable>
                <Text style={styles.headerText}>Ex AI</Text>
            </View>
            {loading && renderTypingIndicator()}
            <ChatScreen
                initialMessages={sampleMessages}
                onSendMessage={handleSendMessage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginVertical: 5,
        alignSelf: 'flex-start',
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
