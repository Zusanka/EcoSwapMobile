import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.1.108:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: login, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Dane z backendu po zalogowaniu:", data);

        // Jeśli backend zwraca { token, id, username, email, ... }:
        if (data.token) {
          await AsyncStorage.setItem("token", data.token);
        }
        await AsyncStorage.setItem("user", JSON.stringify(data));

        Alert.alert("Sukces", "Zalogowano pomyślnie!");
        navigation.navigate("Home");
      } else {
        const errorData = await response.text();
        Alert.alert("Błąd logowania", errorData || "Nieprawidłowe dane");
      }
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się połączyć z serwerem");
      console.error(error);
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <ImageBackground
            source={require("../assets/4881822.jpg")}
            style={styles.backgroundImage}
            imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.logo}>EcoSwap</Text>
            <Text style={styles.welcomeText}>Witaj ponownie!</Text>
          </View>
        </ImageBackground>

        <View style={styles.formContainer}>
          <Text style={styles.subText}>Zaloguj się przez e-mail:</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Wpisz login"
                placeholderTextColor="#ccc"
                value={login}
                onChangeText={setLogin}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hasło</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                  style={styles.input}
                  placeholder="Wpisz hasło"
                  placeholderTextColor="#ccc"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
              />
              <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword((prev) => !prev)}
              >
                <Text style={styles.passwordToggleText}>
                  {showPassword ? "Ukryj" : "Pokaż"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Nie pamiętasz hasła?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Zaloguj się</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>lub zaloguj się przez</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: "#DB4437" }]}
            >
              <Text style={styles.socialButtonText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: "#4267B2" }]}
            >
              <Text style={styles.socialButtonText}>F</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: "#E1306C" }]}
            >
              <Text style={styles.socialButtonText}>I</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Nie masz jeszcze konta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>Zarejestruj się</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
  );
};
// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  backgroundImage: {
    width: "100%",
    height: 300,
    justifyContent: "flex-end",
  },
  imageStyle: {
    resizeMode: "cover",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#28a745",
    fontFamily: "DancingScript-Regular",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
  formContainer: {
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#fff",
    marginTop: -50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordToggle: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  passwordToggleText: {
    color: "#007AFF",
  },
  forgotPassword: {
    color: "#007AFF",
    fontSize: 14,
    textAlign: "right",
  },
  loginButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#333",
  },
  registerLink: {
    color: "#007AFF",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default Login;
