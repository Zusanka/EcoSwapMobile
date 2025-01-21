import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderStars } from './StarRating';
import StarRatingInput from './StarRatingInput';
import { updateReview, deleteReview, fetchItems, getProfilePicture } from '../api/api';

const ReviewCard = ({
                        reviewId,
                        userId,
                        reviewerId,
                        reviewerUsername,
                        description,
                        rating,
                        createdAt,
                        onReviewChange, // Callback do aktualizacji danych
                    }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedReview, setUpdatedReview] = useState({ rating, description });

    useEffect(() => {
        const loadCurrentUser = async () => {
            const user = await AsyncStorage.getItem('user');
            if (user) {
                const parsedUser = JSON.parse(user);
                setCurrentUserId(parsedUser.id);
            }
        };

        const loadProfilePicture = async () => {
            const profilePicBase64 = await getProfilePicture(reviewerId);
            if (profilePicBase64) {
                setProfileImage(`data:image/jpeg;base64,${profilePicBase64}`);
            }
        };

        loadCurrentUser();
        loadProfilePicture();
    }, [reviewerId]);

    const handleUpdateReview = async () => {
        try {
            const updatedData = {
                userid: currentUserId,
                rating: updatedReview.rating,
                description: updatedReview.description,
            };
            await updateReview(reviewId, updatedData);
            setIsEditing(false);
            if (onReviewChange) {
                onReviewChange(); // Wywołanie po edycji recenzji
            }
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const handleDeleteReview = async () => {
        try {
            await deleteReview(reviewId);
            if (onReviewChange) {
                onReviewChange(); // Wywołanie po usunięciu recenzji
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

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
                {isEditing ? (
                    <>
                        <StarRatingInput
                            rating={updatedReview.rating}
                            setRating={(newRating) =>
                                setUpdatedReview({ ...updatedReview, rating: newRating })
                            }
                        />
                        <TextInput
                            style={styles.textInput}
                            value={updatedReview.description}
                            onChangeText={(text) =>
                                setUpdatedReview({ ...updatedReview, description: text })
                            }
                            placeholder="Edytuj swoją opinię..."
                            multiline
                        />
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateReview}>
                                <Text style={styles.saveButtonText}>Zapisz</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setIsEditing(false)}
                            >
                                <Text style={styles.cancelButtonText}>Anuluj</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.rating}>{renderStars(rating)}</View>
                        <Text style={styles.reviewText}>{description}</Text>
                        <Text style={styles.date}>{formattedDate}</Text>
                    </>
                )}
            </View>

            {currentUserId === reviewerId && (
                <View style={styles.actionIcons}>
                    <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.iconButton}>
                        <FontAwesomeIcon icon={faPencilAlt} size={16} color="blue" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteReview} style={styles.iconButton}>
                        <FontAwesomeIcon icon={faTrash} size={16} color="red" />
                    </TouchableOpacity>
                </View>
            )}
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
    imageWrapper: {
        width: 60,
        height: 60,
        borderRadius: 60,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
        resizeMode: 'cover',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
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
    actionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    iconButton: {
        marginLeft: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
        textAlignVertical: 'top',
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 8,
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 8,
        borderRadius: 8,
        marginRight: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default ReviewCard;
