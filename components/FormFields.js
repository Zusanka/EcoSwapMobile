import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import CustomSelect from "./CustomSelect";
import { getCategoriesWithSubcategories } from "../api/api";

const FormFields = ({ title, setTitle, category, setCategory, subCategory, setSubCategory }) => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategoriesWithSubcategories();
                setCategories(Object.keys(data).map((key) => ({ value: key, label: key })));
                setSubCategories(data);
            } catch (error) {
                console.error("Błąd pobierania kategorii:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

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

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <Text style={styles.label}>Wybierz kategorię:</Text>
                    <CustomSelect
                        options={categories}
                        value={category}
                        onChange={setCategory}
                        placeholder="Wybierz kategorię"
                    />

                    {category && subCategories[category.value] && (
                        <>
                            <Text style={styles.label}>Wybierz podkategorię:</Text>
                            <CustomSelect
                                options={subCategories[category.value].map((subCat) => ({
                                    value: subCat,
                                    label: subCat,
                                }))}
                                value={subCategory}
                                onChange={setSubCategory}
                                placeholder="Wybierz podkategorię"
                            />
                        </>
                    )}
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
