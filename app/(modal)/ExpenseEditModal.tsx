import useExpenseStore from "@/store/useExpenseStore";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, TextInput, Modal } from "react-native";
import CategoryModal, { categories } from "./CategoryModal";
import useAuthStore from "@/store/useAuthStore";

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export default function ExpenseEditModal({
  ExpenseDetailsProps,
  setExpenseEditModal,
}: {
  ExpenseDetailsProps: Expense | null;
  setExpenseEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const updateExpense = useExpenseStore((state) => state.modifyExpense);
  const {logout} = useAuthStore()

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ExpenseDetailsProps!.category)
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)

  // Prefill fields when modal opens
  useEffect(() => {
    if (ExpenseDetailsProps) {
      setDescription(ExpenseDetailsProps.description);
      setAmount(String(ExpenseDetailsProps.amount));
      setCategory(ExpenseDetailsProps.category);
    }
  }, [ExpenseDetailsProps]);

  const handleSave = () => {
    if (!ExpenseDetailsProps) return;
     updateExpense(ExpenseDetailsProps.id, {
      description,
      amount: parseFloat(amount),
      category : selectedCategory,
      date: ExpenseDetailsProps.date,
    });
    
    setExpenseEditModal(false);
    
  };

  return (
    <View style={styles.overlay}>
      {/* Blurred background */}
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} experimentalBlurMethod="dimezisBlurView" />

      {/* Optional dark overlay for better contrast */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.2)' }]} />

      {/* Actual modal content */}
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Edit Expense</Text>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.inputStyle}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            style={styles.inputStyle}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
          />
        </View>

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

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => setExpenseEditModal(false)}
            style={styles.cancelButton}
          >
            <MaterialCommunityIcons name="cancel" size={18} color="red" />
            <Text style={{ color: 'black', fontSize: 14 }}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <FontAwesome5 name="save" size={18} color="green" />
            <Text style={{ color: 'black', fontSize: 14 }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8d7da",
    padding: 10,
    borderRadius: 5,
    gap: 5,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d6e0d9",
    padding: 10,
    borderRadius: 5,
    gap: 5,
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
});
