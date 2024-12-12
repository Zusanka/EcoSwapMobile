import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const PaymentMethod = ({
                           paymentMethod,
                           setPaymentMethod,
                           hovered,
                           setHovered,
                           isPaymentCollapsed,
                           togglePaymentCollapse,
                       }) => {
    const paymentMethods = [
        { value: "blik", label: "BLIK", imgSrc: require('../assets/recipe5.jpeg') },
        { value: "przelew", label: "Przelew", imgSrc: require('../assets/recipe5.jpeg') },
        { value: "paypal", label: "PayPal", imgSrc: require('../assets/recipe5.jpeg') },
        { value: "karta", label: "Karta płatnicza", imgSrc: require('../assets/recipe5.jpeg') },
    ];

    const selectedMethod = paymentMethods.find(method => method.value === paymentMethod);

    return (
        <View style={[styles.container, isPaymentCollapsed && styles.collapsed]}>
            <TouchableOpacity
                style={styles.collapseButton}
                onPress={togglePaymentCollapse}
            >
                <Text style={styles.collapseButtonText}>
                    {isPaymentCollapsed ? '+' : '-'}
                </Text>
            </TouchableOpacity>

            <Text style={styles.title}>Sposób płatności</Text>

            {isPaymentCollapsed && selectedMethod && (
                <Text style={styles.selectedMethodText}>
                    Typ: {selectedMethod.label}
                </Text>
            )}

            {!isPaymentCollapsed && (
                <View style={styles.paymentMethodsContainer}>
                    {paymentMethods.map((method) => (
                        <TouchableOpacity
                            key={method.value}
                            style={[
                                styles.methodContainer,
                                hovered === method.value && styles.hovered,
                            ]}
                            onPress={() => setPaymentMethod(method.value)}
                            onMouseEnter={() => setHovered(method.value)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <Image source={method.imgSrc} style={styles.methodImage} />
                            <Text style={styles.methodLabel}>{method.label}</Text>
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
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 24,
        padding: 20,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    collapsed: {
        height: 80,
        justifyContent: 'center',
    },
    collapseButton: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    collapseButtonText: {
        fontSize: 18,
        color: '#4b5563',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1f2937',
    },
    selectedMethodText: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 8,
    },
    paymentMethodsContainer: {
        marginTop: 16,
    },
    methodContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 16,
    },
    hovered: {
        backgroundColor: '#f3f4f6',
    },
    methodImage: {
        width: 40,
        height: 40,
        marginRight: 12,
    },
    methodLabel: {
        fontSize: 16,
        color: '#1f2937',
    },
});

export default PaymentMethod;
