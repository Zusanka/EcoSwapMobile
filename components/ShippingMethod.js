import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const ShippingMethod = ({
    shippingMethod,
    setShippingMethod,
    hovered,
    setHovered,
    isShippingCollapsed,
    toggleShippingCollapse
}) => {
    const shippingMethods = [
        { value: "personalPickup", label: "Odbiór osobisty", time: "0 dni", cost: "0 zł", imgSrc: "recipe5.jpeg" },
        { value: "delivery", label: "Wysyłka kurierem", time: "2 dni", cost: "15 zł", imgSrc: "recipe5.jpeg" },
        { value: "inpost", label: "Paczkomat Inpost", time: "2 dni", cost: "8.99 zł", imgSrc: "recipe5.jpeg" },
    ];

    const selectedMethod = shippingMethods.find(method => method.value === shippingMethod);

    return (
        <View style={[styles.container, isShippingCollapsed ? styles.collapsed : styles.expanded]}>
            <View style={styles.innerContainer}>
                <TouchableOpacity style={styles.toggleButton} onPress={toggleShippingCollapse}>
                    <FontAwesomeIcon icon={isShippingCollapsed ? faPlus : faMinus} size={24} color="#666" />
                </TouchableOpacity>

                <Text style={styles.title}>Sposób wysyłki</Text>

                {isShippingCollapsed && selectedMethod && (
                    <>
                        <Text style={styles.selectedMethod}>Typ: {selectedMethod.label}</Text>
                        <Text style={styles.selectedMethod}>Czas oczekiwania: {selectedMethod.time}</Text>
                        <Text style={styles.selectedMethod}>Koszt: {selectedMethod.cost}</Text>
                    </>
                )}

                {!isShippingCollapsed && (
                    <FlatList
                        data={shippingMethods}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.shippingMethod,
                                    hovered === item.value ? styles.hovered : null
                                ]}
                                onPress={() => setShippingMethod(item.value)}
                                onPressIn={() => setHovered(item.value)}
                                onPressOut={() => setHovered(null)}
                            >
                                <Image source={{ uri: item.imgSrc }} style={styles.methodImage} />
                                <View style={styles.methodInfo}>
                                    <Text style={styles.methodLabel}>{item.label}</Text>
                                    <Text style={styles.methodDetails}>Czas oczekiwania: {item.time}</Text>
                                    <Text style={styles.methodDetails}>Koszt wysyłki: {item.cost}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 600,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        marginTop: 20,
        alignSelf: 'center',
        transition: 'all 0.3s ease',
    },
    collapsed: {
        height: 120,
    },
    expanded: {
        height: 'auto',
    },
    innerContainer: {
        padding: 20,
    },
    toggleButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    selectedMethod: {
        fontSize: 16,
        color: '#444',
        marginBottom: 5,
    },
    shippingMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    hovered: {
        backgroundColor: '#f0f0f0',
    },
    methodImage: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    methodInfo: {
        flexDirection: 'column',
        marginLeft: 10,
    },
    methodLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    methodDetails: {
        fontSize: 14,
        color: '#555',
    },
});

export default ShippingMethod;
