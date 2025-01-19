import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import ChatWindow from "./ChatWindow";
import { fetchItemById } from "../api/api"; // Funkcja do pobierania szczegółów przedmiotu z API

const Item = ({ route, navigation }) => {
    const [formData, setFormData] = useState(null); // Dane przedmiotu
    const [modalImageIndex, setModalImageIndex] = useState(null);
    const [isHeartFilled, setIsHeartFilled] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const { itemId } = route.params || {}; // Odczytanie ID przedmiotu z parametrów nawigacji

    useEffect(() => {
        const fetchItemData = async () => {
            try {
                if (!itemId) throw new Error("Brak ID przedmiotu");
                const itemData = await fetchItemById(itemId); // Pobranie danych przedmiotu z API
                setFormData(itemData);
            } catch (error) {
                console.error("Błąd pobierania danych przedmiotu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItemData();
    }, [itemId]);

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

    const openModal = (index) => {
        setModalImageIndex(index);
    };

    const closeModal = () => {
        setModalImageIndex(null);
    };

    const nextImage = () => {
        setModalImageIndex((prevIndex) => (prevIndex + 1) % formData.images.length);
    };

    const prevImage = () => {
        setModalImageIndex((prevIndex) => (prevIndex - 1 + formData.images.length) % formData.images.length);
    };

    const toggleHeart = () => {
        setIsHeartFilled((prev) => !prev);
    };

    const toggleChat = () => {
        setIsChatOpen((prev) => !prev);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageSection}>
                <Image
                    source={{ uri: formData.images[0] }}
                    style={styles.mainImage}
                />
                <TouchableOpacity style={styles.heartButton} onPress={toggleHeart}>
                    <FontAwesome
                        name={isHeartFilled ? "heart" : "heart-o"}
                        size={24}
                        color="red"
                    />
                </TouchableOpacity>
                <ScrollView horizontal style={styles.imageScroll}>
                    {formData.images.map((image, index) => (
                        <TouchableOpacity key={index} onPress={() => openModal(index)}>
                            <Image source={{ uri: image }} style={styles.thumbnailImage} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.detailsSection}>
                <Text style={styles.title}>{formData.name}</Text>
                <Text style={styles.description}>{formData.description}</Text>
                <Text style={styles.label}>Kategoria: {formData.category?.name || "Nieznana"}</Text>
                <Text style={styles.label}>Marka: {formData.brand?.name || "Nieznana"}</Text>
                <Text style={styles.label}>Stan: {formData.condition}</Text>
                <Text style={styles.label}>Cena: {formData.price} zł</Text>
                <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => navigation.navigate("PersonDetails", { formData })}
                >
                    <Text style={styles.buyButtonText}>KUP TERAZ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chatButton} onPress={toggleChat}>
                    <FontAwesome name="comment" size={20} color="#fff" />
                    <Text style={styles.chatButtonText}>Napisz w sprawie przedmiotu</Text>
                </TouchableOpacity>
            </View>

            {modalImageIndex !== null && (
                <Modal visible transparent animationType="fade">
                    <View style={styles.modalContainer}>
                        <Image
                            source={{ uri: formData.images[modalImageIndex] }}
                            style={styles.modalImage}
                        />
                        <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
                            <FontAwesome name="times" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalPrev} onPress={prevImage}>
                            <FontAwesome name="chevron-left" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalNext} onPress={nextImage}>
                            <FontAwesome name="chevron-right" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}

            {isChatOpen && (
                <ChatWindow
                    productName={formData.name}
                    productImage={formData.images[0]}
                    onClose={toggleChat}
                />
            )}
        </ScrollView>
    );
};

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
    imageSection: {
        position: "relative",
    },
    mainImage: {
        width: "100%",
        height: 300,
        resizeMode: "cover",
    },
    heartButton: {
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 16,
    },
    imageScroll: {
        flexDirection: "row",
        marginTop: 8,
        paddingHorizontal: 8,
    },
    thumbnailImage: {
        width: 80,
        height: 80,
        marginRight: 8,
        borderRadius: 8,
    },
    detailsSection: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: "#666",
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: "#333",
        marginBottom: 4,
    },
    buyButton: {
        backgroundColor: "#28a745",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 16,
    },
    buyButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    chatButton: {
        flexDirection: "row",
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    chatButtonText: {
        color: "#fff",
        fontSize: 16,
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalImage: {
        width: "90%",
        height: "70%",
        resizeMode: "contain",
    },
    modalClose: {
        position: "absolute",
        top: 40,
        right: 20,
    },
    modalPrev: {
        position: "absolute",
        left: 20,
        top: "50%",
        marginTop: -20,
    },
    modalNext: {
        position: "absolute",
        right: 20,
        top: "50%",
        marginTop: -20,
    },
});

export default Item;
