import { MaterialIcons } from '@expo/vector-icons'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'

const categories = ['Food', 'Rent', 'Transport', 'Shopping', 'Bills', 'Other']


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
                keyExtractor={(item) => item}
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.selectionBox}
                        onPress={() => {
                            setSelectedCategory(item)
                            setCategoryModalVisible(false)
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>{item}</Text>
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
