import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export const renderStars = (rating, onStarClick) => {
    const fullStars = Math.floor(rating);
    const partialStar = rating - fullStars;

    let stars = [];

    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <TouchableOpacity key={`full-${i}`} onPress={() => onStarClick(i + 1)}>
                <FontAwesomeIcon icon={faStar} size={24} color="#FFD700" />
            </TouchableOpacity>
        );
    }

    const emptyStarsCount = 5 - fullStars;
    for (let i = 0; i < emptyStarsCount; i++) {
        stars.push(
            <TouchableOpacity key={`empty-${i}`} onPress={() => onStarClick(fullStars + 1)}>
                <FontAwesomeIcon icon={faStar} size={24} color="#d3d3d3" />
            </TouchableOpacity>
        );
    }

    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
};
