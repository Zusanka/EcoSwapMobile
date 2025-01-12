import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomSelect from "./CustomSelect";
import ImageUploader from "./ImageUploader";
import BrandSelect from "./BrandSelect";
import Navbar from "./Navbar";
import { addNewItem } from "../api/api"; // Import API

const categoryOptions = [
    { value: "electronics", label: "Elektronika" },
    { value: "fashion", label: "Moda" },
    { value: "automotive", label: "Motoryzacja" },
    { value: "real_estate", label: "Nieruchomości" },
    { value: "home_garden", label: "Dom i Ogród" },
    { value: "sports", label: "Sport" },
    { value: "health_beauty", label: "Zdrowie i Uroda" },
    { value: "toys", label: "Zabawki" },
    { value: "books", label: "Książki" },
    { value: "music", label: "Muzyka" },
    { value: "movies", label: "Filmy" },
    { value: "collectibles", label: "Kolekcje" },
    { value: "pets", label: "Zwierzęta" },
    { value: "office_supplies", label: "Artykuły biurowe" },
    { value: "tools", label: "Narzędzia" },
    { value: "computers", label: "Komputery" },
    { value: "phones", label: "Telefony" },
    { value: "appliances", label: "AGD" },
    { value: "games", label: "Gry" },
    { value: "baby", label: "Dla Dzieci" },
    { value: "jewelry", label: "Biżuteria" },
    { value: "watches", label: "Zegarki" },
    { value: "crafts", label: "Rękodzieło" },
    { value: "services", label: "Usługi" },
];


const brandOptions = [
    // Elektronika
    { value: "apple", label: "Apple" },
    { value: "samsung", label: "Samsung" },
    { value: "sony", label: "Sony" },
    { value: "lg", label: "LG" },
    { value: "huawei", label: "Huawei" },
    { value: "dell", label: "Dell" },
    { value: "lenovo", label: "Lenovo" },
    { value: "hp", label: "HP" },
    { value: "bose", label: "Bose" },
    { value: "beats", label: "Beats" },

    // Odzież
    { value: "nike", label: "Nike" },
    { value: "adidas", label: "Adidas" },
    { value: "puma", label: "Puma" },
    { value: "reebok", label: "Reebok" },
    { value: "new_balance", label: "New Balance" },
    { value: "under_armour", label: "Under Armour" },
    { value: "zara", label: "Zara" },
    { value: "h&m", label: "H&M" },
    { value: "tommy_hilfiger", label: "Tommy Hilfiger" },
    { value: "calvin_klein", label: "Calvin Klein" },
    { value: "ralph_lauren", label: "Ralph Lauren" },
    { value: "guess", label: "Guess" },
    { value: "levis", label: "Levi's" },

    // Opcja dla innych marek
    { value: "other", label: "Marka inna" },
    { value: "none", label: "Brak" },
];


const conditionOptions = [
    { value: "new_with_tag", label: "Nowy z metką" },
    { value: "new_without_tag", label: "Nowy bez metki" },
    { value: "very_good", label: "Bardzo dobry" },
];

const advertisementTypeOptions = [
    { value: "free", label: "Za darmo" },
    { value: "exchange", label: "Na wymianę" },
    { value: "sell", label: "Sprzedaj" },
];

const AddItem = ({ navigation }) => {
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [city, setCity] = useState(""); // 🔹 Teraz jako zwykłe pole tekstowe
    const [selectedCondition, setSelectedCondition] = useState(null);
    const [selectedAdvertisementType, setSelectedAdvertisementType] = useState(null);
    const [price, setPrice] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                const storedToken = await AsyncStorage.getItem("token");

                if (storedUser && storedToken) {
                    setUser(JSON.parse(storedUser));
                    setToken(storedToken);
                } else {
                    Alert.alert("Błąd", "Musisz być zalogowany, aby dodać ogłoszenie.");
                    navigation.navigate("Login");
                }
            } catch (error) {
                console.error("Błąd pobierania użytkownika:", error);
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async () => {
        if (!user || !token) {
            Alert.alert("Błąd", "Nie jesteś zalogowany. Zaloguj się ponownie.");
            navigation.navigate("Login");
            return;
        }

        if (!title.trim() || !description.trim() || !selectedCategory || !selectedCondition || !selectedAdvertisementType || !city.trim()) {
            Alert.alert("Błąd", "Wszystkie pola muszą być wypełnione.");
            return;
        }

        const formData = {
            title,
            description,
            category: selectedCategory?.value,
            brand: selectedBrand?.value || null,
            condition: selectedCondition?.value,
            advertisementType: selectedAdvertisementType?.value,
            email: user.email,
            phoneNumber,
            city: city.trim(), // 🔹 Pobieramy miasto wpisane przez użytkownika
            images,
            price: selectedAdvertisementType?.value === "sell" ? price : null,
            userId: user.id,
        };

        try {
            await addNewItem(formData, token);
            Alert.alert("Sukces", "Ogłoszenie zostało dodane pomyślnie.");
            navigation.navigate("Home");
        } catch (error) {
          console.log(error);
            // if (error.response?.status === 401) {
            //     Alert.alert("Błąd autoryzacji", "Twoja sesja wygasła. Zaloguj się ponownie.");
            //     await AsyncStorage.removeItem("token");
            //     navigation.navigate("Login");
            // } else {
            //     Alert.alert("Błąd", error.message || "Nie udało się dodać ogłoszenia.");
            // }
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <Navbar />
                    <FlatList
                        data={[{ key: "form" }]}
                        keyExtractor={(item) => item.key}
                        renderItem={() => (
                            <View style={styles.formContainer}>
                                <Text style={styles.header}>Dodaj ogłoszenie</Text>

                                <ImageUploader images={images} onImageUpload={setImages} />

                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Tytuł ogłoszenia:</Text>
                                    <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="np. Nowa bluzka do oddania" />
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Opis ogłoszenia:</Text>
                                    <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Opisz swój przedmiot..." multiline />
                                </View>

                                <CustomSelect options={categoryOptions} value={selectedCategory} onChange={setSelectedCategory} placeholder="Wybierz kategorię" />
                                <BrandSelect options={brandOptions} value={selectedBrand} onChange={setSelectedBrand} placeholder="Wybierz markę" />
                                <CustomSelect options={conditionOptions} value={selectedCondition} onChange={setSelectedCondition} placeholder="Wybierz stan przedmiotu" />
                                <CustomSelect options={advertisementTypeOptions} value={selectedAdvertisementType} onChange={setSelectedAdvertisementType} placeholder="Wybierz rodzaj" />

                                {selectedAdvertisementType?.value === "sell" && <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="Podaj cenę" keyboardType="numeric" />}

                                <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Numer telefonu" keyboardType="phone-pad" />

                                {/* 🔹 Zmienione miasto z listy na pole tekstowe */}
                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Miasto:</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={city}
                                        onChangeText={setCity}
                                        placeholder="Wpisz miasto"
                                    />
                                </View>

                                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                    <Text style={styles.submitButtonText}>Dodaj ogłoszenie</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8f8" },
    innerContainer: { flex: 1 },
    formContainer: { padding: 20 },
    header: { fontSize: 24, fontWeight: "bold", color: "#1e3a8a", marginBottom: 20 },
    formGroup: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 5 },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, fontSize: 16, backgroundColor: "#fff" },
    textArea: { height: 100, textAlignVertical: "top" },
    submitButton: { backgroundColor: "#28a745", paddingVertical: 15, borderRadius: 25, alignItems: "center" },
    submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default AddItem;
