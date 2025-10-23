import useAuthStore from '@/store/useAuthStore'
import useExpenseStore, { Expense } from '@/store/useExpenseStore'
import { currentGreeting, fallbacksIntialUrls, formatTime, getDeviceCurrencySymbol } from '@/util/lib'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Image } from 'expo-image'
import { DrawerActions, useNavigation } from "@react-navigation/native"
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ExpenseBottomSheet from '../../(expenses)/BottomSheetModal'
import CalendarModal from '../../(modal)/CalendarModal'
import { categories } from '../../(modal)/CategoryModal'
import { MaterialCommunityIcons } from '@expo/vector-icons'

// Floating button component
function FloatingAIButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        {/* <Text style={styles.floatingButtonText}>🤖</Text> */}
        <MaterialCommunityIcons name='chat-outline' size={34} />
      </TouchableOpacity>

      {/* Modal for AI popup */}
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>AI Assistant</Text>
            <Text style={styles.modalContent}>
              👋 Hello! How can I assist you today?
            </Text>
            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const Index = () => {
  const [activeFilter, setActiveFilter] = useState('Today')

  const filters = ['Today', 'This Week', 'This Month']

  const [calendarModalVisible, setCalendarModalVisible] = useState(false)

  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const expenses = useExpenseStore((state) => state.expenses)

  const navigation = useNavigation()

  const openExpenseDetails = (expense: Expense) => {
    setSelectedExpense(expense)
    bottomSheetRef.current?.present()
  }

  const handleFilterPress = (filter: string) => {
    setActiveFilter(filter)
  }

  const { profile, user } = useAuthStore()

  const { fetchExpenses } = useExpenseStore()

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  // Filter expenses based on selected time period
  const filteredExpenses = useMemo(() => {
    const currentDate = new Date()
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)

      switch (activeFilter) {
        case 'Today':
          return expenseDate >= today
        case 'This Week':
          const startOfWeek = new Date(today)
          startOfWeek.setDate(today.getDate() - today.getDay())
          const endOfWeek = new Date(startOfWeek)
          endOfWeek.setDate(startOfWeek.getDate() + 7)
          return expenseDate >= startOfWeek && expenseDate < endOfWeek
        case 'This Month':
          const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
          const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
          return expenseDate >= startOfMonth && expenseDate < endOfMonth
        default:
          return expenseDate >= today
      }
    })
  }, [expenses, activeFilter])

  // Calculate total spend for filtered period
  const totalSpend = useMemo(() => {
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0)
  }, [filteredExpenses])

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
      default:
        return `Today, ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    }
  }

  return (
    <View style={styles.container} >
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Pressable android_ripple={{ color: "#ccc",radius : 30,borderless : true,foreground : true }} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Image source={{ uri: user?.photoURL || fallbacksIntialUrls(profile?.firstName, profile?.lastName) }} style={styles.headerImg} />
          </Pressable>
        </View>
        <View style={styles.innerHeader}>
          <Text style={styles.headerText}>{currentGreeting()}, {profile?.firstName}</Text>
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
        <TouchableOpacity
          onPress={() => setCalendarModalVisible(true)}
        >
          <Text style={styles.filterText}>
            Calendar
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.spendContainer}>
        <Text style={styles.spendText}>Spend so far</Text>
        <Text style={styles.spendAmount}>{getDeviceCurrencySymbol()}{totalSpend.toFixed(2)}</Text>
      </View>
      <View style={styles.spendListContainer}>
        <Text style={styles.filterDate}>{getFilterDate()}</Text>
        <ScrollView style={{ flexGrow: 1, paddingHorizontal: 5 }}>
          {
            filteredExpenses.map((expense) => (
              <TouchableOpacity onPress={() => openExpenseDetails(expense)} key={expense.id} style={styles.innerListContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 25 }}>{categories.find((category) => category.name === expense.category)?.emoji}</Text>
                  <View style={{ gap: 1 }}>
                    <Text style={{
                      color: '#333',
                    }}>{expense.description}</Text>
                    <Text style={{
                      color: '#666',
                      fontSize: 10,
                    }}>{formatTime(expense.date)}</Text>
                  </View>
                </View>
                <Text>{getDeviceCurrencySymbol()}{expense.amount}</Text>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
      <Modal
        visible={calendarModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <CalendarModal
          setCalendarModalVisible={setCalendarModalVisible}
        />
      </Modal>
      {/* <FloatingAIButton /> */}
      <ExpenseBottomSheet expenseId={selectedExpense?.id} ref={bottomSheetRef} />
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
    borderRadius: 50,
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
    color: '#fff',
    backgroundColor: 'black',
    borderColor: 'black',
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
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    justifyContent: 'space-between',
    marginTop: 10
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4959e9ff",
    width: 50,
    height: 50,
    borderRadius: 32.5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: "#523c86ff",
    borderRadius: 8,
    padding: 10,
  },
  closeText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
})