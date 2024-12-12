import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const ItemCard = ({ item = {}, likedItems = {}, handleLikeClick = () => {} }) => {
    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item?.image || "https://via.placeholder.com/150" }}
                    style={styles.image}
                />
                <TouchableOpacity
                    style={styles.likeButton}
                    onPress={() => handleLikeClick(item?.id)}
                >
                    <FontAwesome
                        name={likedItems[item?.id] ? "heart" : "heart-o"}
                        size={24}
                        color="red"
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.name}>{item?.name || "Brak nazwy"}</Text>
            <Text style={styles.dateAdded}>Dodano: {item?.dateAdded || "Nieznana data"}</Text>
            <Text style={styles.price}>Cena: {item?.price || "0.00"} zł</Text>
            <Text style={styles.details}>Marka: {item?.brand || "Nieznana marka"}</Text>
            <Text style={styles.details}>Kategoria: {item?.category || "Nieznana kategoria"}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    card: {
        width: 160,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        alignItems: "center",
        margin: 8,
    },
    imageContainer: {
        position: "relative",
        width: "100%",
        height: 120,
        marginBottom: 12,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
        resizeMode: "cover",
    },
    likeButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#fff",
        padding: 4,
        borderRadius: 16,
    },
    name: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    dateAdded: {
        fontSize: 12,
        color: "#777",
        textAlign: "center",
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginVertical: 4,
    },
    details: {
        fontSize: 12,
        color: "#777",
        textAlign: "center",
    },
});

export default ItemCard;
