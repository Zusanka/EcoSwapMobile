import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const CustomSelect = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const [currentCategory, setCurrentCategory] = useState(null);

    const handleOptionClick = (option) => {
        if (option.subOptions) {
            setCurrentValue(option);
            setCurrentCategory(option);
        } else {
            onChange(option);
            setCurrentValue(option);
            setIsOpen(false);
        }
    };

    const handleSubOptionClick = (subOption) => {
        onChange(subOption);
        setCurrentValue(subOption);
        setCurrentCategory(null);
        setIsOpen(false);
    };

    const handleBackToCategories = () => {
        setCurrentCategory(null);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.selectBox} onPress={() => setIsOpen((prev) => !prev)}>
                <Text style={currentValue ? styles.selectedText : styles.placeholderText}>
                    {currentValue ? currentValue.label : placeholder}
                </Text>
                <FontAwesomeIcon icon={faChevronRight} size={16} color={currentValue ? "#000" : "#888"} />
            </TouchableOpacity>

            {isOpen && (
                <View style={styles.dropdownContainer}>
                    {currentCategory ? (
                        <View>
                            <TouchableOpacity style={styles.option} onPress={handleBackToCategories}>
                                <Text style={styles.optionText}>Back to Categories</Text>
                            </TouchableOpacity>
                            {currentCategory.subOptions.map((subOption) => (
                                <TouchableOpacity
                                    key={subOption.value}
                                    style={styles.option}
                                    onPress={() => handleSubOptionClick(subOption)}
                                >
                                    <Text style={styles.optionText}>{subOption.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => handleOptionClick(item)}
                                >
                                    <Text style={styles.optionText}>{item.label}</Text>
                                    {item.subOptions && (
                                        <FontAwesomeIcon icon={faChevronRight} size={16} color="#888" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    selectBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 12,
        backgroundColor: "#fff",
    },
    placeholderText: {
        color: "#888",
    },
    selectedText: {
        color: "#000",
    },
    dropdownContainer: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 16,
        backgroundColor: "#fff",
        maxHeight: 200,
        overflow: "hidden",
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    optionText: {
        color: "#000",
    },
});

export default CustomSelect;
