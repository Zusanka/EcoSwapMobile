import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PersonalDetails from './PersonalDetails';
import ShippingMethod from './ShippingMethod';
import PaymentMethod from './PaymentMethod';
import SummaryDetail from './SummaryDetail';
import Navbar from './Navbar';

const PersonDetails = ({ route }) => {
    const { formData } = route.params || {}; // Receive formData with price
    const [price, setPrice] = useState(formData?.price || 0); // Ensure price is a number
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isShippingCollapsed, setIsShippingCollapsed] = useState(true);
    const [isPaymentCollapsed, setIsPaymentCollapsed] = useState(true);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [shippingMethod, setShippingMethod] = useState('');
    const [hovered, setHovered] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');

    useEffect(() => {
        const savedName = localStorage.getItem('name');
        const savedSurname = localStorage.getItem('surname');
        const savedPhoneNumber = localStorage.getItem('phoneNumber');
        const savedStreet = localStorage.getItem('street');
        const savedHouseNumber = localStorage.getItem('houseNumber');
        const savedApartmentNumber = localStorage.getItem('apartmentNumber');
        const savedPostalCode = localStorage.getItem('postalCode');
        const savedCity = localStorage.getItem('city');

        if (savedName) setName(savedName);
        if (savedSurname) setSurname(savedSurname);
        if (savedPhoneNumber) setPhoneNumber(savedPhoneNumber);
        if (savedStreet) setStreet(savedStreet);
        if (savedHouseNumber) setHouseNumber(savedHouseNumber);
        if (savedApartmentNumber) setApartmentNumber(savedApartmentNumber);
        if (savedPostalCode) setPostalCode(savedPostalCode);
        if (savedCity) setCity(savedCity);
    }, []);

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
    const toggleShippingCollapse = () => setIsShippingCollapsed(!isShippingCollapsed);
    const togglePaymentCollapse = () => setIsPaymentCollapsed(!isPaymentCollapsed);

    return (
        <View style={styles.container}>
            <Navbar />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.leftSection}>
                    <PersonalDetails
                        isCollapsed={isCollapsed}
                        toggleCollapse={toggleCollapse}
                        name={name}
                        setName={setName}
                        surname={surname}
                        setSurname={setSurname}
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                        streetName={street}
                        setStreetName={setStreet}
                        houseNumber={houseNumber}
                        setHouseNumber={setHouseNumber}
                        apartmentNumber={apartmentNumber}
                        setApartmentNumber={setApartmentNumber}
                        postalCode={postalCode}
                        setPostalCode={setPostalCode}
                        city={city}
                        setCity={setCity}
                    />
                    <ShippingMethod
                        shippingMethod={shippingMethod}
                        setShippingMethod={setShippingMethod}
                        hovered={hovered}
                        setHovered={setHovered}
                        isShippingCollapsed={isShippingCollapsed}
                        toggleShippingCollapse={toggleShippingCollapse}
                    />
                    <PaymentMethod
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        isPaymentCollapsed={isPaymentCollapsed}
                        togglePaymentCollapse={togglePaymentCollapse}
                        hovered={hovered}
                        setHovered={setHovered}
                    />
                </View>
                <View style={styles.rightSection}>
                    <SummaryDetail shippingMethod={shippingMethod} price={price} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        padding: 16,
    },
    leftSection: {
        flex: 3,
        padding: 8,
    },
    rightSection: {
        flex: 1,
        padding: 8,
    },
});

export default PersonDetails;
