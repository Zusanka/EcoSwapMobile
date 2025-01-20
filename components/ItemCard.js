import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ItemCard = ({ item, onToggleFavorite }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate("Item", { itemId: item.itemId });
    };

    const handleToggleFavorite = () => {
        // Wywołanie funkcji z rodzica,
        // przekazujemy item i OBECNY stan (item.isFavorite)
        onToggleFavorite(item, item.isFavorite);
    };

    console.log(`ItemCard -> itemId=${item.itemId}, isFavorite=${item.isFavorite}`);

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            {item.images?.length > 0 ? (
                <Image source={{ uri: item.images[0] }} style={styles.image} />
            ) : (
                <View style={styles.noImageContainer}>
                    <Text style={styles.noImageText}>Brak zdjęcia</Text>
                </View>
            )}

            <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.brand}>Marka: {item.brand?.name || "Nieznana"}</Text>
                <Text style={styles.condition}>Stan: {item.condition}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {item.description || "Brak opisu"}
                </Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={handleToggleFavorite}
                    style={[
                        styles.favoriteButton,
                        item.isFavorite ? styles.removeFavoriteButton : styles.addFavoriteButton
                    ]}
                >
                    <Text style={styles.favoriteButtonText}>
                        {item.isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 200,
        margin: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        width: "100%",
        height: 120,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: "cover",
    },
    noImageContainer: {
        width: "100%",
        height: 120,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
    },
    noImageText: {
        fontSize: 14,
        color: "#777",
        textAlign: "center",
    },
    details: {
        padding: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    brand: {
        fontSize: 14,
        color: "#555",
        marginBottom: 5,
    },
    condition: {
        fontSize: 14,
        color: "#777",
        marginBottom: 5,
    },
    description: {
        fontSize: 12,
        color: "#999",
        marginBottom: 10,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    favoriteButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    addFavoriteButton: {
        backgroundColor: "#28a745", // Zielone tło
    },
    removeFavoriteButton: {
        backgroundColor: "#ff4d4d", // Czerwone tło
    },
    favoriteButtonText: {
        color: "#fff",
        fontSize: 14,
    },
});

export default ItemCard;
