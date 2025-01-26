import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    TextInput,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    fetchItemById,
    addToFavorites,
    removeFromFavorites,
    checkIfFavorite,
    startConversation,
    deleteItem,
    getUserItems,
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
                    isOwner: itemData.user.userId === user.id,
                });
            } else {
                setFormData({
                    ...itemData,
                    isFavorite: false,
                    isOwner: false,
                });
            }
        } catch (error) {
            console.error("Błąd pobierania danych przedmiotu:", error);
            setFormData(null);
        } finally {
            setLoading(false);
        }
    };

    const isValidBase64 = (str) => {
        if (typeof str !== "string") return false;
        const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
        return base64Regex.test(str);
    };

    const toggleFavorite = async () => {
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

    const handleSendMessage = async () => {
        if (message.trim() === "") {
            return;
        }

        try {
            const conversationData = {
                senderName: user.name,
                content: message.trim(),
                sentAt: new Date().toISOString(),
            };

            const newConversation = await startConversation(formData.itemId, message);
            console.log("Rozpoczęto nową rozmowę:", newConversation);
            setMessage("");
            navigation.navigate("Messages", {
                conversationId: newConversation.conversationId,
            });
        } catch (error) {
            console.error("Błąd przy rozpoczynaniu rozmowy:", error.message);
            alert("Nie udało się rozpocząć rozmowy. Spróbuj ponownie.");
        }
    };

    const handleDeleteItem = async () => {
        Alert.alert(
            "Potwierdzenie",
            "Czy na pewno chcesz usunąć to ogłoszenie?",
            [
                { text: "Anuluj", style: "cancel" },
                {
                    text: "Usuń",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteItem(itemId);
                            alert("Ogłoszenie zostało usunięte.");
                            navigation.goBack();
                        } catch (error) {
                            console.error("Błąd przy usuwaniu ogłoszenia:", error.message);
                            alert("Nie udało się usunąć ogłoszenia.");
                        }
                    },
                },
            ]
        );
    };

    const handleFinishItem = () => {
        alert("Funkcja zakończenia ogłoszenia nie została jeszcze zaimplementowana.");
    };

    const handleBuyItem = () => {
        Alert.alert(
            "Kupno",
            "Czy na pewno chcesz kupić ten przedmiot?",
            [
                { text: "Anuluj", style: "cancel" },
                {
                    text: "Kup",
                    onPress: () => {
                        navigation.navigate("Purchase", { item: formData });
                    },
                },
            ]
        );
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
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.imageCarousel}
                        >
                            {formData.images.map((item, index) => (
                                <View key={index} style={styles.carouselImageContainer}>
                                    <Image
                                        source={{ uri: `data:image/jpeg;base64,${item.image}` }}
                                        style={styles.carouselImage}
                                    />
                                </View>
                            ))}
                        </ScrollView>
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

                    {formData.isOwner ? (
                        <View style={styles.ownerActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.deleteButton]}
                                onPress={handleDeleteItem}
                            >
                                <Text style={styles.actionButtonText}>Usuń ogłoszenie</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.finishButton]}
                                onPress={handleFinishItem}
                            >
                                <Text style={styles.actionButtonText}>Edytuj ogłoszenie</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.ownerActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.buyButton]}
                                onPress={handleBuyItem}
                            >
                                <Text style={styles.actionButtonText}>Kup</Text>
                            </TouchableOpacity>
                        </View>
                    )}
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
        marginTop: 10,
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
    ownerActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginTop: 20,
    },
    actionButton: {
        flex: 1,
        padding: 10,
        borderRadius: 20,
        alignItems: "center",
        marginHorizontal: 5,
    },
    deleteButton: {
        backgroundColor: "red",
    },
    finishButton: {
        backgroundColor: "blue",
    },
    buyButton: {
        backgroundColor: "#ffc107",
    },
    actionButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    imageCarousel: {
        height: 300,
        marginBottom: 10,
    },
    carouselImageContainer: {
        width: 300,
        marginRight: 10,
        borderRadius: 10,
        overflow: "hidden",
    },
    carouselImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
});

export default Item;
