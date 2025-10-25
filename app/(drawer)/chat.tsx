import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bubble, GiftedChat, IMessage, MessageText, User } from 'react-native-gifted-chat';
import { View, Text, StyleSheet, Platform, Pressable, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ChatInput from '@/components/chat/ChatInput';
import { useNavigation } from 'expo-router';
import Markdown from 'react-native-marked';
import axios from 'axios';
import useExpenseStore from '@/store/useExpenseStore';
import { generateUniqueId } from '@/util/lib';
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

export default function Chat() {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const navigate = useNavigation();
    const [loading, setLoading] = useState(false);
    const { expenses } = useExpenseStore();
    const { bottom } = useSafeAreaInsets()

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


    const user: User = { _id: 1, name: 'You' };
    const bot: User = useMemo<User>(() => ({ _id: 2, name: 'Chat Assistant', avatar: 'https://placeimg.com/140/140/any' }), []);

    useEffect(() => {
        // Initial messages
        setMessages([
            {
                _id: 1,
                text: GreetingMessage,
                createdAt: new Date(Date.now() - 3600000),
                user: bot,
            },

        ]);
    }, [bot]);

    const handleSendText = async (text: string) => {
        const newMessage: IMessage = {
            _id: generateUniqueId(),
            text,
            createdAt: new Date(),
            user,
        };
        setMessages(prev => GiftedChat.append(prev, [newMessage]));

        setLoading(true)

        try {
            const context = `
        User's expenses: ${JSON.stringify(expenses)}.
        Please answer the following query in markdown format, using clear lists and bold labels.
        Query:`;
            console.log(expenses);

            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_GEMINI_MODEL_URL}`,
                {
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: context + '\n\n' + text }],
                        },
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': `${process.env.EXPO_PUBLIC_GEMINI_PUBLIC_KEY}`
                    },
                }
            );

            const botMessage = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Sorry, I didn't quite understand that.";

            const botResponse: IMessage = {
                _id: generateUniqueId(), text: botMessage, createdAt: new Date(), user: bot
            }
            setMessages(prev => GiftedChat.append(prev, [botResponse]));
        } catch (error) {
            console.error('Error sending message:', error);
            const errorResponse: IMessage = {
                _id: generateUniqueId(), text: `Oops! Something went wrong. ${error}`, createdAt: new Date(), user: bot
            }
            setMessages(prev => GiftedChat.append(prev, [errorResponse]));
        } finally {
            setLoading(false)
        }
        // Simulated bot response
        // setTimeout(() => {
        //     const botMessage: IMessage = {
        //         _id: messages.length + 2,
        //         text: "Thanks for your message! This is a demo response.",
        //         createdAt: new Date(),
        //         user: bot,
        //     };
        //     setMessages(prev => GiftedChat.append(prev, [botMessage]));
        //     setLoading(false)
        // }, 1000);
    };

    const renderInputToolbar = (props: any) => (
        <ChatInput
            onSend={handleSendText}
            placeholder="Type a message..."
        />
    );


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


    const renderMessageText = (props: any) => {
        const { currentMessage } = props;

        const isBot = currentMessage.user._id === 2

        return (
            isBot ?
                <View style={{ paddingHorizontal: 10 }}>
                    <Markdown value={currentMessage.text} />
                </View> : <MessageText currentMessage={currentMessage} textStyle={{ left: { color: "#fff" } }} />
        );
    };

    const AnimatedView = Animated.createAnimatedComponent(View);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const RenderAnimatedMessage = (props: any) => {

        const animation = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.timing(animation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }, [animation]);

        const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0], // slide up from below
        });


        return (
            <AnimatedView
                style={{
                    opacity: animation,
                    transform: [{ translateY }],
                }}
            >
                <Bubble
                    {...props}
                    wrapperStyle={{
                        left: { backgroundColor: '#fff', borderBottomLeftRadius: 4, marginVertical: 8 },
                        right: { backgroundColor: '#2563eb', borderBottomRightRadius: 4, marginVertical: 8 },
                    }}
                    textStyle={{
                        left: { color: '#111827' },
                        right: { color: '#fff' },
                    }}
                />
            </AnimatedView>
        );
    };

    const RenderAnimatedBubble = (props: any) => {
        const animation = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.spring(animation, {
                toValue: 1,
                friction: 6,
                tension: 70,
                useNativeDriver: true,
            }).start();
        }, [animation]);

        const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0], // slides up from below
        });

        const scale = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1], // slightly “pops” into place
        });

        return (
            <Animated.View
                style={{
                    transform: [{ translateY }, { scale }],
                }}
            >
                <Bubble
                    {...props}
                    wrapperStyle={{
                        left: { backgroundColor: '#fff', borderBottomLeftRadius: 4, marginVertical: 8 },
                        right: { backgroundColor: '#2563eb', borderBottomRightRadius: 4, marginVertical: 8 },
                    }}
                    textStyle={{
                        left: { color: '#111827' },
                        right: { color: '#fff' },
                    }}
                />
            </Animated.View>
        );
    };


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigate.goBack()}>
                    <MaterialIcons name="arrow-back-ios-new" size={22} color="#000" />
                </Pressable>
                <Text style={styles.headerText}>Ex AI</Text>
                {loading && renderTypingIndicator()}
            </View>

            {/* Gifted Chat */}
            <GiftedChat
                messages={messages}
                user={user}
                placeholder="Type a message..."
                showAvatarForEveryMessage={false}
                renderAvatar={() => null}
                renderBubble={RenderAnimatedBubble}
                renderInputToolbar={renderInputToolbar}
                bottomOffset={Platform.OS === 'ios' ? 0 : -bottom}
                keyboardShouldPersistTaps='handled'
                renderMessageText={renderMessageText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ccc' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 1,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        backgroundColor: '#3b82f6',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
    headerSubtitle: { color: '#bfdbfe', fontSize: 12 },
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
    markdownContainer: {
        maxWidth: '80%',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginVertical: 6,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#2563eb',
        borderBottomRightRadius: 4,
    },
    botBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
    },
});
