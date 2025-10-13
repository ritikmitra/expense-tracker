import useExpenseStore from '@/store/useExpenseStore';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CategoryModal, { categories } from '../../(modal)/CategoryModal';


const AddExpenseModal = ({ setModalVisible }: { setModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const addExpense = useExpenseStore((state) => state.addExpense);


  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleAddExpense = () => {

    
    if (!amount || !description || !selectedCategory) {
      alert('Please fill all fields');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Amount must be a valid number');
      return;
    }

    addExpense({
      amount: parsedAmount,
      description,
      category: selectedCategory,
      date: date.toISOString(),
    });

    // Reset fields and close modal
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setDate(new Date());
    setModalVisible(false);
  };

  const showDatepicker = () => {
    setShow(true);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(false)}>
        <MaterialIcons name='cancel' size={24} style={{ marginBottom: 10 }} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Add new Expense</Text>
      <Text style={styles.headerDescription}>
        Enter the details of your expense to help you keep track of your spending.
      </Text>
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Enter Amount</Text>
        <TextInput
          style={styles.inputStyle}
          keyboardType="numeric"
          placeholder="e.g. 100.00"
          placeholderTextColor="#666"
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="e.g. Groceries, Rent, etc."
          placeholderTextColor="#666"
          value={description}
          onChangeText={setDescription}
        />
      </View>
      {/* Category Select */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Category</Text>
        <TouchableOpacity
          style={styles.inputCategoryStyle}
          onPress={() => setCategoryModalVisible(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {selectedCategory &&
              <Text>{categories.find((category) => category.name === selectedCategory)?.emoji}</Text>
            }
            <Text style={{ color: selectedCategory ? '#000' : '#999' }}>
              {selectedCategory || 'Select Category'}
            </Text>
          </View>
          <Ionicons name="chevron-forward-circle" size={24} color="#666" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Date</Text>

        <TouchableOpacity onPress={showDatepicker}>
          <View style={styles.inputContainer}>
            <TextInput
              editable={false}
              value={date.toDateString()}
            />
            <Ionicons name="calendar-outline" size={24} color="#666" style={{ marginLeft: 10 }} />
          </View>
        </TouchableOpacity>

        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </View>
      <TouchableOpacity onPress={handleAddExpense} style={styles.button}>
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>
      <Modal
        visible={categoryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <CategoryModal
          setCategoryModalVisible={setCategoryModalVisible}
          setSelectedCategory={setSelectedCategory}
        />
      </Modal>
    </View>
  )
}

export default AddExpenseModal



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingHorizontal: 25,
    gap: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  headerDescription: {
    fontSize: 16,
    color: '#666'
  },
  inputSection: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: 'bold',
  },
  inputStyle: {
    padding: 15,
    marginTop: 5,
    backgroundColor: '#f8f8ff',
    borderRadius: 5,
  },
  inputCategoryStyle: {
    padding: 15,
    marginTop: 5,
    backgroundColor: '#f8f8ff',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f8ff',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    padding: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16, color: '#fff', fontWeight: 'bold'
  }
})
