import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
  Keyboard,
} from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function ChatUI() {





  const { height } = useWindowDimensions()




  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! How can I help you today?", sender: 'other', timestamp: new Date(Date.now() - 3600000) },
    { id: 2, text: "Hi! I'm looking for some information.", sender: 'user', timestamp: new Date(Date.now() - 3500000) },
    { id: 3, text: "Of course! What would you like to know?", sender: 'other', timestamp: new Date(Date.now() - 3400000) }
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);



  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputText('');

      // Simulated bot response
      setTimeout(() => {
        const response = {
          id: messages.length + 2,
          text: "Thanks for your message! This is a demo response.",
          sender: 'other',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };





  return (
    <View style={[styles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <MaterialIcons name='verified-user' size={24} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Chat Assistant</Text>
            <Text style={styles.headerSubtitle}>Online</Text>
          </View>
        </View>
      </View>
      <KeyboardStickyView  >

      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={{ padding: 12,height : 80 }}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.sender === 'user' ? styles.userMessageWrapper : styles.otherMessageWrapper,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userBubble : styles.otherBubble,
              ]}
            >
              <Text style={message.sender === 'user' ? styles.userText : styles.otherText}>
                {message.text}
              </Text>
              <Text style={message.sender === 'user' ? styles.userTime : styles.otherTime}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.disabledButton]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <MaterialIcons name='send' size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardStickyView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f4f6',
    flex: 1
  },
  header: {
    backgroundColor: '#2a61d6ff',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1
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
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#bfdbfe',
    fontSize: 12,
  },
  messagesContainer: {
  },
  messageWrapper: {
    marginVertical: 6,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  otherMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  userBubble: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userText: {
    color: '#fff',
    fontSize: 14,
  },
  otherText: {
    color: '#111827',
    fontSize: 14,
  },
  userTime: {
    color: '#bfdbfe',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  otherTime: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 25,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
