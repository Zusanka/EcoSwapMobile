// User.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faPhone, faHome } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';
import ItemCard from './ItemCard';
import ReviewCard from './ReviewCard';
import { renderStars } from './StarRating';
import StarRatingInput from './StarRatingInput'; // Importujemy komponent do wyboru gwiazdek

// Importujemy funkcje z api.js
import {
  getUserData,
  getUserItems,
  getUserReviews,
  getUserAverageRating,
  checkIfFavorite,
  addToFavorites,
  removeFromFavorites,
  getProfilePicture,
  addReview, // Importujemy funkcję addReview
} from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const User = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || {};
  const [profileImage, setProfileImage] = useState(null);

  // Logowanie otrzymanych parametrów
  console.log('User component received params:', route.params);

  const [user, setUser] = useState(null); // Dane użytkownika
  const [items, setItems] = useState([]); // Ogłoszenia użytkownika
  const [reviews, setReviews] = useState([]); // Opinie użytkownika
  const [averageRating, setAverageRating] = useState(0); // Średnia ocena użytkownika
  const [likedItems, setLikedItems] = useState({}); // Stan polubień dla ogłoszeń
  const [showReviews, setShowReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, description: '' }); // Aktualizacja stanu newReview
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
        setLoading(true);

        // Pobranie danych użytkownika
        const userData = await getUserData(userId);
        setUser(userData);

        // Pobranie ogłoszeń, opinii i średniej oceny
        const userItems = await getUserItems(userId);
        setItems(userItems);

        const userReviews = (await getUserReviews(userId)) || []; // Ustawienie pustej tablicy jako domyślnej wartości
        setReviews(userReviews);

        const userAverageRating = (await getUserAverageRating(userId)) ?? 0; // Ustawienie 0 jako domyślnej wartości
        setAverageRating(userAverageRating);

        const profilePicBase64 = await getProfilePicture(userId);
        if (profilePicBase64) {
          setProfileImage(`data:image/jpeg;base64,${profilePicBase64}`);
        }

        // Sprawdzenie polubień
        const favoriteStatuses = await Promise.all(
            userItems.map(async (item) => {
              const status = await checkIfFavorite(item.id);
              return { itemId: item.id, isFavorite: status.isFavorite };
            })
        );

        const liked = {};
        favoriteStatuses.forEach((status) => {
          liked[status.itemId] = status.isFavorite;
        });
        setLikedItems(liked);
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

  const handleLikeClick = async (itemId) => {
    try {
      if (likedItems[itemId]) {
        // Usuwamy z ulubionych
        await removeFromFavorites(itemId);
      } else {
        // Dodajemy do ulubionych
        await addToFavorites(itemId);
      }

      // Aktualizujemy stan likedItems
      setLikedItems((prev) => ({
        ...prev,
        [itemId]: !prev[itemId],
      }));
    } catch (error) {
      console.error('Błąd przy aktualizacji ulubionych:', error);
      // Opcjonalnie: Dodaj informację dla użytkownika o błędzie
    }
  };

  const handleReviewSubmit = async () => {
    if (newReview.rating === 0 || newReview.description.trim() === '') {
      setError('Proszę ocenić i napisać opis opinii.');
      return;
    }

    const reviewData = {
      userid: userId,
      rating: newReview.rating,
      description: newReview.description,
    };

    try {
      setLoading(true);
      const addedReview = await addReview(reviewData);

      // Sprawdź, czy addedReview ma 'id', jeśli nie, przypisz unikalny
      if (!addedReview.id) {
        addedReview.id = Date.now(); // Przykład przypisania unikalnego id
      }

      setReviews([...reviews, addedReview]);
      const updatedAverage = await getUserAverageRating(userId);
      setAverageRating(updatedAverage);
      setNewReview({ rating: 0, description: '' });
      setShowReviewForm(false);
      setError('');
    } catch (error) {
      if (
          error.response &&
          error.response.status === 400 &&
          error.response.data === 'You have already reviewed this user'
      ) {
        setError('Już zamieszczono opinię.');
      } else {
        setError('Nie udało się dodać opinii. Spróbuj ponownie.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#28a745" />
          <Text>Ładowanie danych użytkownika...</Text>
        </View>
    );
  }

  if (error && !showReviewForm) {
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

  // Debugging: Sprawdź strukturę danych
  console.log('Reviews:', reviews);
  console.log('Items:', items);

  // Determine the data and renderItem based on showReviews
  const data = showReviews ? reviews : items;
  const renderItem = ({ item }) => {
    if (showReviews) {
      return <ReviewCard {...item} />;
    } else {
      return (
          <ItemCard
              item={item}
              liked={!!likedItems[item.id]}
              onLike={() => handleLikeClick(item.id)}
          />
      );
    }
  };

  return (
      <FlatList
          data={data}
          keyExtractor={(item, index) => (item.id || item.reviewId || index).toString()}
          renderItem={renderItem}
          ListHeaderComponent={
            <View>
              <Navbar />
              <View style={styles.profileContainer}>
                <TouchableOpacity style={styles.imageWrapper}>
                  {profileImage ? (
                      <Image source={{ uri: profileImage }} style={styles.profileImage} />
                  ) : (
                      <View style={styles.placeholder}>
                        <Text style={styles.noAvatarText}>Brak zdjęcia</Text>
                      </View>
                  )}
                </TouchableOpacity>
                <Text style={styles.username}>{user.username}</Text>
                <View style={styles.starsContainer}>
                  {renderStars(averageRating)}
                </View>
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
            </View>
          }
          ListFooterComponent={
            showReviews ? (
                <View>
                  {showReviewForm ? (
                      <View style={styles.reviewForm}>
                        <StarRatingInput
                            rating={newReview.rating}
                            setRating={(rating) => setNewReview({ ...newReview, rating })}
                        />
                        <TextInput
                            style={styles.textInput}
                            value={newReview.description}
                            onChangeText={(text) => setNewReview({ ...newReview, description: text })}
                            placeholder="Napisz swoją opinię..."
                            multiline
                        />
                        {error ? <Text style={styles.formErrorText}>{error}</Text> : null}
                        <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
                          <Text style={styles.submitButtonText}>Dodaj Opinię</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                              setShowReviewForm(false);
                              setNewReview({ rating: 0, description: '' });
                              setError('');
                            }}
                        >
                          <Text style={styles.cancelButtonText}>Anuluj</Text>
                        </TouchableOpacity>
                      </View>
                  ) : (
                      <TouchableOpacity style={styles.addReviewButton} onPress={() => setShowReviewForm(true)}>
                        <Text style={styles.addReviewButtonText}>Dodaj Opinię</Text>
                      </TouchableOpacity>
                  )}
                </View>
            ) : null
          }
          ListEmptyComponent={
            showReviews ? (
                <Text style={styles.noReviewsText}>Brak opinii.</Text>
            ) : (
                <View style={styles.itemsContainer}>
                  <Text style={styles.sectionTitle}>Ogłoszenia Użytkownika</Text>
                  <Text style={styles.noResultsText}>Użytkownik nie ma żadnych ogłoszeń.</Text>
                </View>
            )
          }
      />
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
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
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
  reviewForm: {
    marginVertical: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addReviewButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  addReviewButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  itemsContainer: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  noResultsText: { fontSize: 14, color: '#777', textAlign: 'center' },
  noReviewsText: { fontSize: 14, color: '#777', textAlign: 'center', marginTop: 10 },
  formErrorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default User;
