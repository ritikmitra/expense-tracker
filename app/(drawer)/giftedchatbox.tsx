import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Bubble, GiftedChat, IMessage, MessageText, User } from 'react-native-gifted-chat';
import { View, Text, StyleSheet, Platform, Pressable ,Animated} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ChatInput from '@/components/chat/ChatInput';
import { useNavigation } from 'expo-router';
import Markdown from 'react-native-marked';

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

export default function GiftedChatUI() {
    const [messages, setMessages] = useState<IMessage[]>([]);
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


    const user: User = { _id: 1, name: 'You' };
    const bot: User = { _id: 2, name: 'Chat Assistant', avatar: 'https://placeimg.com/140/140/any' };

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
    }, []);

    // const onSend = useCallback((newMessages: IMessage[] = []) => {
    //     setMessages(prev => GiftedChat.append(prev, newMessages));
    //     console.log("data");


    //     // Simulated bot response
    //     if (newMessages[0].user._id === user._id) {
    //         setTimeout(() => {
    //             setMessages(prev =>
    //                 GiftedChat.append(prev, [
    //                     {
    //                         _id: prev.length + 1,
    //                         text: "Thanks for your message! This is a demo response.",
    //                         createdAt: new Date(),
    //                         user: bot,
    //                     },
    //                 ])
    //             );
    //         }, 1000);
    //     }
    // }, []);

    const handleSendText = (text: string) => {
        const newMessage: IMessage = {
            _id: messages.length + 1,
            text,
            createdAt: new Date(),
            user,
        };
        setMessages(prev => GiftedChat.append(prev, [newMessage]));

        setLoading(true)
        // Simulated bot response
        setTimeout(() => {
            const botMessage: IMessage = {
                _id: messages.length + 2,
                text: "Thanks for your message! This is a demo response.",
                createdAt: new Date(),
                user: bot,
            };
            setMessages(prev => GiftedChat.append(prev, [botMessage]));
            setLoading(false)
        }, 1000);
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

    const RenderAnimatedMessage = (props: any) => {

        const animation = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.timing(animation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }, []);

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
            }, []);

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
                // renderBubble={props => (
                //     <Bubble
                //         {...props}
                //         wrapperStyle={{
                //             left: { backgroundColor: '#fff', borderBottomLeftRadius: 4, marginVertical: 8 }, // bot bubble
                //             right: { backgroundColor: '#2563eb', borderBottomRightRadius: 4, marginVertical: 8 }, // user bubble
                //         }}
                //         textStyle={{
                //             left: { color: '#111827' },
                //             right: { color: '#fff' },
                //         }}
                //     />
                // )}
                renderBubble={RenderAnimatedBubble}
                renderInputToolbar={renderInputToolbar}
                bottomOffset={Platform.OS === 'ios' ? 0 : -25}
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
