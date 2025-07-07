import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/Color'; // Adjust the import path as necessary

const Insights = () => {
  const insightsData = [
    { title: 'User Activity', value: '2,150', description: 'Active users in the last 7 days' },
    { title: 'Sales', value: '$14,300', description: 'Total sales this month' },
    { title: 'Retention Rate', value: '88%', description: 'Retention rate in the past 30 days' },
    { title: 'Website Traffic', value: '10,000+', description: 'Website visits this week' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Insights Dashboard</Text>

      {insightsData.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View More Insights</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.dark.background,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 24,
    color: '#2d2d2d',
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#6c6c6c',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Insights;
