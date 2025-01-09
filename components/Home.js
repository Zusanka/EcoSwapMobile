import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "./Navbar";
import ItemCard from "./ItemCard";

const Home = () => {
  const [likedItems, setLikedItems] = useState({});
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      const userData = await AsyncStorage.getItem("userToken");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    checkUser();
  }, []);

  const handleLikeClick = (itemId) => {
    setLikedItems((prevLikedItems) => ({
      ...prevLikedItems,
      [itemId]: !prevLikedItems[itemId],
    }));
  };

  return (
      <View style={styles.container}>
        {/* Navbar tylko jeśli użytkownik jest zalogowany */}
        {user && <Navbar onLogout={() => navigation.navigate("Home")} />}

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Sekcja nagłówka */}
          {!user && (
              <View style={styles.authButtonsContainer}>
                <TouchableOpacity
                    style={styles.authButton}
                    onPress={() => navigation.navigate("Register")}
                >
                  <Text style={styles.authButtonText}>ZAREJESTRUJ SIĘ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.authButton, styles.loginButton]}
                    onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.authButtonText}>ZALOGUJ SIĘ</Text>
                </TouchableOpacity>
              </View>
          )}

          <ImageBackground
              source={require("../assets/prudence-earl-8F0I12ypHPA-unsplash.jpg")}
              style={styles.heroBackground}
          >
            <View style={styles.overlay}>
              <Text style={styles.heroTitle}>Witaj w EcoSwap!</Text>
              <Text style={styles.heroSubtitle}>Dołącz do Nas i wspieraj planetę.</Text>
              <TouchableOpacity
                  style={styles.heroButton}
                  onPress={() => navigation.navigate("AddItem")}
              >
                <Text style={styles.heroButtonText}>DODAJ PRZEDMIOT</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          {/* Sekcja "Dlaczego my?" */}
          {!user && (
              <View style={styles.whyUsSection}>
                <Text style={styles.sectionTitle}>Dlaczego my?</Text>
                <View style={styles.whyUsItem}>
                  <Text style={styles.whyUsTitle}>🌱 Ekologiczne produkty</Text>
                  <Text style={styles.whyUsText}>
                    Wszystko, czego potrzebujesz, by żyć w zgodzie z naturą.
                  </Text>
                </View>
                <View style={styles.whyUsItem}>
                  <Text style={styles.whyUsTitle}>🏡 Produkty do domu</Text>
                  <Text style={styles.whyUsText}>
                    Produkty, które pomogą Ci uczynić Twój dom bardziej ekologicznym.
                  </Text>
                </View>
                <View style={styles.whyUsItem}>
                  <Text style={styles.whyUsTitle}>👗 Zrównoważona moda</Text>
                  <Text style={styles.whyUsText}>
                    Stylowe ubrania z naturalnych materiałów, które dbają o środowisko.
                  </Text>
                </View>
              </View>
          )}

          {/* Sekcja z najnowszymi przedmiotami */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ostatnio dodane</Text>
            <FlatList
                data={[
                  { id: 1, name: "T-shirt", dateAdded: "29.10.2024", category: "Moda", price: 29.99, brand: "Stradivarius", image: require("../assets/1.jpeg") },
                  { id: 2, name: "Plecak z eko skóry", dateAdded: "30.10.2024", category: "Moda", price: 49.99, brand: "Zara", image: require("../assets/2.jpeg") },
                ]}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.itemsContainer}
                renderItem={({ item }) => (
                    <ItemCard
                        item={item}
                        liked={likedItems[item.id]}
                        onLike={() => handleLikeClick(item.id)}
                    />
                )}
            />
          </View>
        </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  contentContainer: {
    flexGrow: 1,
  },
  authButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  authButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  loginButton: {
    backgroundColor: "#007AFF",
  },
  authButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  heroBackground: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  heroSubtitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  heroButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  whyUsSection: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  whyUsItem: {
    marginBottom: 15,
  },
  whyUsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
  },
  whyUsText: {
    fontSize: 14,
    color: "#555",
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemsContainer: {
    paddingHorizontal: 10,
  },
});

export default Home;
