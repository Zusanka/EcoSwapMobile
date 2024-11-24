import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from "./Navbar";

const Home = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const navigation = useNavigation();

  const scrollToTop = () => {
    Alert.alert("Feature in Progress", "Scroll to top not implemented in React Native.");
  };

  const handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y > 300) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  useEffect(() => {
    // Placeholder for any mount logic
  }, []);

  return (
    <>
      <Navbar />
      <ScrollView style={styles.container} onScroll={handleScroll} scrollEventThrottle={16}>
        <ImageBackground
          source={require('../assets/prudence-earl-8F0I12ypHPA-unsplash.jpg')}
          style={styles.imageBackground}
        >
          <View style={styles.overlay} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Welcome to EcoSwap!</Text>
            <Text style={styles.subHeaderText}>Join us to exchange eco-friendly products.</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddItem")}
              style={styles.addItemButton}
            >
              <Text style={styles.addItemButtonText}>DODAJ PRZEDMIOT</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={styles.whyUsContainer}>
          <Text style={styles.sectionHeaderText}>Dlaczego my?</Text>
          <Text style={styles.sectionDescriptionText}>
            Znaleźć produkty w różnych kategoriach, które pomogą Ci żyć bardziej ekologicznie.
          </Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridItemHeader}>Ekologiczne produkty</Text>
              <Text style={styles.gridItemText}>
                Wszystko, czego potrzebujesz do życia w zgodzie z naturą.
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridItemHeader}>Produkty do domu</Text>
              <Text style={styles.gridItemText}>
                Produkty, które pomogą Ci uczynić Twój dom bardziej ekologicznym.
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridItemHeader}>Zrównoważona moda</Text>
              <Text style={styles.gridItemText}>
                Stylowe ubrania z naturalnych materiałów, które dbają o środowisko.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionHeaderText}>Kategorie</Text>
          <View style={styles.categoriesGrid}>
            {categoryData.map((item, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem}>
                <Icon name={item.icon} size={40} color="gray" />
                <Text style={styles.categoryItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.recentItemsContainer}>
          <Text style={styles.sectionHeaderText}>Ostatnio dodane</Text>
          {/* You could add items here */}
        </View>
      </ScrollView>

      {showScrollButton && (
        <TouchableOpacity onPress={scrollToTop} style={styles.scrollButton}>
          <Icon name="chevron-up" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </>
  );
};

const categoryData = [
  { label: "Moda", icon: "tshirt" },
  { label: "Obuwie", icon: "shoe-prints" },
  { label: "Książki", icon: "book" },
  { label: "Muzyka", icon: "music" },
  { label: "Film", icon: "film" },
  { label: "Zabawki", icon: "puzzle-piece" },
  { label: "Uroda", icon: "eye" },
  { label: "Dom", icon: "house" },
  { label: "Elektronika", icon: "laptop" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  headerTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 16,
  },
  addItemButton: {
    backgroundColor: '#38a169',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  addItemButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  whyUsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e3a8a',
  },
  sectionDescriptionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#4b5563',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '30%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gridItemHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e3a8a',
  },
  gridItemText: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoriesContainer: {
    padding: 16,
    alignItems: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryItem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryItemText: {
    marginTop: 8,
    fontSize: 14,
    color: '#1e3a8a',
  },
  recentItemsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  scrollButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#38a169',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Home;
