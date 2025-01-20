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
import Navbar from "./Navbar";
import ImageUploader from "./ImageUploader";
import CustomSelect from "./CustomSelect";

import { addNewItem, getCategories, getBrands, getSubcategories } from "../api/api";

// Mapa stanów na wartości w API
const conditionMap = {
    //NOWY, BARDZO_DOBRY, DOBRY, DOSTATECZNY
    new_with_tag: "NOWY",
    very_good: "BARDZO_DOBRY",
    good: "DOBRY",
    enough: "DOSTATECZNY",
};

// Mapa rodzajów aukcji na wartości w API
const auctionTypeMap = {
    free: "ZA_DARMO",
    exchange: "WYMIANA",
    sell: "SPRZEDAZ",
};

// Opcje do selecta
const conditionOptions = [
    { value: "new_with_tag", label: "Nowy" },
    { value: "very_good", label: "Prawie nowy" },
    { value: "good", label: "Dobry" },
    { value: "enough", label: "Dostateczny" },
];
const advertisementTypeOptions = [
    { value: "free", label: "Za darmo" },
    { value: "exchange", label: "Na wymianę" },
    { value: "sell", label: "Sprzedaj" },
];

const AddItem = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedCondition, setSelectedCondition] = useState(null);
    const [selectedAdvertisementType, setSelectedAdvertisementType] = useState(null);

    const [price, setPrice] = useState("");

    const [user, setUser] = useState(null);

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // Pobieramy usera z AsyncStorage
    const fetchUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            const storedToken = await AsyncStorage.getItem("token");

            if (!storedUser || !storedToken) {
                Alert.alert("Błąd", "Musisz być zalogowany, aby dodać ogłoszenie.");
                navigation.navigate("Login");
                return;
            }
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

        } catch (error) {
            console.error("Błąd pobierania użytkownika:", error);
        }
    };

    // Pobranie kategorii
    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            const mappedCategories = (data || []).map((cat) => ({
                value: cat.mainCategoryId,
                label: cat.name,
            }));
            setCategories(mappedCategories);
        } catch (error) {
            console.error("Błąd pobierania kategorii:", error);
            setCategories([]);
        }
    };

    // Pobranie subkategorii po wyborze kategorii
    const fetchSubcategories = async (categoryId) => {
        try {
            const data = await getSubcategories(categoryId);

            const mappedSubcategories = (data || []).map((sub) => ({
                value: sub.subcategoryId,
                label: sub.name,
            }));
            setSubcategories(mappedSubcategories);
        } catch (error) {
            console.error("Błąd pobierania subkategorii:", error);
            setSubcategories([]);
        }
    };

    useEffect(() => {
        if (selectedCategory) {
            fetchSubcategories(selectedCategory.value);
            setSelectedSubcategory(null); // Resetujemy subkategorię po zmianie kategorii
        }
    }, [selectedCategory]);

    // Pobranie marek
    const fetchBrands = async () => {
        try {
            const data = await getBrands();
            const mappedBrands = (data || []).map((brand) => ({
                value: brand.brandId,
                label: brand.name,
            }));
            setBrands(mappedBrands);
        } catch (error) {
            console.error("Błąd pobierania marek:", error);
            setBrands([]);
        }
    };

    useEffect(() => {
        fetchUser().then(() => {
            fetchCategories();
            fetchBrands();
        });
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchSubcategories(selectedCategory.value);
            setSelectedSubcategory(null); // Resetujemy subkategorię po zmianie kategorii
        }
    }, [selectedCategory]);

    // Dodawanie ogłoszenia
    const handleSubmit = async () => {
        if (!user) {
            Alert.alert("Błąd", "Nie jesteś zalogowany. Zaloguj się ponownie.");
            navigation.navigate("Login");
            return;
        }

        if (
            !title.trim() ||
            !selectedCategory ||
            !selectedSubcategory ||
            !selectedCondition ||
            !selectedAdvertisementType
        ) {
            Alert.alert("Błąd", "Wszystkie obowiązkowe pola muszą być wypełnione.");
            return;
        }

        const mappedCondition = conditionMap[selectedCondition.value] || "NOWY";
        const mappedAuctionType = auctionTypeMap[selectedAdvertisementType.value] || "SPRZEDAZ";

        const finalPrice = mappedAuctionType === "SPRZEDAZ" && price ? parseFloat(price) : parseFloat("0");

        const now = new Date().toISOString();
        const weekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        const newAdData = {
            name: title.trim(),
            description: description.trim() || null,
            condition: mappedCondition,
            subcategoryId: selectedSubcategory.value,
            images: images.length > 0 ? images : [],
            auctionType: mappedAuctionType,
            brandId: selectedBrand ? selectedBrand.value : null,
            price: finalPrice,
            startDate: now,
            endDate: weekLater,
        };

        try {
            await addNewItem(newAdData);
            Alert.alert("Sukces", "Ogłoszenie zostało dodane pomyślnie.");
            navigation.navigate("Home");
        } catch (error) {
            console.error("Błąd dodawania ogłoszenia:", error);
            if (error.response?.status === 401) {
                Alert.alert("Błąd autoryzacji", "Twoja sesja wygasła. Zaloguj się ponownie.");
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("user");
                navigation.navigate("Login");
            } else {
                Alert.alert("Błąd", error.message || "Nie udało się dodać ogłoszenia.");
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
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
                                    <TextInput
                                        style={styles.input}
                                        value={title}
                                        onChangeText={setTitle}
                                        placeholder="np. Nowa bluzka do oddania"
                                    />
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Opis ogłoszenia:</Text>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        value={description}
                                        onChangeText={setDescription}
                                        placeholder="Opisz swój przedmiot..."
                                        multiline
                                    />
                                </View>

                                <CustomSelect
                                    options={categories}
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    placeholder="Wybierz kategorię"
                                />

                                {selectedCategory && (
                                    <CustomSelect
                                        options={subcategories}
                                        value={selectedSubcategory}
                                        onChange={setSelectedSubcategory}
                                        placeholder="Wybierz subkategorię"
                                    />
                                )}

                                <CustomSelect
                                    options={brands}
                                    value={selectedBrand}
                                    onChange={setSelectedBrand}
                                    placeholder="Wybierz markę"
                                />

                                <CustomSelect
                                    options={conditionOptions}
                                    value={selectedCondition}
                                    onChange={setSelectedCondition}
                                    placeholder="Wybierz stan przedmiotu"
                                />

                                <CustomSelect
                                    options={advertisementTypeOptions}
                                    value={selectedAdvertisementType}
                                    onChange={setSelectedAdvertisementType}
                                    placeholder="Wybierz rodzaj ogłoszenia"
                                />

                                {selectedAdvertisementType?.value === "sell" && (
                                    <TextInput
                                        style={styles.input}
                                        value={price}
                                        onChangeText={setPrice}
                                        placeholder="Podaj cenę"
                                        keyboardType="numeric"
                                    />
                                )}

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
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    textArea: { height: 100, textAlignVertical: "top" },
    submitButton: {
        backgroundColor: "#28a745",
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default AddItem;
