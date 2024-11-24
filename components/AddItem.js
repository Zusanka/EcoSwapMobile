import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import CustomSelect from "./CustomSelect";
import ImageUploader from "./ImageUploader";
import BrandSelect from "./BrandSelect";
import Navbar from "./Navbar";

const AddItem = ({ navigation }) => {
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState(""); 
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null); 
    const [selectedCity, setSelectedCity] = useState(null); 
    const [titleError, setTitleError] = useState(""); 
    const [errorMessage, setErrorMessage] = useState(""); 
    const [selectedCondition, setSelectedCondition] = useState(null);
    const [selectedAdvertisementType, setSelectedAdvertisementType] = useState(null);
    const [price, setPrice] = useState('');
    const [email, setEmail] = useState(""); 
    const [phoneNumber, setPhoneNumber] = useState(""); 

    const handleSubmit = () => {
        const formData = {
            title,
            description,
            category: selectedValue?.label,
            brand: selectedBrand?.label,
            condition: selectedCondition?.label,
            advertisementType: selectedAdvertisementType?.label,
            email,
            phoneNumber,
            city: selectedCity?.label,
            images: images,
            price
        };

        // Save data in local storage (AsyncStorage or similar in a real app)
        Alert.alert("Success", "Item has been added successfully");

        // Navigate to item details page
        navigation.navigate("ItemDetails", { formData });
    };

    const handleImageUpload = (newImages) => {
        setImages((prevImages) => [...prevImages, ...newImages].slice(0, 6));
    };

    const handleRemoveImage = (index) => {
        Alert.alert("Confirm", "Czy na pewno chcesz usunąć to zdjęcie?", [
            {
                text: "Anuluj",
                style: "cancel",
            },
            {
                text: "Usuń",
                onPress: () => {
                    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
                },
                style: "destructive",
            },
        ]);
    };

    const handlePriceChange = (value) => {
        if (value < 0) {
            setPrice('');
        } else {
            const formattedValue = parseFloat(value).toFixed(2);
            setPrice(formattedValue);
        }
    };

    const handleDescriptionChange = (value) => {
        setDescription(value);

        if (value.length < 30) {
            setErrorMessage("Opis musi mieć co najmniej 30 znaków.");
        } else if (value.length > 200) {
            setErrorMessage("Opis nie może przekraczać 200 znaków.");
        } else {
            setErrorMessage("");
        }
    };

    const handleTitleChange = (value) => {
        setTitle(value);

        if (value.length < 1) {
            setTitleError("Tytuł nie może być pusty.");
        } else {
            setTitleError("");
        }
    };

    const advertisementTypeOptions = [
        { value: "free", label: "Za darmo" },
        { value: "exchange", label: "Na wymianę" },
        { value: "sell", label: "Sprzedaj" },
    ];

    const conditionOptions = [
        { value: "new_with_tag", label: "Nowy z metką" },
        { value: "new_without_tag", label: "Nowy bez metki" },
        { value: "very_good", label: "Bardzo dobry" },
        { value: "good", label: "Dobry" },
        { value: "average", label: "Średni" },
    ];

    const categoryOptions = [
        { value: "electronics", label: "Elektronika" },
        { value: "fashion", label: "Moda" },
        { value: "automotive", label: "Motoryzacja" },
        { value: "realestate", label: "Nieruchomości" },
        { value: "home_garden", label: "Dom i ogród" },
        { value: "sports", label: "Sport" },
        { value: "books", label: "Książki" },
        { value: "toys", label: "Zabawki" },
        { value: "services", label: "Usługi" },
        { value: "other", label: "Inne" },
    ];

    const brandOptions = [
        { value: "apple", label: "Apple" },
        { value: "samsung", label: "Samsung" },
        // Additional options...
    ];

    const cityOptions = [
        { value: "bialystok", label: "Białystok" },
        { value: "warszawa", label: "Warszawa" },
        // Additional options...
    ];

    return (
        <View style={styles.container}>
            <ScrollView>
                <Navbar />
                <View style={styles.formContainer}>
                    <Text style={styles.header}>Dodaj ogłoszenie</Text>

                    <ImageUploader images={images} onImageUpload={handleImageUpload} onRemoveImage={handleRemoveImage} />

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Tytuł ogłoszenia:</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={handleTitleChange}
                            placeholder="np. nowa bluzka do oddania"
                        />
                        {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Opis ogłoszenia:</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={handleDescriptionChange}
                            placeholder="Wpisz opis ogłoszenia tutaj..."
                            multiline
                            numberOfLines={4}
                        />
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                        <Text style={styles.helperText}>{description.length}/200 znaków</Text>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Kategoria:</Text>
                        <CustomSelect options={categoryOptions} value={selectedValue} onChange={setSelectedValue} placeholder="Wybierz kategorię" />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Marka:</Text>
                        <BrandSelect options={brandOptions} value={selectedBrand} onChange={setSelectedBrand} placeholder="Wybierz markę lub wpisz nową" />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Stan:</Text>
                        <CustomSelect options={conditionOptions} value={selectedCondition} onChange={setSelectedCondition} placeholder="Wybierz stan przedmiotu" />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Rodzaj:</Text>
                        <CustomSelect options={advertisementTypeOptions} value={selectedAdvertisementType} onChange={setSelectedAdvertisementType} placeholder="Wybierz rodzaj" />
                        {selectedAdvertisementType?.value === 'sell' && (
                            <TextInput
                                style={styles.input}
                                value={price}
                                onChangeText={handlePriceChange}
                                placeholder="Podaj cenę"
                                keyboardType="numeric"
                            />
                        )}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>E-mail:</Text>
                        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="np. example@example.com" keyboardType="email-address" />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Numer telefonu:</Text>
                        <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="np. 123456789" keyboardType="phone-pad" />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Miejsce zamieszkania:</Text>
                        <BrandSelect options={cityOptions} value={selectedCity} onChange={setSelectedCity} placeholder="Wpisz lub wybierz z listy" />
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Dodaj ogłoszenie</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    formContainer: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    helperText: {
        fontSize: 12,
        color: '#777',
        marginTop: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    submitButton: {
        backgroundColor: '#28a745',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddItem;
