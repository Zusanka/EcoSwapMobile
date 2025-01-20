// User.js

import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faPhone, faHome } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';
import ItemCard from './ItemCard';
import ReviewCard from './ReviewCard';
import { renderStars } from './StarRating';

// Importujemy funkcje z api.js
import { getUserData, getUserItems } from '../api/api';

const User = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || {};

  // Logowanie otrzymanych parametrów
  console.log('User component received params:', route.params);

  const [user, setUser] = useState(null); // Dane użytkownika
  const [items, setItems] = useState([]); // Ogłoszenia użytkownika
  const [reviews, setReviews] = useState([]); // Opinie użytkownika
  const [likedItems, setLikedItems] = useState({});
  const [showReviews, setShowReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ username: '', rating: 0, text: '' });
  const [loading, setLoading] = useState(true); // Flaga ładowania
  const [error, setError] = useState(''); // Komunikat o błędzie

  useEffect(() => {
    if (!userId) {
      setError('Brak identyfikatora użytkownika.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Pobranie danych użytkownika
        const userData = await getUserData(userId);
        setUser(userData);

        // Pobranie ogłoszeń użytkownika
        const userItems = await getUserItems(userId);
        setItems(userItems);

        // Opcjonalnie: Pobranie opinii użytkownika z backendu
        // const userReviews = await getUserReviews(userId);
        // setReviews(userReviews);

        // Przykładowe opinie (jeśli nie są pobierane z backendu)
        setReviews([
          { id: 1, username: 'User1', rating: 4, text: 'Świetny użytkownik!', date: '2024-10-01' },
          { id: 2, username: 'User2', rating: 5, text: 'Bardzo polecam.', date: '2024-09-20' },
        ]);
      } catch (err) {
        setError('Nie udało się pobrać danych użytkownika.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleToggleReviews = () => {
    setShowReviews(!showReviews);
  };

  const handleLikeClick = (id) => {
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReviewSubmit = () => {
    const newReviewData = {
      ...newReview,
      id: reviews.length + 1,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews([...reviews, newReviewData]);
    setNewReview({ username: '', rating: 0, text: '' });
    setShowReviewForm(false);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const averageRating = parseFloat(calculateAverageRating());

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#28a745" />
          <Text>Ładowanie danych użytkownika...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
    );
  }

  if (!user) {
    return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Użytkownik nie został znaleziony.</Text>
        </View>
    );
  }

  return (
      <ScrollView style={styles.container}>
        <Navbar />
        <View style={styles.profileContainer}>
          {user.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
          ) : (
              <View style={styles.noAvatarContainer}>
                <Text style={styles.noAvatarText}>Brak awatara</Text>
              </View>
          )}
          <Text style={styles.username}>{user.username}</Text>
          <View style={styles.starsContainer}>{renderStars(averageRating)}</View>
          <Text style={styles.averageRating} onPress={handleToggleReviews}>
            Średnia: {averageRating}/5 na podstawie {reviews.length} opinii
          </Text>
        </View>
        <View style={styles.contactContainer}>
          <Text style={styles.contactTitle}>Informacje Kontaktowe</Text>
          <View style={styles.contactRow}>
            <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
            <Text>{user.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <FontAwesomeIcon icon={faPhone} style={styles.icon} />
            <Text>{user.phoneNumber || 'Brak numeru telefonu'}</Text>
          </View>
          <View style={styles.contactRow}>
            <FontAwesomeIcon icon={faHome} style={styles.icon} />
            <Text>{user.address || 'Brak adresu'}</Text>
          </View>
        </View>
        {showReviews ? (
            <View style={styles.reviewsContainer}>
              <FlatList
                  data={reviews}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <ReviewCard {...item} />}
              />
              {showReviewForm ? (
                  <View style={styles.reviewForm}>
                    <TextInput
                        style={styles.textInput}
                        value={newReview.text}
                        onChangeText={(text) => setNewReview({ ...newReview, text })}
                        placeholder="Napisz swoją opinię..."
                        multiline
                    />
                    {/* Możesz dodać komponent do wyboru oceny (rating) */}
                    <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
                      <Text style={styles.submitButtonText}>Dodaj Opinię</Text>
                    </TouchableOpacity>
                  </View>
              ) : (
                  <TouchableOpacity style={styles.addReviewButton} onPress={() => setShowReviewForm(true)}>
                    <Text style={styles.addReviewButtonText}>Dodaj Opinię</Text>
                  </TouchableOpacity>
              )}
            </View>
        ) : (
            <View style={styles.itemsContainer}>
              <Text style={styles.sectionTitle}>Ogłoszenia Użytkownika</Text>
              {items!=null ? (
                  <FlatList
                      data={items}
                      keyExtractor={(item) => item.itemId}
                      renderItem={({ item }) => (
                          <ItemCard item={item} liked={!!likedItems[item.id]} onLike={() => handleLikeClick(item.id)} />
                      )}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                  />
              ) : (
                  <Text style={styles.noResultsText}>Użytkownik nie ma żadnych ogłoszeń.</Text>
              )}
            </View>
        )}
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#721c24',
    fontSize: 16,
    textAlign: 'center',
  },
  profileContainer: { alignItems: 'center', padding: 16 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  noAvatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  noAvatarText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  username: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  starsContainer: { flexDirection: 'row', marginVertical: 8 },
  averageRating: { fontSize: 14, color: '#555', textDecorationLine: 'underline' },
  contactContainer: { padding: 16 },
  contactTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  icon: { marginRight: 8, color: '#555' },
  reviewsContainer: { padding: 16 },
  reviewForm: { marginVertical: 16 },
  textInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginBottom: 8, height: 80 },
  submitButton: { backgroundColor: '#4caf50', padding: 12, borderRadius: 8 },
  submitButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  addReviewButton: { backgroundColor: '#2196f3', padding: 12, borderRadius: 8, marginTop: 10 },
  addReviewButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  itemsContainer: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  noResultsText: { fontSize: 14, color: '#777', textAlign: 'center' },
});

export default User;
