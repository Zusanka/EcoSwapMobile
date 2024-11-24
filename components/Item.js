import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Modal } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import Navbar from "./Navbar";
import ChatWindow from "./ChatWindow"; 

const Item = () => {
    const [formData, setFormData] = useState(null);
    const [modalImageIndex, setModalImageIndex] = useState(null);
    const [isHeartFilled, setIsHeartFilled] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();

    useEffect(() => {
        // Pobieranie przekazanych danych z nawigacji
        if (route.params?.formData) {
            setFormData(route.params.formData);
        }
    }, [route.params]);

    if (!formData) {
        return <View style={styles.loadingContainer}><Text>Ładowanie danych...</Text></View>;
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
        <>
            <Navbar />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.itemDetailsContainer}>
                    <Text style={styles.title}>{formData.title}</Text>
                    
                    {formData.images && (
                        <View>
                            <TouchableOpacity onPress={() => openModal(0)}>
                                <Image
                                    source={{ uri: formData.images[0] }}
                                    style={styles.mainImage}
                                />
                                <TouchableOpacity onPress={toggleHeart} style={styles.heartButton}>
                                    <Icon name={isHeartFilled ? "heart" : "heart-o"} size={24} color="red" />
                                </TouchableOpacity>
                            </TouchableOpacity>

                            {formData.images.length > 1 && (
                                <ScrollView horizontal contentContainerStyle={styles.thumbnailContainer}>
                                    {formData.images.slice(1).map((image, index) => (
                                        <TouchableOpacity key={index} onPress={() => openModal(index + 1)}>
                                            <Image
                                                source={{ uri: image }}
                                                style={styles.thumbnail}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    )}

                    <Text style={styles.sectionTitle}>OPIS</Text>
                    <Text style={styles.description}>{formData.description}</Text>

                    <View style={styles.infoContainer}>
                        <Text>KATEGORIA: {formData.category}</Text>
                        <Text>MARKA: {formData.brand}</Text>
                        <Text>STAN: {formData.condition}</Text>
                    </View>
                </View>

                <View style={styles.buyContainer}>
                    <Text style={styles.priceLabel}>CENA</Text>
                    <Text style={styles.price}>{formData.price} zł</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("PersonDetails", { formData })}
                        style={styles.buyButton}
                    >
                        <Text style={styles.buyButtonText}>KUP TERAZ</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.contactContainer}>
                    <Text style={styles.contactLabel}>DANE KONTAKTOWE</Text>
                    <View style={styles.userInfoContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("User", { username: "truskawka123", phoneNumber: formData.phoneNumber, city: formData.city, userImage: "woman.png", email: formData.email })}>
                            <Image
                                source={require('../assets/woman.png')}
                                style={styles.userImage}
                            />
                        </TouchableOpacity>
                        <Text style={styles.username}>truskawka123</Text>
                    </View>
                    <Text>E-MAIL: {formData.email}</Text>
                    <Text>TELEFON: {formData.phoneNumber}</Text>
                    <Text>MIASTO: {formData.city}</Text>

                    <TouchableOpacity onPress={toggleChat} style={styles.chatButton}>
                        <Icon name="comment" size={18} color="white" />
                        <Text style={styles.chatButtonText}>Napisz w sprawie przedmiotu</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {modalImageIndex !== null && (
                <Modal visible={true} transparent={true}>
                    <View style={styles.modalContainer}>
                        <Image
                            source={{ uri: formData.images[modalImageIndex] }}
                            style={styles.modalImage}
                        />
                        <TouchableOpacity onPress={prevImage} style={styles.modalButtonLeft}>
                            <Icon name="chevron-left" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={nextImage} style={styles.modalButtonRight}>
                            <Icon name="chevron-right" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Icon name="times" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}

            {isChatOpen && (
                <ChatWindow
                    productName={formData.title}
                    productImage={formData.images[0]}
                    onClose={toggleChat}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    itemDetailsContainer: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    mainImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
    },
    heartButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 20,
        padding: 8,
    },
    thumbnailContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
    thumbnail: {
        width: 100,
        height: 75,
        borderRadius: 8,
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 16,
    },
    description: {
        fontSize: 16,
        marginTop: 8,
    },
    infoContainer: {
        marginTop: 16,
    },
    buyContainer: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    priceLabel: {
        fontSize: 14,
        color: "#6b7280",
    },
    price: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    buyButton: {
        backgroundColor: "#38a169",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buyButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    contactContainer: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    contactLabel: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 8,
    },
    userInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    username: {
        fontSize: 16,
        fontWeight: "bold",
    },
    chatButton: {
        backgroundColor: "#38a169",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
    },
    chatButtonText: {
        color: "white",
        marginLeft: 8,
        fontSize: 16,
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
    modalButtonLeft: {
        position: "absolute",
        left: 20,
        top: "50%",
    },
    modalButtonRight: {
        position: "absolute",
        right: 20,
        top: "50%",
    },
    closeButton: {
        position: "absolute",
        top: 40,
        right: 20,
    },
});

export default Item;
