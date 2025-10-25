import useExpenseStore from '@/store/useExpenseStore';
import { getDeviceCurrencySymbol } from '@/util/lib';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { categories } from '../../(modal)/CategoryModal';



const completeionBar = (percent: number) => {

  let bgColor;

  if (percent < 10) {
    // Very light red
    bgColor = "rgb(255, 204, 204)";
  } else if (percent < 20) {
    // Light red
    bgColor = "rgb(255, 178, 178)";
  } else if (percent < 30) {
    // Soft red-orange
    bgColor = "rgb(255, 153, 153)";
  } else if (percent < 40) {
    // Light orange-red
    bgColor = "rgb(255, 178, 128)";
  } else if (percent < 50) {
    // Light orange
    bgColor = "rgb(255, 204, 153)";
  } else if (percent < 60) {
    // Pale orange-yellow
    bgColor = "rgb(255, 229, 180)";
  } else if (percent < 70) {
    // Light yellow-green
    bgColor = "rgb(204, 255, 153)";
  } else if (percent < 80) {
    // Soft green
    bgColor = "rgb(178, 255, 178)";
  } else if (percent < 90) {
    // Light green
    bgColor = "rgb(153, 255, 153)";
  } else {
    // Very light green
    bgColor = "rgb(204, 255, 204)";
  }

  return (
    <View style={{ height: 5, width: '100%', backgroundColor: '#e0e0e0', borderRadius: 5 }}>
      <View style={{ height: '100%', width: `${percent}%`, backgroundColor: bgColor, borderRadius: 5 }} />
    </View>
  );
}


const Insights = () => {

  const [activeFilter, setActiveFilter] = useState('This Month')

  const filters = ['This Month', "Year"]

  const expenses = useExpenseStore((state) => state.expenses)

  const handleFilterPress = (filter: string) => {
    setActiveFilter(filter)
  }

  //Group expenses by category
  const groupedExpenses = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }
    , {} as { [key: string]: number });


  return (
    <View style={styles.container}>
      <Text style={styles.header} >Insights</Text>
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => handleFilterPress(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={styles.scrollContent}>
        {
          Object.entries(groupedExpenses).map(([category, total]) => (
            <View key={category} style={styles.innerContainer}>
              <Text style={{ fontSize: 25 }}>{categories.find((cat) => cat.name === category)?.emoji}</Text>
              <View style={{ flex: 1, gap: 5 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{category}</Text>
                {completeionBar(Math.min((total / 1000) * 100, 100))}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{getDeviceCurrencySymbol()}{total.toFixed(2)}</Text>
                <Text style={{
                  fontSize: 12,
                  color: '#666',
                }} >{Math.min((total / 1000) * 100, 100)}%</Text>
              </View>
            </View>
          ))
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f0f0f0ff",
    gap: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  filterText: {
    fontSize: 10,
    color: '#333',
    padding: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterTextActive: {
    color: '#fff',
    backgroundColor: 'black',
    borderColor: 'black',
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginTop: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  scrollContent: {
    borderRadius: 20,
  }
});

export default Insights;
