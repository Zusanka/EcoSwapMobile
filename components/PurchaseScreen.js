import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import ShippingMethod from '../components/ShippingMethod';
import { useNavigation, useRoute } from '@react-navigation/native';

const PurchaseScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params;

    const [shippingMethod, setShippingMethod] = useState(null);
    const [hovered, setHovered] = useState(null);
    const [isShippingCollapsed, setIsShippingCollapsed] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [address, setAddress] = useState('');

    const toggleShippingCollapse = () => {
        setIsShippingCollapsed(!isShippingCollapsed);
    };

    const handlePurchase = () => {
        if (!shippingMethod) {
            Alert.alert("Błąd", "Proszę wybrać sposób wysyłki.");
            return;
        }

        if (!paymentMethod.trim()) {
            Alert.alert("Błąd", "Proszę wpisać metodę płatności.");
            return;
        }

        if (!address.trim()) {
            Alert.alert("Błąd", "Proszę wpisać adres dostawy.");
            return;
        }

        Alert.alert(
            "Potwierdzenie zakupu",
            `Czy na pewno chcesz kupić "${item.name}" za ${item.price} zł?`,
            [
                { text: "Anuluj", style: "cancel" },
                {
                    text: "Potwierdź",
                    onPress: () => {
                        Alert.alert("Sukces", "Zakup został pomyślnie zakończony.");
                        navigation.navigate("Home");
                    },
                },
            ]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Zakup przedmiotu</Text>

            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price} zł</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
            </View>

            <ShippingMethod
                shippingMethod={shippingMethod}
                setShippingMethod={setShippingMethod}
                hovered={hovered}
                setHovered={setHovered}
                isShippingCollapsed={isShippingCollapsed}
                toggleShippingCollapse={toggleShippingCollapse}
            />

            <View style={styles.formGroup}>
                <Text style={styles.label}>Metoda płatności</Text>
                <TextInput
                    style={styles.input}
                    placeholder="np. Przelew bankowy, PayPal"
                    value={paymentMethod}
                    onChangeText={setPaymentMethod}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Adres dostawy</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Wprowadź adres"
                    value={address}
                    onChangeText={setAddress}
                />
            </View>

            <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
                <Text style={styles.purchaseButtonText}>Zakończ zakup</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    itemDetails: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 18,
        color: '#28a745',
        marginVertical: 5,
    },
    itemDescription: {
        fontSize: 14,
        color: '#555',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    purchaseButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    purchaseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PurchaseScreen;
