import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import CustomSelect from "./CustomSelect"; // Ensure the path is correct

const FormFields = ({
    title,
    setTitle,
    category,
    setCategory,
    subCategory,
    setSubCategory,
    subCategories
}) => {
    const categoryOptions = [
        { value: "", label: "Wybierz kategorię" },
        { value: "electronics", label: "Elektronika" },
        { value: "fashion", label: "Moda" },
        { value: "automotive", label: "Motoryzacja" },
        { value: "real-estate", label: "Nieruchomości" },
        { value: "home-garden", label: "Dom i ogród" },
        { value: "sports", label: "Sport" },
        { value: "books", label: "Książki" },
        { value: "toys", label: "Zabawki" },
        { value: "services", label: "Usługi" },
        { value: "other", label: "Inne" },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Tytuł ogłoszenia:</Text>
                <TextInput
                    required
                    style={styles.input}
                    placeholder="np. nowa bluzka do oddania"
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                />
            </View>

            <Text style={styles.label}>Wybierz kategorię:</Text>
            <CustomSelect
                options={categoryOptions}
                value={category}
                onChange={setCategory}
                placeholder="Wybierz kategorię"
            />

            {category && subCategories[category] && (
                <>
                    <Text style={styles.label}>Wybierz podkategorię:</Text>
                    <CustomSelect
                        options={subCategories[category].map((subCat) => ({
                            value: subCat,
                            label: subCat,
                        }))}
                        value={subCategory}
                        onChange={setSubCategory}
                        placeholder="Wybierz podkategorię"
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    inputContainer: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#fff",
    },
});

export default FormFields;
