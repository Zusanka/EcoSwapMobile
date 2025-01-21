// ReviewCard.js

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { renderStars } from './StarRating'; // Import funkcji renderStars

const ReviewCard = ({ username, rating, description, userImage, date }) => {
    const formattedDate = date
        ? new Date(date).toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
        : 'Brak daty';

    return (
        <View style={styles.container}>
            <View style={styles.userInfo}>
                <View style={styles.imageContainer}>
                    {userImage ? (
                        <Image source={{ uri: userImage }} style={styles.userImage} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>
                                {username?.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={styles.username}>{username}</Text>
            </View>

            <View style={styles.reviewContent}>
                <View style={styles.rating}>{renderStars(rating)}</View>
                <Text style={styles.reviewText}>{description}</Text>
                <Text style={styles.date}>{formattedDate}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    userInfo: {
        marginRight: 16,
        alignItems: 'center',
    },
    imageContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 8,
    },
    userImage: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 18,
        color: '#fff',
    },
    username: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    reviewContent: {
        flex: 1,
    },
    rating: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    reviewText: {
        color: '#606060',
        fontSize: 14,
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: '#909090',
    },
});

export default ReviewCard;
