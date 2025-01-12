import React, { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    FlatList,
} from "react-native";

const BrandSelect = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value ? value.label : "");
    const [filteredOptions, setFilteredOptions] = useState([]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setFilteredOptions(options.slice(0, 5)); // Ustawienie początkowych opcji
        }
    };

    const handleSelectOption = (option) => {
        onChange(option);
        setInputValue(option.label);
        setIsOpen(false);
    };

    const handleInputChange = (value) => {
        setInputValue(value);

        // Filtracja opcji
        const filtered = options.filter((option) =>
            option.label.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredOptions(filtered.slice(0, 5)); // Ograniczenie do 5 elementów
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={inputValue}
                onChangeText={handleInputChange}
                onFocus={handleToggle}
                placeholder={placeholder}
                style={styles.input}
            />
            {isOpen && filteredOptions.length > 0 && (
                <FlatList
                    data={filteredOptions}
                    keyExtractor={(item) => item.value.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={() => handleSelectOption(item)}
                        >
                            <Text style={styles.optionText}>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                    style={styles.optionsList}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        zIndex: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    optionsList: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        backgroundColor: "#fff",
        maxHeight: 200,
    },
    optionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    optionText: {
        fontSize: 16,
    },
});

export default BrandSelect;
