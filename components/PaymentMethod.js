import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const PaymentMethod = ({
    paymentMethod,
    setPaymentMethod,
    hovered,
    setHovered,
    isPaymentCollapsed,
    togglePaymentCollapse
}) => {
    const paymentMethods = [
        { value: "blik", label: "BLIK", imgSrc: "recipe5.jpeg" },
        { value: "przelew", label: "Przelew", imgSrc: "recipe5.jpeg" },
        { value: "paypal", label: "PayPal", imgSrc: "recipe5.jpeg" }, 
        { value: "karta", label: "Karta płatnicza", imgSrc: "recipe5.jpeg" },
    ];

    const selectedMethod = paymentMethods.find(method => method.value === paymentMethod);

    return (
        <View style={[styles.container, isPaymentCollapsed ? styles.collapsed : styles.expanded]}>
            <View style={styles.innerContainer}>
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={togglePaymentCollapse}
                >
                    <FontAwesomeIcon 
                        icon={isPaymentCollapsed ? faChevronDown : faChevronUp} 
                        size={24} 
                        color="#666" 
                    />
                </TouchableOpacity>

                <Text style={styles.title}>Sposób płatności</Text>

                {isPaymentCollapsed && selectedMethod && (
                    <Text style={styles.selectedMethod}>Typ: {selectedMethod.label}</Text>
                )}

                {!isPaymentCollapsed && (
                    <View style={styles.paymentMethodsContainer}>
                        {paymentMethods.map((method) => (
                            <TouchableOpacity
                                key={method.value}
                                style={[
                                    styles.paymentMethod,
                                    hovered === method.value ? styles.hovered : null
                                ]}
                                onPress={() => setPaymentMethod(method.value)}
                                onMouseEnter={() => setHovered(method.value)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <Image source={{ uri: method.imgSrc }} style={styles.methodImage} />
                                <Text style={styles.methodLabel}>{method.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
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
        height: 80,
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
    },
    paymentMethodsContainer: {
        marginTop: 20,
    },
    paymentMethod: {
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
    methodLabel: {
        fontSize: 16,
    },
});

export default PaymentMethod;
