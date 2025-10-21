import { useHeaderHeight } from '@react-navigation/elements';
import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import ChatInput from './ChatInput';
import MessageBubble, { Message } from './MessageBubble';


interface ChatScreenProps {
    initialMessages?: Message[];
    onSendMessage?: (text: string) => void;
}

export default function ChatScreen({ initialMessages = [], onSendMessage }: ChatScreenProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const flatListRef = useRef<FlatList>(null);
    const headerHeight = useHeaderHeight();

    const handleSend = (text: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            timestamp: new Date(),
            isSent: true,
            status: 'sent',
        };

        setMessages((prev) => [...prev, newMessage]);

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        if (onSendMessage) {
            onSendMessage(text);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={headerHeight}
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
