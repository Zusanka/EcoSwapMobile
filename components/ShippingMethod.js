import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ShippingMethod = ({
                            shippingMethod,
                            setShippingMethod,
                            isShippingCollapsed,
                            toggleShippingCollapse,
                        }) => {
    const shippingMethods = [
        { value: 'personalPickup', label: 'Odbiór osobisty', time: '0 dni', cost: '0 zł', imgSrc: 'https://via.placeholder.com/40' },
        { value: 'delivery', label: 'Wysyłka kurierem', time: '2 dni', cost: '15 zł', imgSrc: 'https://via.placeholder.com/40' },
        { value: 'inpost', label: 'Paczkomat Inpost', time: '2 dni', cost: '8.99 zł', imgSrc: 'https://via.placeholder.com/40' },
    ];

    const selectedMethod = shippingMethods.find((method) => method.value === shippingMethod);

    return (
        <View style={[styles.container, isShippingCollapsed ? styles.collapsed : styles.expanded]}>
            <TouchableOpacity onPress={toggleShippingCollapse} style={styles.collapseButton}>
                <Text style={styles.collapseButtonText}>{isShippingCollapsed ? '+' : '-'}</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Sposób wysyłki</Text>

            {isShippingCollapsed && selectedMethod ? (
                <View>
                    <Text style={styles.detailText}>Typ: {selectedMethod.label}</Text>
                    <Text style={styles.detailText}>Czas oczekiwania: {selectedMethod.time}</Text>
                    <Text style={styles.detailText}>Koszt: {selectedMethod.cost}</Text>
                </View>
            ) : (
                <View style={styles.optionsContainer}>
                    {shippingMethods.map((method) => (
                        <TouchableOpacity
                            key={method.value}
                            style={[
                                styles.option,
                                shippingMethod === method.value && styles.selectedOption,
                            ]}
                            onPress={() => setShippingMethod(method.value)}
                        >
                            <Image source={{ uri: method.imgSrc }} style={styles.image} />
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionLabel}>{method.label}</Text>
                                <Text style={styles.optionDetails}>Czas oczekiwania: {method.time}</Text>
                                <Text style={styles.optionDetails}>Koszt wysyłki: {method.cost}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        marginTop: 16,
        padding: 16,
    },
    collapsed: {
    },
    expanded: {
    },
    collapseButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#ddd',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    collapseButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    detailText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    optionsContainer: {
        marginTop: 8,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    selectedOption: {
        backgroundColor: '#e6f7ff',
        borderColor: '#007bff',
    },
    image: {
        width: 40,
        height: 40,
        marginRight: 16,
        borderRadius: 8,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    optionDetails: {
        fontSize: 12,
        color: '#555',
    },
});

export default ShippingMethod;
