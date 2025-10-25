import { useHeaderHeight } from '@react-navigation/elements';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import ChatInput from './ChatInput';
import MessageBubble, { Message } from './MessageBubble';
import axios from 'axios';
import useExpenseStore from '@/store/useExpenseStore';


interface ChatScreenProps {
    initialMessages?: Message[];
    onSendMessage?: (text: string) => void;
    setLoading: (value: boolean) => void;
}

export default function ChatScreen({ initialMessages = [], onSendMessage, setLoading }: ChatScreenProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const flatListRef = useRef<FlatList>(null);
    const headerHeight = useHeaderHeight();
    const { expenses } = useExpenseStore();

    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

        return () => {
            showSubscription.remove();
            hideSubscription.remove()
        };
    }, []);

    const handleKeyboardShow = (event: any) => {

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true })
        }, 100)

        setIsKeyboardVisible(true);
    };

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
    }, [])

    const handleKeyboardHide = (event: any) => {
        setIsKeyboardVisible(false);
    };

    const handleSend = (text: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            timestamp: new Date(),
            isSent: true,
            status: 'sent',
        };

        setMessages((prev) => [...prev, newMessage]);
        sendMessage(text)
    };

    const sendMessage = async (text: string) => {
        setLoading(true);
        try {
            const context = `
        User's expenses: ${JSON.stringify(expenses)}.
        Please answer the following query in markdown format, using clear lists and bold labels.
        Query:`;

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

            console.log(botMessage);

            // Add bot message to the chat
            setMessages((prev) => [
                ...prev,
                { id: Date.now().toString(), text: botMessage, timestamp: new Date(), isSent: false },
            ]);

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => [
                ...prev,
                { id: Date.now().toString(), text: 'Oops! Something went wrong.', timestamp: new Date(), isSent: false },
            ]);
        }
        flatListRef.current?.scrollToEnd({ animated: false })

        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={headerHeight}
            enabled={isKeyboardVisible}
        >
            <View style={styles.messagesContainer}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <MessageBubble message={item} />}
                    contentContainerStyle={styles.messagesList}
                    showsVerticalScrollIndicator
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                />
            </View>
            <ChatInput onSend={handleSend} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5DDD5',
    },
    keyboardView: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesList: {
        paddingVertical: 5,
    },
});
