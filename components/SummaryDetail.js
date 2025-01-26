import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

const SummaryDetail = ({ shippingMethod, price }) => {
    const shippingCosts = {
        personalPickup: 0,
        delivery: 15,
        inpost: 8.99,
    };

    const shippingCost = shippingMethod ? shippingCosts[shippingMethod] : 0;

    const totalPrice = parseFloat(price) || 0;
    const totalShippingCost = parseFloat(shippingCost) || 0;

    const totalCost = totalPrice + totalShippingCost;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Podsumowanie</Text>
            <View style={styles.details}>
                <Text style={styles.detailText}>Produkt 1: {totalPrice.toFixed(2)} zł</Text>
                <Text style={styles.detailText}>Wysyłka: {totalShippingCost.toFixed(2)} zł</Text>
            </View>
            <View style={styles.total}>
                <Text style={styles.totalText}>Razem: {totalCost.toFixed(2)} zł</Text>
            </View>
            <TouchableOpacity style={styles.confirmButton}>
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
        padding: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#000',
    },
    details: {
        marginBottom: 16,
    },
    detailText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    total: {
        marginBottom: 16,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    confirmButton: {
        backgroundColor: '#38A169',
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default SummaryDetail;
