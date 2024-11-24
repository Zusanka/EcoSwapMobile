import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const SummaryDetail = ({ shippingMethod, price }) => {
    const shippingCosts = {
        personalPickup: 0,
        delivery: 15,
        inpost: 8.99,
    };

    // Pobierz koszty wysyłki na podstawie wybranej metody
    const shippingCost = shippingMethod ? shippingCosts[shippingMethod] : 0;

    // Upewnij się, że price i shippingCost są liczbami
    const totalPrice = parseFloat(price) || 0; // Przekonwertuj price na liczbę
    const totalShippingCost = parseFloat(shippingCost) || 0; // Przekonwertuj shippingCost na liczbę

    // Oblicz całkowity koszt
    const totalCost = totalPrice + totalShippingCost;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Podsumowanie</Text>
            <View style={styles.details}>
                <Text style={styles.detailText}>Produkt 1: {totalPrice.toFixed(2)} zł</Text>
                <Text style={styles.detailText}>Wysyłka: {totalShippingCost.toFixed(2)} zł</Text>
            </View>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Razem: {totalCost.toFixed(2)} zł</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => { /* Handle purchase confirmation here */ }}>
                <Text style={styles.buttonText}>Potwierdź zakup</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        marginTop: 20,
        padding: 20,
        alignSelf: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    details: {
        marginBottom: 10,
    },
    detailText: {
        fontSize: 16,
        color: '#444',
        marginBottom: 5,
    },
    totalContainer: {
        marginBottom: 15,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
    },
    button: {
        backgroundColor: '#28a745',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        transform: [{ scale: 1 }],
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SummaryDetail;
