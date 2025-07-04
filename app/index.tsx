import { COLORS } from "@/constants/Color";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function Index() {

  const router = useRouter();

  return (
    <View
      style={styles.container}
    >
      <Image source={require("../assets/images/get-started.svg")} style={styles.image} />
      <Text style={styles.mainText}>Effortless financial management at your fingertips</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/sign-up")}>
        <Text style={styles.text}>Get Started</Text>
        <Ionicons name="arrow-forward-circle" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  image: {
    width: 400,
    height: 400,
    mixBlendMode: "multiply"
  },
  mainText: {
    fontSize: 40,
    color: COLORS.light.text,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  text: {
    fontSize: 25,
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    borderRadius: 15,
    paddingHorizontal: 30,
    padding: 15,
    elevation: 3,
  },
})