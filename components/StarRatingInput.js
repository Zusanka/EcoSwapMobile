import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegStar } from '@fortawesome/free-regular-svg-icons';

const StarRatingInput = ({ rating, setRating }) => {
    return (
        <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <FontAwesomeIcon
                        icon={star <= rating ? faSolidStar : faRegStar}
                        size={24}
                        color="#FFD700"
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
});

export default StarRatingInput;
