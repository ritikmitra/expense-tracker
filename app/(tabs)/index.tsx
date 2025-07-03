import { Image } from 'expo-image'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Index = () => {
  const [activeFilter, setActiveFilter] = useState('Today')

  const filters = ['Today', 'This Week', 'This Month', 'Calendar']

  const handleFilterPress = (filter: string) => {
    setActiveFilter(filter)
  }

  const getFilterDate = () => {
    const currentDate = new Date()

    switch (activeFilter) {
      case 'Today':
        return `Today, ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      case 'This Week':
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        return `This Week (${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`
      case 'This Month':
        return `${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      case 'Calendar':
        return 'Select date range'
      default:
        return `Today, ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/icon.png')} style={styles.headerImg} />
        <View style={styles.innerHeader}>
          <Text style={styles.headerText}>Good morning, John</Text>
          <Text style={styles.headerDescription}>Track your expenses, start your day right</Text>
        </View>
      </View >
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
      <View style={styles.spendContainer}>
        <Text style={styles.spendText}>Spend so far</Text>
        <Text style={styles.spendAmount}>$1,200</Text>
      </View>
      <View style={styles.spendListContainer}>
        <Text style={styles.filterDate}>{getFilterDate()}</Text>
        <View style={styles.innerListContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' ,gap: 10}}>
            <Image source={require('../../assets/images/icon.png')} style={{ width: 50, height: 50 }} />
            <View style={{ gap: 5 }}>
              <Text style={{
                color: '#333',
              }}>Food</Text>
              <Text style={{
                color: '#666',
                fontSize: 12,
              }}>Time</Text>
            </View>
          </View>          
          <Text>6,663</Text>
        </View>
      </View>
    </View>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    gap: 10,
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerImg: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  headerDescription: {
    fontSize: 16,
    color: '#666',
  },
  innerHeader: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 10,
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
    fontSize: 10,
    color: '#fff',
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'black',
  },
  spendContainer: {
    padding: 25,
    backgroundColor: 'black',
    borderRadius: 10,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spendText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666',
  },
  spendAmount: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
  },
  filterDate: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    marginTop: 5,
  },
  spendListContainer: {
    flex: 1,
    gap: 10,
  },
  innerListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8ff',
    borderRadius: 15,
    padding: 10,
    elevation:1,
    justifyContent: 'space-between',
  },
})