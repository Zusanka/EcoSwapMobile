import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    fetchItemById,
    addToFavorites,
    removeFromFavorites,
    checkIfFavorite,
} from "../api/api";

const Item = ({ route }) => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const { itemId } = route.params || {};

    // 1. Sprawdź użytkownika po montażu komponentu
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

    // 2. Pobierz dane przedmiotu po ustawieniu użytkownika
    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const itemData = await fetchItemById(itemId);
            console.log("Fetched item data:", itemData);

            if (user) {
                const isFavorite = await checkIfFavorite(itemId);
                console.log(`Status ulubionych dla ${itemId}: ${isFavorite}`);
                setFormData({
                    ...itemData,
                    isFavorite: isFavorite,
                });
            } else {
                setFormData({
                    ...itemData,
                    isFavorite: false,
                });
            }
        } catch (error) {
            console.error("Błąd pobierania danych przedmiotu:", error);
            setFormData(null);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async () => {
        if (!formData) return;
        try {
            console.log(`Toggling favorite for itemId=${itemId}, current status: ${formData.isFavorite}`);
            if (formData.isFavorite) {
                // Usuwamy z ulubionych
                await removeFromFavorites(itemId);
            } else {
                // Dodajemy do ulubionych
                await addToFavorites(itemId);
            }

            // Pobierz aktualny status z backendu
            const updatedStatus = await checkIfFavorite(itemId);
            console.log(`Po aktualizacji, status ulubionych dla ${itemId}: ${updatedStatus}`);

            // Zaktualizuj stan formData
            setFormData((prevData) => ({
                ...prevData,
                isFavorite: updatedStatus,
            }));
        } catch (error) {
            console.error("Błąd przy aktualizacji ulubionych:", error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Ładowanie danych...</Text>
            </View>
        );
    }

    if (!formData) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Nie udało się załadować danych przedmiotu.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageSection}>
                {formData.images?.length > 0 ? (
                    <Image source={{ uri: formData.images[0] }} style={styles.mainImage} />
                ) : (
                    <View style={styles.noImageContainer}>
                        <Text>Brak zdjęcia</Text>
                    </View>
                )}
            </View>

            <View style={styles.detailsSection}>
                <Text style={styles.title}>{formData.name}</Text>
                <Text style={styles.description}>{formData.description}</Text>

                <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
                    <Text style={styles.favoriteButtonText}>
                        {formData.isFavorite ? "💔 Usuń z ulubionych" : "❤️ Dodaj do ulubionych"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8f8" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    imageSection: { marginBottom: 10 },
    mainImage: { width: "100%", height: 300, resizeMode: "cover" },
    noImageContainer: { width: "100%", height: 300, backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center" },
    detailsSection: { padding: 16 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
    description: { fontSize: 16, color: "#666", marginBottom: 8 },
    favoriteButton: { backgroundColor: "#28a745", padding: 10, borderRadius: 5, alignItems: "center" },
    favoriteButtonText: { color: "#fff", fontSize: 16 },
});

export default Item;
