import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    fetchItemById,
    addToFavorites,
    removeFromFavorites,
    checkIfFavorite,
} from "../api/api";
import { FontAwesome } from "@expo/vector-icons";

const Item = ({ route }) => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const navigation = useNavigation();

    const { itemId } = route.params || {};

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

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const itemData = await fetchItemById(itemId);

            if (user) {
                const isFavorite = await checkIfFavorite(itemId);
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
            if (formData.isFavorite) {
                await removeFromFavorites(itemId);
            } else {
                await addToFavorites(itemId);
            }
            const updatedStatus = await checkIfFavorite(itemId);
            setFormData((prevData) => ({
                ...prevData,
                isFavorite: updatedStatus,
            }));
        } catch (error) {
            console.error("Błąd przy aktualizacji ulubionych:", error);
        }
    };

    const handleSendMessage = () => {
        if (message.trim() === "") {
            return;
        }
        console.log("Wysłano wiadomość:", message);
        setMessage("");
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
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
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

                    <TouchableOpacity
                        style={[
                            styles.favoriteButton,
                            formData.isFavorite
                                ? styles.removeFavoriteButton
                                : styles.addFavoriteButton,
                        ]}
                        onPress={toggleFavorite}
                    >
                        <Text style={styles.favoriteButtonText}>
                            {formData.isFavorite
                                ? "Usuń z ulubionych"
                                : "Dodaj do ulubionych"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.messageInputContainer}>
                <TextInput
                    style={styles.messageInput}
                    placeholder="Zapytaj o ogłoszenie..."
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                >
                    <FontAwesome name="send" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8f8" },
    scrollContainer: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    imageSection: { marginBottom: 10 },
    mainImage: { width: "100%", height: 300, resizeMode: "cover" },
    noImageContainer: {
        width: "100%",
        height: 300,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
    },
    detailsSection: { padding: 16 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
    description: { fontSize: 16, color: "#666", marginBottom: 8 },
    favoriteButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: "center",
    },
    addFavoriteButton: {
        backgroundColor: "#28a745",
    },
    removeFavoriteButton: {
        backgroundColor: "red",
        marginLeft: 20,
        marginRight: 20,
    },
    favoriteButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    messageInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#fff",
    },
    messageInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        marginBottom: 20,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#007bff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
});

export default Item;
