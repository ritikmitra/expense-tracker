import { MaterialIcons } from '@expo/vector-icons'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'

// const categories = ['Food', 'Rent', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Utilities', 'Travel', 'Groceries', 'Dining Out', 'Clothing', 'Education', 'Gifts', 'Subscriptions', 'Miscellaneous']


const categories = [
  { name: "Food", emoji: "🍜" },
  { name: "Rent", emoji: "🏠" },
  { name: "Transport", emoji: "🚌" },
  { name: "Shopping", emoji: "🛍️" },
  { name: "Bills", emoji: "💡" },
  { name: "Entertainment", emoji: "🎫" },
  { name: "Health", emoji: "💊" },
  { name: "Utilities", emoji: "🔌" },
  { name: "Travel", emoji: "✈️" },
  { name: "Groceries", emoji: "🛒" },
  { name: "Dining Out", emoji: "🍽️" },
  { name: "Clothing", emoji: "👕" },
  { name: "Education", emoji: "🎓" },
  { name: "Gifts", emoji: "🎁" },
  { name: "Subscriptions", emoji: "💳" },
  { name: "Miscellaneous", emoji: "💬" },
];

const CategoryModal = ({ setCategoryModalVisible, setSelectedCategory }: { setCategoryModalVisible: React.Dispatch<React.SetStateAction<boolean>>, setSelectedCategory: React.Dispatch<React.SetStateAction<string>> }) => {
    return (
        <View style={styles.container}>
            <MaterialIcons name='arrow-back-ios-new' size={24} style={{
                marginBottom: 10
            }} />
            <Text style={styles.headerTitle}>Select Category</Text>
            <Text style={styles.headerDescription}>Select a category that best describes what you spent your money on</Text>
            <FlatList style={{ marginTop: 10 }}
                data={categories}
                keyExtractor={(item) => item.name}
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.selectionBox}
                        onPress={() => {
                            setSelectedCategory(item.name)
                            setCategoryModalVisible(false)
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>{item.emoji}</Text>
                        <Text style={{ fontSize: 16 }}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default CategoryModal


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingHorizontal: 25,
        gap: 10,
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
    selectionBox: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#f8f8ff',
        margin: 5,
        elevation: 2,
    }
});
