import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { View, TouchableOpacity } from 'react-native';

export const renderStars = (rating, onStarClick) => {
    const fullStars = Math.floor(rating);
    const partialStar = rating - fullStars;

    let stars = [];

    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <TouchableOpacity key={`full-${i}`} onPress={() => onStarClick(i + 1)}>
                <FontAwesomeIcon
                    icon={faStar}
                    size={24}
                    color="#FFD700" // Yellow for full stars
                />
            </TouchableOpacity>
        );
    }

    if (partialStar > 0) {
        stars.push(
            <View key="partial" style={{ position: 'relative' }}>
                <FontAwesomeIcon 
                    icon={faStar} 
                    size={24} 
                    color="#d3d3d3" // Grey for empty portion
                    style={{ position: 'absolute' }} 
                />
                <View style={{ 
                    position: 'absolute', 
                    left: 0, 
                    width: `${partialStar * 100}%`, 
                    overflow: 'hidden'
                }}>
                    <FontAwesomeIcon 
                        icon={faStar} 
                        size={24} 
                        color="#FFD700" // Yellow for partial star
                    />
                </View>
            </View>
        );
    }

    const emptyStarsCount = 5 - (fullStars + partialStar);
    for (let i = 0; i < emptyStarsCount; i++) {
        stars.push(
            <TouchableOpacity key={`empty-${i}`} onPress={() => onStarClick(fullStars + 1)}>
                <FontAwesomeIcon
                    icon={faStar}
                    size={24}
                    color="#d3d3d3" // Grey for empty stars
                />
            </TouchableOpacity>
        );
    }

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {stars}
        </View>
    );
};
