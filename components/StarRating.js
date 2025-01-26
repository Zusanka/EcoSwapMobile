import React from 'react';
import { View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegStar } from '@fortawesome/free-regular-svg-icons';

export const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        stars.push(<FontAwesomeIcon key={`star-full-${i}`} icon={faStar} size={16} color="#FFD700" />);
    }

    if (hasHalfStar) {
        stars.push(<FontAwesomeIcon key={`star-half`} icon={faStarHalfAlt} size={16} color="#FFD700" />);
    }

    while (stars.length < 5) {
        stars.push(<FontAwesomeIcon key={`star-empty-${stars.length}`} icon={faRegStar} size={16} color="#FFD700" />);
    }

    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
};
