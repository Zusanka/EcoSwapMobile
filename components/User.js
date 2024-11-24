import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import Navbar from './Navbar';
import ItemCard from './ItemCard';
import ReviewCard from './ReviewCard';
import { renderStars } from './StarRating';

const User = () => {
  const route = useRoute();
  const { username, phoneNumber, city, userImage, email } = route.params || {};

  const [storedItemData, setStoredItemData] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    username: '',
    rating: 0,
    text: '',
  });

  const [reviews, setReviews] = useState([
    { id: 1, username: 'User 1', rating: 3, text: "Great service!", date: "2024-10-01T12:00:00Z" },
    { id: 2, username: 'User 2', rating: 4, text: "Very reliable.", date: "2024-09-20T12:00:00Z" },
    { id: 3, username: 'User 3', rating: 4, text: "Highly recommended!", date: "2024-08-15T12:00:00Z" },
  ]);

  const items = [
    { id: 1, name: "item", image: "https://via.placeholder.com/150", dateAdded: "2024-10-01", price: 199.99, brand: "Brand A", category: "Electronics" },
    { id: 2, name: "Item 2", image: "https://via.placeholder.com/150", dateAdded: "2024-09-20", price: 149.49, brand: "Brand B", category: "Furniture" },
    { id: 3, name: "Item 3", image: "https://via.placeholder.com/150", dateAdded: "2024-08-15", price: 299.00, brand: "Brand C", category: "Clothing" },
    { id: 4, name: "Item 4", image: "https://via.placeholder.com/150", dateAdded: "2024-07-01", price: 99.99, brand: "Brand D", category: "Toys" },
    { id: 5, name: "Item 5", image: "https://via.placeholder.com/150", dateAdded: "2024-08-01", price: 9.99, brand: "Brand D", category: "Toys" }
  ];

  useEffect(() => {
    const storedData = items;
    if (storedData) {
      setStoredItemData(storedData);
    }
  }, []);

  const calculateAverageRating = () => {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const averageRating = parseFloat(calculateAverageRating());

  const handleReviewSubmit = () => {
    const newReviewData = {
      ...newReview,
      id: reviews.length + 1,
      date: new Date().toISOString(),
    };
    setReviews((prevReviews) => [...prevReviews, newReviewData]);
    setNewReview({ username: '', rating: 0, text: '' });
    setShowReviewForm(false);
  };

  const handleStarClick = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  return (
    <>
      <Navbar />
      <ScrollView style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: userImage || 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.username}>{username}</Text>
          <View style={styles.starsContainer}>
            {renderStars(averageRating)}
          </View>
          <Text style={styles.averageRating}>Średnia: {averageRating}/5 wg {reviews.length} opinii</Text>
        </View>

        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>KONTAKT</Text>
          <View style={styles.contactItem}>
            <Icon name="envelope" size={20} style={styles.icon} />
            <Text style={styles.contactText}>{email}</Text>
          </View>
          <View style={styles.contactItem}>
            <Icon name="phone" size={20} style={styles.icon} />
            <Text style={styles.contactText}>{phoneNumber}</Text>
          </View>
          <View style={styles.contactItem}>
            <Icon name="home" size={20} style={styles.icon} />
            <Text style={styles.contactText}>{city}</Text>
          </View>
        </View>

        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>PRZEDMIOTY UŻYTKOWNIKA</Text>
          <FlatList
            data={storedItemData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ItemCard item={item} />
            )}
            horizontal
          />
        </View>

        <View style={styles.reviewsContainer}>
          <Text style={styles.sectionTitle}>OPINIE O UŻYTKOWNIKU</Text>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              username={review.username}
              rating={review.rating}
              text={review.text}
              date={review.date}
            />
          ))}

          {!showReviewForm && (
            <TouchableOpacity
              onPress={() => setShowReviewForm(true)}
              style={styles.reviewButton}
            >
              <Text style={styles.reviewButtonText}>Dodaj opinię</Text>
            </TouchableOpacity>
          )}

          {showReviewForm && (
            <View style={styles.reviewForm}>
              <TextInput
                value={newReview.text}
                onChangeText={(text) => setNewReview({ ...newReview, text })}
                placeholder="Napisz swoją opinię"
                style={styles.textInput}
                multiline
              />
              <View style={styles.starsContainer}>
                {renderStars(newReview.rating, handleStarClick)}
              </View>
              <TouchableOpacity
                onPress={handleReviewSubmit}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Dodaj opinię</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  averageRating: {
    fontSize: 14,
    color: 'gray',
  },
  contactContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  contactText: {
    fontSize: 16,
  },
  itemsContainer: {
    marginBottom: 20,
  },
  reviewsContainer: {
    marginBottom: 20,
  },
  reviewButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reviewForm: {
    marginTop: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default User;
