import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import axios from 'axios';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useExpenseStore from '@/store/useExpenseStore';
import { useNavigation } from 'expo-router';
import Markdown from "react-native-marked";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const Chat = () => {
  const { expenses } = useExpenseStore();
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const navigate = useNavigation()

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

  useEffect(() => {

    if (messages.length > 1) return

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, text: GreetingMessage, sender: 'bot', timestamp: timestamp },
    ]);

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, text: GreetingMessage, sender: 'user', timestamp: timestamp },
    ]);

  }, [GreetingMessage])


  const sendMessage = async (text: string) => {
    setLoading(true);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

      console.log(botMessage);


      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: botMessage, sender: 'bot', timestamp },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: 'Oops! Something went wrong.', sender: 'bot', timestamp },
      ]);
    }
    setLoading(false);
  };

  const handleSend = () => {
    if (userInput.trim()) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: userInput, sender: 'user', timestamp },
      ]);
      sendMessage(userInput);
      setUserInput('');
    }
  };

  const renderTypingIndicator = () => (
    <View style={styles.typingContainer}>
      <Text style={styles.typingText}>Bot is typing...</Text>
      <View style={styles.typingDots}>
        <Animated.View style={[styles.dot, { animationDelay: '0ms' }]} />
        <Animated.View style={[styles.dot, { animationDelay: '200ms' }]} />
        <Animated.View style={[styles.dot, { animationDelay: '400ms' }]} />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => navigate.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={30} />
            </Pressable>
            <Text style={styles.headerText}>Home</Text>
          </View>

          {/* Messages List */}
          <FlatList
            ref={flatListRef}
            data={messages.slice().reverse()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Animated.View entering={FadeInUp.duration(300)} style={[
                styles.messageContainer,
                item.sender === 'user' ? styles.userMessage : styles.botMessage,
              ]}>
                {/* <Text style={[styles.messageText, item.sender === 'user' ? styles.userMessageText : styles.botMessageText]}>{item.text}</Text> */}
                {item.sender === 'bot' ? (
                  <Markdown value={item.text} />
                ) : (
                  <Text style={[styles.messageText, styles.userMessageText]}>
                    {item.text}
                  </Text>
                )}
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </Animated.View>
            )}
            inverted
            contentContainerStyle={styles.messageList}
            keyboardShouldPersistTaps="handled"
          />

          {/* Loading Indicator */}
          {loading && renderTypingIndicator()}

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Type your message..."
              placeholderTextColor="#888"
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <Pressable
              onPress={handleSend}
              style={({ pressed }) => [
                styles.sendButton,
                pressed && styles.sendButtonPressed,
              ]}
            >
              <MaterialCommunityIcons
                name={userInput.trim() ? 'send' : 'send-circle-outline'}
                size={30}
                color={userInput.trim() ? '#007AFF' : '#888'}
              />
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef0f3ff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  messageContainer: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 15,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: '#293bdaff',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  botMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#fff"
  },
  botMessageText: {
    color: "#000"
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 25,
  },
  sendButtonPressed: {
    backgroundColor: 'rgba(0,0,0,0.1)',
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

export default Chat;

