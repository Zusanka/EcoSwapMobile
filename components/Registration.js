import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Registration = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      console.log("Rozpoczęcie procesu rejestracji...");
      console.log("Dane do wysłania:", {
        username: login,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
      });

      const response = await fetch("http://192.168.1.104:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: login,
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
        }),
      });

      if (response.ok) {
        const data = await response.text();
        console.log("Rejestracja przebiegła pomyślnie:", data);

        Alert.alert("Sukces", data, [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
      } else {
        const errorData = await response.text();
        console.error("Błąd odpowiedzi serwera:", errorData);

        Alert.alert("Błąd rejestracji", errorData || "Nieprawidłowe dane");
      }
    } catch (error) {
      console.error("Błąd połączenia z serwerem:", error);
      Alert.alert("Błąd", "Nie udało się połączyć z serwerem");
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ImageBackground
            source={require("../assets/4881822.jpg")}
            style={styles.backgroundImage}
            imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay} />
        </ImageBackground>
        <View style={styles.formContainer}>
          <Text style={styles.brandText}>EcoSwap</Text>
          <Text style={styles.titleText}>Zarejestruj się</Text>
          <Text style={styles.subtitleText}>Utwórz swoje konto:</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Login</Text>
            <TextInput
                style={styles.input}
                value={login}
                onChangeText={setLogin}
                placeholder="Wpisz login"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Wpisz e-mail"
                keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Hasło</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Wpisz hasło"
                  secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={styles.showPasswordButton}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? "👁️" : "🙈"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Imię</Text>
            <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Wpisz imię"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nazwisko</Text>
            <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Wpisz nazwisko"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Numer telefonu</Text>
            <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Wpisz numer telefonu"
                keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Zarejestruj się</Text>
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>lub zarejestruj się przez</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
              <Text style={styles.socialButtonText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
              <Text style={styles.socialButtonText}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.instagramButton]}>
              <Text style={styles.socialButtonText}>📸</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Masz już konto?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}> Zaloguj się</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
  );
};

// ===== STYLES =====
const styles = StyleSheet.create({
  scrollContainer: {
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
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  formContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  brandText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#28a745",
    textAlign: "center",
    fontFamily: "Dancing Script, cursive",
    marginBottom: 10,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  showPasswordButton: {
    marginLeft: 10,
  },
  showPasswordText: {
    fontSize: 14,
    color: "#6c757d",
  },
  registerButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 20,
  },
  registerButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ced4da",
  },
  orText: {
    marginHorizontal: 10,
    color: "#6c757d",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  googleButton: {
    backgroundColor: "#dc3545",
  },
  facebookButton: {
    backgroundColor: "#007bff",
  },
  instagramButton: {
    backgroundColor: "#c13584",
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: "#6c757d",
  },
  loginLink: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "bold",
  },
});

export default Registration;
