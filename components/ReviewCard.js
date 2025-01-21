// ReviewCard.js

import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { renderStars } from './StarRating';
import {fetchItems, getProfilePicture} from '../api/api';

const ReviewCard = ({ reviewId, userId, reviewerId, reviewerUsername, description, rating, createdAt}) => {

    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const loadProfilePicture = async () => {
            const profilePicBase64 = await getProfilePicture(reviewerId);
            if (profilePicBase64) {
                setProfileImage(`data:image/jpeg;base64,${profilePicBase64}`);
            }
        }
        loadProfilePicture();
    }, []);

    const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
        : 'Brak daty';

    return (
        <View style={styles.container}>
            <View style={styles.userInfo}>
                <TouchableOpacity style={styles.imageWrapper}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.noAvatarText}>Brak zdjęcia</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={styles.username}>{reviewerUsername}</Text>
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
    imageWrapper: {
        width: 60,
        height: 60,
        borderRadius: 60,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
    },

    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 60, // Dla okrągłego obrazu
        resizeMode: "cover",
    },
});

export default ReviewCard;
