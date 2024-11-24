import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList } from "react-native";

const BrandSelect = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value ? value.label : "");
    const [filteredOptions, setFilteredOptions] = useState(options);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectOption = (option) => {
        onChange(option);
        setInputValue(option.label);
        setIsOpen(false);
    };

    const handleInputChange = (value) => {
        setInputValue(value);

        // Filter options based on input value
        const filtered = options.filter((option) =>
            option.label.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOptions(filtered);
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
            {isOpen && (
                <FlatList
                    data={filteredOptions}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSelectOption(item)} style={styles.optionItem}>
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
        position: 'relative',
    },
    input: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 24,
        backgroundColor: '#fff',
    },
    optionsList: {
        position: 'absolute',
        top: 50,
        width: '100%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 16,
        maxHeight: 200,
        zIndex: 10,
    },
    optionItem: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    optionText: {
        color: '#333',
    },
});

export default BrandSelect;
