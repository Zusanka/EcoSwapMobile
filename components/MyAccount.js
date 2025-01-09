import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import PersonalDetails from "./PersonalDetails";

const MyAccount = () => {
    const [userData, setUserData] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [address, setAddress] = useState({
        streetName: "",
        houseNumber: "",
        apartmentNumber: "",
        postalCode: "",
        city: "",
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                Alert.alert("Błąd", "Brak tokena autoryzacyjnego.");
                return;
            }

            const userInfo = JSON.parse(token);

            const response = await fetch(`http://192.168.1.108:8080/api/users/username/${userInfo.username}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${userInfo.token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Błąd pobierania danych użytkownika.");
            }

            const data = await response.json();
            setUserData(data);

            if (data.address) {
                setAddress({
                    streetName: data.address.street || "",
                    houseNumber: data.address.houseNumber || "",
                    apartmentNumber: data.address.apartmentNumber || "",
                    postalCode: data.address.postalCode || "",
                    city: data.address.city || "",
                });
            }

            fetchProfilePicture(data.userId, userInfo.token);
        } catch (error) {
            console.error("Błąd pobierania danych użytkownika:", error);
            Alert.alert("Błąd", "Nie udało się pobrać danych użytkownika.");
        }
    };

    const fetchProfilePicture = async (userId, token) => {
        try {
            const response = await fetch(`http://192.168.1.108:8080/api/users/${userId}/profile-picture`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            });

            if (response.ok) {
                const imageData = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => setProfilePicture(reader.result);
                reader.readAsDataURL(imageData);
            }
        } catch (error) {
            console.error("Błąd pobierania zdjęcia profilowego:", error);
        }
    };

    const handleSelectProfilePicture = async () => {
        try {
            let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert("Brak uprawnień", "Musisz nadać aplikacji dostęp do zdjęć.");
                return;
            }

            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!pickerResult.canceled) {
                setProfilePicture(pickerResult.assets[0].uri);
                uploadProfilePicture(pickerResult.assets[0].uri);
            }
        } catch (error) {
            console.error("Błąd wyboru zdjęcia:", error);
        }
    };

    const uploadProfilePicture = async (imageUri) => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                Alert.alert("Błąd", "Brak tokena autoryzacyjnego.");
                return;
            }

            const userInfo = JSON.parse(token);
            const base64Image = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });

            if (!base64Image) {
                Alert.alert("Błąd", "Nie udało się przetworzyć obrazu.");
                return;
            }

            const response = await fetch(`http://192.168.1.108:8080/api/users/${userData.userId}/profile-picture`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${userInfo.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ profilePicture: base64Image }),
            });

            if (!response.ok) {
                throw new Error("Błąd podczas aktualizacji zdjęcia.");
            }

            Alert.alert("Sukces", "Zdjęcie profilowe zostało zaktualizowane.");
            fetchUserData();
        } catch (error) {
            console.error("Błąd aktualizacji zdjęcia:", error);
            Alert.alert("Błąd", "Nie udało się zaktualizować zdjęcia.");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.editIcon} onPress={handleSelectProfilePicture}>
                        <FontAwesome name="camera" size={20} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.imageContainer}>
                        {profilePicture ? (
                            <Image source={{ uri: profilePicture }} style={styles.image} />
                        ) : (
                            <FontAwesome name="user-circle" size={80} color="#fff" />
                        )}
                    </View>

                    <Text style={styles.login}>Login: {userData?.username}</Text>
                    <Text style={styles.joinDate}>Dołączył: {userData?.createdAt}</Text>
                </View>

                <PersonalDetails
                    isCollapsed={isCollapsed}
                    toggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    name={userData?.firstName}
                    surname={userData?.lastName}
                    phoneNumber={userData?.phoneNumber}
                    streetName={address.streetName}
                    houseNumber={address.houseNumber}
                    apartmentNumber={address.apartmentNumber}
                    postalCode={address.postalCode}
                    city={address.city}
                />

                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

// ✅ **Dodany brakujący obiekt `styles`**
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8f8" },
    header: { alignItems: "center", paddingVertical: 20, backgroundColor: "#28a745" },
    editIcon: { position: "absolute", top: 10, right: 10, padding: 10, borderRadius: 20, backgroundColor: "#007AFF" },
    imageContainer: { width: 100, height: 100, borderRadius: 50, overflow: "hidden", backgroundColor: "#ccc" },
    image: { width: "100%", height: "100%" },
    login: { fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 10 },
    joinDate: { fontSize: 14, color: "#ddd" },
    saveButton: {
        backgroundColor: "#28a745",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        margin: 20,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default MyAccount;
