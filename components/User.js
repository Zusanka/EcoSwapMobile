import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faPhone, faHome, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';
import ItemCard from './ItemCard';
import ReviewCard from './ReviewCard';
import { renderStars } from './StarRating';

const User = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    username,
    phoneNumber,
    city,
    userImage,
    email,
    price,
    images,
    name,
    brand,
    category,
  } = route.params || {};



  const [reviews, setReviews] = useState([
    { id: 1, username: 'User 1', rating: 3, text: 'Great service!', date: '2024-10-01' },
    { id: 2, username: 'User 2', rating: 4, text: 'Very reliable.', date: '2024-09-20' },
    { id: 3, username: 'User 3', rating: 5, text: 'Highly recommended!', date: '2024-08-15' },
  ]);

  const [items, setItems] = useState([
    { id: 1, name: 'T-shirt', dateAdded: '2024-10-29', category: 'Moda', price: 29.99, brand: 'Stradivarius', image: require('../assets/1.jpeg') },
    { id: 2, name: 'Eco leather backpack', dateAdded: '2024-10-30', category: 'Moda', price: 49.99, brand: 'Zara', image: require('../assets/2.jpeg') },
    // Add more items here...
  ]);

  const [likedItems, setLikedItems] = useState({});
  const [showReviews, setShowReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ username: '', rating: 0, text: '' });

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
      date: new Date().toISOString(),
    };
    setReviews([...reviews, newReviewData]);
    setNewReview({ username: '', rating: 0, text: '' });
    setShowReviewForm(false);
  };

  const calculateAverageRating = () => {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const averageRating = parseFloat(calculateAverageRating());

  return (
      <ScrollView style={styles.container}>
        <Navbar />
        <View style={styles.profileContainer}>
          <Image source={userImage} style={styles.profileImage} />
          <Text style={styles.username}>{username}</Text>
          <View style={styles.starsContainer}>{renderStars(averageRating)}</View>
          <Text style={styles.averageRating} onPress={handleToggleReviews}>
            Average: {averageRating}/5 based on {reviews.length} reviews
          </Text>
        </View>
        <View style={styles.contactContainer}>
          <Text style={styles.contactTitle}>Contact Information</Text>
          <View style={styles.contactRow}>
            <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
            <Text>{email}</Text>
          </View>
          <View style={styles.contactRow}>
            <FontAwesomeIcon icon={faPhone} style={styles.icon} />
            <Text>{phoneNumber}</Text>
          </View>
          <View style={styles.contactRow}>
            <FontAwesomeIcon icon={faHome} style={styles.icon} />
            <Text>{city}</Text>
          </View>
        </View>
        {showReviews ? (
            <View style={styles.reviewsContainer}>
              <FlatList
                  data={reviews}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => <ReviewCard {...item} />}
              />
              {showReviewForm ? (
                  <View style={styles.reviewForm}>
                    <TextInput
                        style={styles.textInput}
                        value={newReview.text}
                        onChangeText={(text) => setNewReview({ ...newReview, text })}
                        placeholder="Write your review..."
                        multiline
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
                      <Text style={styles.submitButtonText}>Submit Review</Text>
                    </TouchableOpacity>
                  </View>
              ) : (
                  <TouchableOpacity style={styles.addReviewButton} onPress={() => setShowReviewForm(true)}>
                    <Text style={styles.addReviewButtonText}>Add Review</Text>
                  </TouchableOpacity>
              )}
            </View>
        ) : (
            <View style={styles.itemsContainer}>
              <FlatList
                  data={items}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                      <ItemCard item={item} liked={!!likedItems[item.id]} onLike={() => handleLikeClick(item.id)} />
                  )}
              />
            </View>
        )}
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  profileContainer: { alignItems: 'center', padding: 16 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  username: { fontSize: 18, fontWeight: 'bold' },
  starsContainer: { flexDirection: 'row', marginVertical: 8 },
  averageRating: { fontSize: 14, color: '#555', textDecorationLine: 'underline' },
  contactContainer: { padding: 16 },
  contactTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  icon: { marginRight: 8 },
  reviewsContainer: { padding: 16 },
  itemsContainer: { padding: 16 },
  reviewForm: { marginVertical: 16 },
  textInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginBottom: 8 },
  submitButton: { backgroundColor: '#4caf50', padding: 12, borderRadius: 8 },
  submitButtonText: { color: '#fff', textAlign: 'center' },
  addReviewButton: { backgroundColor: '#2196f3', padding: 12, borderRadius: 8 },
  addReviewButtonText: { color: '#fff', textAlign: 'center' },
});

export default User;
