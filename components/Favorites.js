// Favorites.js
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "./Navbar";
import { fetchFavorites, removeFromFavorites } from "../api/api";

const Favorites = () => {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Sprawdzenie użytkownika po montażu komponentu
    useEffect(() => {
        const checkUser = async () => {
            try {
                const userData = await AsyncStorage.getItem("user");
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                }
            } catch (err) {
                console.log("Error reading user data from AsyncStorage:", err);
            }
        };
        checkUser();
    }, []);

    // Pobranie ulubionych przedmiotów po ustawieniu użytkownika
    useEffect(() => {
        if (user) {
            fetchUserFavorites();
        } else {
            setFavorites([]);
            setLoading(false);
        }
    }, [user]);

    const fetchUserFavorites = async () => {
        setLoading(true);
        try {
            const fetchedFavorites = await fetchFavorites();
            setFavorites(fetchedFavorites);
        } catch (error) {
            console.error("Błąd podczas pobierania ulubionych przedmiotów:", error);
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchUserFavorites();
        } catch (error) {
            console.error("Błąd podczas odświeżania ulubionych przedmiotów:", error);
        } finally {
            setRefreshing(false);
        }
    };

    // Funkcja do usuwania przedmiotu z ulubionych z potwierdzeniem
    const handleRemoveFavorite = (item) => {
        Alert.alert(
            "Usuń z Ulubionych",
            `Czy na pewno chcesz usunąć "${item.name}" z ulubionych?`,
            [
                {
                    text: "Anuluj",
                    style: "cancel",
                },
                {
                    text: "Usuń",
                    onPress: async () => {
                        try {
                            await removeFromFavorites(item.itemId);
                            // Aktualizacja listy ulubionych po usunięciu
                            setFavorites((prevFavorites) =>
                                prevFavorites.filter((favItem) => favItem.itemId !== item.itemId)
                            );
                            console.log(`Usunięto przedmiot o ID=${item.itemId} z ulubionych.`);
                            // Wyświetlenie potwierdzenia dla użytkownika
                            Alert.alert(
                                "Sukces",
                                `Usunięto "${item.name}" z ulubionych.`,
                                [{ text: "OK" }],
                                { cancelable: true }
                            );
                        } catch (error) {
                            console.error("Błąd podczas usuwania przedmiotu z ulubionych:", error);
                            Alert.alert(
                                "Błąd",
                                "Nie udało się usunąć przedmiotu z ulubionych. Spróbuj ponownie.",
                                [{ text: "OK" }],
                                { cancelable: true }
                            );
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            {item.mainImage? (
                <Image
                    source={{
                        uri: `data:image/jpeg;base64,${item.mainImage}`,
                    }}
                    style={styles.itemImage}
                />
            ) : (
                <View style={styles.noImageContainer}>
                    <Text style={styles.noImageText}>Brak zdjęcia</Text>
                </View>
            )}

            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemBrand}>Marka: {item.brand?.name || "Nieznana"}</Text>
                <Text style={styles.itemCondition}>Stan: {item.condition}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                    {item.description || "Brak opisu"}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFavorite(item)}
            >
                <Text style={styles.removeButtonText}>Usuń z Ulubionych</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Ładowanie ulubionych przedmiotów...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {user && <Navbar />}

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Twoje Ulubione</Text>
            </View>

            {favorites.length > 0 ? (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.itemId.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nie masz żadnych ulubionych przedmiotów.</Text>
                </View>
            )}
        </View>
    );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        padding: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#555",
    },
    itemContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 10,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    itemImage: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
    },
    noImageContainer: {
        width: "100%",
        height: 200,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
    },
    noImageText: {
        fontSize: 14,
        color: "#777",
    },
    itemDetails: {
        padding: 10,
    },
    itemName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    itemBrand: {
        fontSize: 14,
        color: "#555",
        marginBottom: 5,
    },
    itemCondition: {
        fontSize: 14,
        color: "#777",
        marginBottom: 5,
    },
    itemDescription: {
        fontSize: 14,
        color: "#999",
        marginBottom: 10,
    },
    removeButton: {
        backgroundColor: "red",
        paddingVertical: 10,
        alignItems: "center",
    },
    removeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Favorites;
