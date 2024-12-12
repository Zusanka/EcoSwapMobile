import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const MyAccount = () => {
    const [images, setImages] = useState([]);
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [street, setStreet] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [apartmentNumber, setApartmentNumber] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [city, setCity] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cvvNumber, setCvvNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [joinDate, setJoinDate] = useState("");
    const [activeTab, setActiveTab] = useState("personalData");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const savedLogin = "user123";
        const savedEmail = "example@email.com";
        const savedJoinDate = "2024-01-01";
        if (savedLogin) setLogin(savedLogin);
        if (savedEmail) setEmail(savedEmail);
        if (savedJoinDate) setJoinDate(savedJoinDate);
    }, []);

    const handleToggleEdit = () => setIsEditing(!isEditing);

    const handleSave = () => {
        // Save data logic
        setIsEditing(false);
    };

    const handleCardNumberChange = (value) => {
        const formattedValue = value
            .replace(/\D/g, "")
            .slice(0, 16)
            .replace(/(\d{4})(?=\d)/g, "$1 ");
        setCardNumber(formattedValue);
    };

    const handleExpirationDateChange = (value) => {
        const formattedValue = value.replace(/[^0-9]/g, "").slice(0, 4);
        const formatted = formattedValue.replace(/(\d{2})/, "$1/");
        setExpirationDate(formatted);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleToggleEdit}
                    >
                        <FontAwesome name={isEditing ? "times" : "edit"} size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.imageContainer}>
                        {images.length ? (
                            <Image source={{ uri: images[0] }} style={styles.image} />
                        ) : (
                            <Text style={styles.noImageText}>Brak zdjęcia</Text>
                        )}
                    </View>
                    <Text style={styles.login}>Login: {login}</Text>
                    <Text style={styles.joinDate}>
                        Data dołączenia: {joinDate ? joinDate : "Brak danych"}
                    </Text>
                </View>

                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === "personalData" && styles.activeTab,
                        ]}
                        onPress={() => setActiveTab("personalData")}
                    >
                        <Text style={styles.tabText}>Dane osobowe</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === "address" && styles.activeTab,
                        ]}
                        onPress={() => setActiveTab("address")}
                    >
                        <Text style={styles.tabText}>Adres zamieszkania</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === "cards" && styles.activeTab,
                        ]}
                        onPress={() => setActiveTab("cards")}
                    >
                        <Text style={styles.tabText}>Moje karty</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {activeTab === "personalData" && (
                        <View>
                            <Text style={styles.label}>E-mail:</Text>
                            {isEditing ? (
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.input}
                                />
                            ) : (
                                <Text style={styles.value}>{email}</Text>
                            )}
                        </View>
                    )}

                    {activeTab === "address" && (
                        <View>
                            <Text style={styles.label}>Ulica:</Text>
                            {isEditing ? (
                                <TextInput
                                    value={street}
                                    onChangeText={setStreet}
                                    style={styles.input}
                                />
                            ) : (
                                <Text style={styles.value}>{street}</Text>
                            )}
                        </View>
                    )}

                    {activeTab === "cards" && (
                        <View>
                            <Text style={styles.label}>Numer Karty:</Text>
                            {isEditing ? (
                                <TextInput
                                    value={cardNumber}
                                    onChangeText={handleCardNumberChange}
                                    style={styles.input}
                                />
                            ) : (
                                <Text style={styles.value}>{cardNumber}</Text>
                            )}
                        </View>
                    )}

                    {isEditing && (
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <FontAwesome name="save" size={18} color="#fff" />
                            <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    header: {
        alignItems: "center",
        backgroundColor: "#007bff",
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    editButton: {
        position: "absolute",
        top: 20,
        right: 20,
        backgroundColor: "#007bff",
        borderRadius: 50,
        padding: 10,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: "hidden",
        backgroundColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    noImageText: {
        color: "#666",
    },
    login: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 10,
    },
    joinDate: {
        fontSize: 14,
        color: "#ddd",
    },
    tabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    tabButton: {
        paddingVertical: 10,
    },
    tabText: {
        fontSize: 16,
        color: "#007bff",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: "#007bff",
    },
    content: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: "#555",
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: "#007bff",
        borderRadius: 5,
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    saveButtonText: {
        color: "#fff",
        marginLeft: 5,
    },
});

export default MyAccount;
