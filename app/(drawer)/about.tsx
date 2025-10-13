import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native'

export default function About() {

      const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back-ios-new" size={22} color="#000" />
                </Pressable>
                <Text style={styles.header}>About</Text>
            </View>
                <Text style={{
                    margin : "auto"
                }} >Under Constructions</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f7", // light gray background like iOS
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: "#fff",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#ccc",
    },
    backButton: {
        marginRight: 10,
        padding: 5,
    },
    header: {
        fontSize: 22,
        fontWeight: "600",
        color: "#000",
    },
})