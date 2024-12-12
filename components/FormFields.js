import React from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from "react-native";
import CustomSelect from "./CustomSelect"; // Upewnij się, że ścieżka jest poprawna

const FormFields = ({
                        title,
                        setTitle,
                        category,
                        setCategory,
                        subCategory,
                        setSubCategory,
                        subCategories,
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
            <View style={styles.field}>
                <Text style={styles.label}>Tytuł ogłoszenia:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="np. nowa bluzka do oddania"
                    value={title}
                    onChangeText={setTitle}
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
        marginBottom: 16,
    },
    field: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#fff",
    },
});

export default FormFields;
