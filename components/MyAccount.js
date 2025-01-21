import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import {
    getUserData,
    updateProfilePicture,
    getProfilePicture,
    updateDescription,
    updateDetails,
} from "../api/api";

const MyAccount = () => {
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [description, setDescription] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userStr = await AsyncStorage.getItem("user");
                if (!userStr) throw new Error("Brak danych użytkownika");

                const user = JSON.parse(userStr);
                setUserId(user.id);

                const userData = await getUserData(user.id);
                setLogin(userData.username || "");
                setEmail(userData.email || "");
                setName(userData.firstName || "");
                setSurname(userData.lastName || "");
                setPhoneNumber(userData.phoneNumber || "");
                setDescription(userData.description || "");

                const profilePicBase64 = await getProfilePicture(user.id);
                if (profilePicBase64) {
                    const uri = `data:image/jpeg;base64,${profilePicBase64}`;
                    setProfileImage(uri);
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);



    const pickImage = async () => {
        if (!userId) {
            Alert.alert("Błąd", "Brak ID użytkownika. Zaloguj się ponownie.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            try {
                const base64Image = result.assets[0].base64;
                if (!base64Image) throw new Error("Błąd konwersji zdjęcia");

                setProfileImage(`data:image/jpeg;base64,${base64Image}`);

                await updateProfilePicture(userId, base64Image);
                Alert.alert("Sukces", "Zdjęcie profilowe zaktualizowane.");
            } catch (err) {
                Alert.alert("Błąd", err.message);
            }
        }
    };

    const handleSave = async () => {
        if (!userId) {
            Alert.alert("Błąd", "Brak ID użytkownika. Zaloguj się ponownie.");
            return;
        }

        try {
            await updateDetails(userId, name, surname, phoneNumber);
            await updateDescription(userId, description);

            Alert.alert("Sukces", "Dane zostały zapisane.");
            setIsEditing(false);
        } catch (error) {
            Alert.alert("Błąd", "Nie udało się zapisać zmian.");
            console.error("Błąd aktualizacji danych:", error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.addImageText}>Dodaj zdjęcie</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Login: {login}</Text>
            <TextInput value={name} onChangeText={setName} editable={isEditing} placeholder="Imię" style={styles.input} />
            <TextInput value={surname} onChangeText={setSurname} editable={isEditing} placeholder="Nazwisko" style={styles.input} />
            <TextInput value={email} editable={false} placeholder="Email" style={[styles.input, styles.disabledInput]} />
            <TextInput value={phoneNumber} onChangeText={setPhoneNumber} editable={isEditing} placeholder="Numer telefonu" style={styles.input} />
            <TextInput value={description} onChangeText={setDescription} editable={isEditing} placeholder="Opis" style={[styles.input, styles.textArea]} multiline />

            {isEditing ? (
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.buttonText}>Zapisz</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                    <Text style={styles.buttonText}>Edytuj</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorText: { color: "red", textAlign: "center" },
    imageContainer: { alignItems: "center", marginBottom: 20 },
    imageWrapper: { width: 120, height: 120, borderRadius: 60, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0" },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60, // Dla okrągłego obrazu
        resizeMode: "cover", // Dopasowanie obrazu do kontenera
        backgroundColor: "#ccc", // Tło na wypadek braku obrazu
    },

    placeholder: { alignItems: "center", justifyContent: "center", width: "100%", height: "100%" },
    addImageText: { color: "#000", fontSize: 16, textAlign: "center" },
    label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 16 },
    disabledInput: { backgroundColor: "#eee" },
    textArea: { height: 80 },
    editButton: { backgroundColor: "blue", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
    saveButton: { backgroundColor: "green", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
const checkToken = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log("TOKEN PRZECHOWYWANY W AsyncStorage:", token);
};
checkToken();
export default MyAccount;