import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';


const AddExpenseModal = ({ setModalVisible }: { setModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);



  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios'); // For iOS, keep showing picker
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(false)}>
        <MaterialIcons name='cancel' size={24} style={{
          marginBottom: 10
        }} />
      </TouchableOpacity>
      <Text style={styles.text}>Add new Expense</Text>
      <Text style={{ fontSize: 16, color: '#666' }}>
        Enter the details of your expense to help you keep track of your spending.
      </Text>
      <View style={{
        marginTop: 20,
      }}>
        <Text style={{ fontSize: 15, color: '#333', fontWeight: 'bold' }}>Enter Amount</Text>
        <TextInput
          style={{
            padding: 15,
            marginTop: 5,
            backgroundColor: '#f8f8ff',
            borderRadius: 5,
          }}
        />
      </View>
      <View style={{
        marginTop: 20,
      }}>
        <Text style={{ fontSize: 15, color: '#333', fontWeight: 'bold' }}>Description</Text>
        <TextInput
          style={{
            padding: 15,
            marginTop: 5,
            backgroundColor: '#f8f8ff',
            borderRadius: 5,
          }}
        />
      </View>
      <View style={{
        marginTop: 20,
      }}>
        <Text style={{ fontSize: 15, color: '#333', fontWeight: 'bold' }}>Category</Text>
        <TextInput
          style={{
            padding: 15,
            marginTop: 5,
            backgroundColor: '#f8f8ff',
            borderRadius: 5,
          }}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 15, color: '#333', fontWeight: 'bold' }}>Date</Text>

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
      <TouchableOpacity style={{
        marginTop: 30,
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>Add Expense</Text>
      </TouchableOpacity>
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
  text: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f8ff',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    padding: 10,
  }
})