import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
} from "react-native";

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
            <TouchableOpacity
                style={styles.selector}
                onPress={() => setIsOpen((prev) => !prev)}
            >
                <Text style={[styles.selectorText, !currentValue && styles.placeholderText]}>
                    {currentValue ? currentValue.label : placeholder}
                </Text>
            </TouchableOpacity>

            <Modal visible={isOpen} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {currentCategory ? (
                            <View>
                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={handleBackToCategories}
                                >
                                    <Text style={styles.backButtonText}>Powrót do kategorii</Text>
                                </TouchableOpacity>
                                <FlatList
                                    data={currentCategory.subOptions}
                                    keyExtractor={(item) => item.value}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.option}
                                            onPress={() => handleSubOptionClick(item)}
                                        >
                                            <Text style={styles.optionText}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
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
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsOpen(false)}
                        >
                            <Text style={styles.closeButtonText}>Zamknij</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,

    },
    selector: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
    },
    selectorText: {
        fontSize: 16,
        color: "#333",
    },
    placeholderText: {
        color: "#888",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        maxHeight: "80%",
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        elevation: 4,
    },
    backButton: {
        marginBottom: 16,
    },
    backButtonText: {
        fontSize: 16,
        color: "#007AFF",
        textAlign: "center",
    },
    option: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    optionText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 16,
        padding: 10,
        backgroundColor: "#067518",
        borderRadius: 8,
    },
    closeButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
    },
});

export default CustomSelect;
