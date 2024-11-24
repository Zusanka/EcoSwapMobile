import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

const ItemCard = ({ item, likedItems, handleLikeClick }) => {
    return (
        <View key={item.id} style={styles.cardContainer}>
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: item.image }}
                    style={styles.image}
                />
                <TouchableOpacity
                    onPress={() => handleLikeClick(item.id)}
                    style={styles.likeButton}
                >
                    <FontAwesomeIcon
                        icon={likedItems[item.id] ? faHeartSolid : faHeartRegular}
                        size={24}
                        color="red"
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDate}>Dodano: {item.dateAdded}</Text>
            <Text style={styles.itemPrice}>Cena: ${item.price}</Text>
            <Text style={styles.itemBrand}>Marka: {item.brand}</Text>
            <Text style={styles.itemCategory}>Kategoria: {item.category}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: 150,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    imageContainer: {
        width: '100%',
        height: 150,
        marginBottom: 10,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    likeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    itemName: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    itemDate: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    itemBrand: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
        marginBottom: 2,
    },
    itemCategory: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
    },
});

export default ItemCard;
