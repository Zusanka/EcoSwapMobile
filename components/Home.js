import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ItemCard from "./ItemCard";

const Home = () => {
  const [likedItems, setLikedItems] = useState({});
  const navigation = useNavigation();

  const items = [
    { id: 1, name: "T-shirt", dateAdded: "29.10.2024", category: "Moda", price: 29.99, brand: "Stradivarius", image: require("../assets/1.jpeg") },
    { id: 2, name: "Plecak z eko skóry", dateAdded: "30.10.2024", category: "Moda", price: 49.99, brand: "Zara", image: require("../assets/2.jpeg") },
    { id: 3, name: "Skórzane buty", dateAdded: "30.10.2024", category: "Obuwie", price: 79.99, brand: "CCC", image: require("../assets/3.jpeg") },
    { id: 4, name: "Książka", dateAdded: "30.10.2024", category: "Książki", price: 19.99, brand: "Wydawnictwo Znak", image: require("../assets/4.jpeg") },
    { id: 5, name: "Spódnica zamszowa", dateAdded: "30.10.2024", category: "Moda", price: 15.99, brand: "Orsay", image: require("../assets/5.jpeg") },
    { id: 6, name: "Koszula w króliki", dateAdded: "30.10.2024", category: "Moda", price: 39.99, brand: "H&M", image: require("../assets/6.jpeg") },
  ];

  const handleLikeClick = (itemId) => {
    setLikedItems((prevLikedItems) => ({
      ...prevLikedItems,
      [itemId]: !prevLikedItems[itemId],
    }));
  };

  const renderHeader = () => (
      <>
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
      </>
  );

  const renderFooter = () => (
      <View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dlaczego my?</Text>
          <FlatList
              data={[
                { id: 1, title: "Ekologiczne produkty", description: "Wszystko, czego potrzebujesz do życia w zgodzie z naturą." },
                { id: 2, title: "Produkty do domu", description: "Produkty, które pomogą Ci uczynić Twój dom bardziej ekologicznym." },
                { id: 3, title: "Zrównoważona moda", description: "Stylowe ubrania z naturalnych materiałów, które dbają o środowisko." },
              ]}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                  </View>
              )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ostatnio dodane</Text>
          <FlatList
              data={items}
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
      </View>
  );

  return (
      <FlatList
          data={[]}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.container}
      />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
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
  section: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    width: 200,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  itemsContainer: {
    paddingHorizontal: 10,
  },
});

export default Home;
