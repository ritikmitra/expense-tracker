import { View, Text, StyleSheet, Animated } from 'react-native';
import Markdown from 'react-native-marked';

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isSent: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface MessageBubbleProps {
  message: Message;
}

export const renderTypingIndicator = () => (
  <View style={styles.typingContainer}>
    <Text style={styles.typingText}>Bot is typing...</Text>
    <View style={styles.typingDots}>
      <Animated.View style={[styles.dot, { animationDelay: '0ms' }]} />
      <Animated.View style={[styles.dot, { animationDelay: '200ms' }]} />
      <Animated.View style={[styles.dot, { animationDelay: '400ms' }]} />
    </View>
  </View>
);

export default function MessageBubble({ message }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    const timestamp = new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return timestamp
  };


  return (
    <View
      style={[
        styles.container,
        message.isSent ? styles.sentContainer : styles.receivedContainer,
      ]}>
      <View
        style={[
          styles.bubble,
          message.isSent ? styles.sentBubble : styles.receivedBubble,
        ]}>
        {message.isSent ? <Text
          style={[
            styles.text,
            message.isSent ? styles.sentText : styles.receivedText,
          ]}>
          {message.text}
        </Text> : <Markdown value={message.text} />}
        <View style={styles.footer}>
          <Text
            style={[
              styles.time,
              message.isSent ? styles.sentTime : styles.receivedTime,
            ]}>
            {formatTime(message.timestamp)}
          </Text>
          {message.isSent && (
            <Text style={styles.checkmark}>
              {message.status === 'read' && '✓✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'sent' && '✓'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    marginHorizontal: 12,
  },
  sentContainer: {
    justifyContent: 'flex-end',
  },
  receivedContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    borderRadius: 12,
  },
  sentBubble: {
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  sentText: {
    color: '#000000',
  },
  receivedText: {
    color: '#000000',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  time: {
    fontSize: 11,
    marginRight: 4,
  },
  sentTime: {
    color: '#667781',
  },
  receivedTime: {
    color: '#8696A0',
  },
  checkmark: {
    fontSize: 11,
    color: '#667781',
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
