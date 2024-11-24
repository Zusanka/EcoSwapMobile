import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { renderStars } from './StarRating';  // Import the renderStars function

const ReviewCard = ({ username, rating, text, userImage, date }) => {
    const formattedDate = date
        ? new Date(date).toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
        : "Brak daty"; // In case 'date' is invalid or not provided, show "Brak daty"

    return (
        <View style={styles.reviewCard}>
            <View style={styles.userInfo}>
                {/* User info section (Image and Name) */}
                <View style={styles.userImageContainer}>
                    {userImage ? (
                        <Image source={{ uri: userImage }} style={styles.userImage} />
                    ) : (
                        <View style={styles.noUserImage}>
                            <Text style={styles.userInitial}>
                                {username?.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={styles.username}>{username}</Text>
            </View>

            <View style={styles.reviewContent}>
                <View style={styles.starRating}>
                    {renderStars(rating)} {/* Render the star ratings */}
                </View>
                <Text style={styles.reviewText}>{text}</Text>
                <Text style={styles.reviewDate}>{formattedDate}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    reviewCard: {
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 16,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userImageContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        marginRight: 12,
    },
    userImage: {
        width: '100%',
        height: '100%',
    },
    noUserImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInitial: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
    },
    reviewContent: {
        flex: 1,
    },
    starRating: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    reviewText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    reviewDate: {
        fontSize: 12,
        color: '#999',
    },
});

export default ReviewCard;
