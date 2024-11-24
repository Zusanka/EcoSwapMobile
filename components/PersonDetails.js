import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import PersonalDetails from './PersonalDetails';
import ShippingMethod from './ShippingMethod';
import PaymentMethod from './PaymentMethod';
import SummaryDetail from './SummaryDetail';
import Navbar from './Navbar';

const PersonDetails = () => {
    const route = useRoute();
    const formData = route.params?.formData || {}; // Odbieraj dane przekazane jako parametry nawigacji
    const [price, setPrice] = useState(formData?.price || 0); 
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
        const loadData = async () => {
            try {
                const savedName = await AsyncStorage.getItem('name');
                const savedSurname = await AsyncStorage.getItem('surname');
                const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
                const savedStreet = await AsyncStorage.getItem('street');
                const savedHouseNumber = await AsyncStorage.getItem('houseNumber');
                const savedApartmentNumber = await AsyncStorage.getItem('apartmentNumber');
                const savedPostalCode = await AsyncStorage.getItem('postalCode');
                const savedCity = await AsyncStorage.getItem('city');

                if (savedName) setName(savedName);
                if (savedSurname) setSurname(savedSurname);
                if (savedPhoneNumber) setPhoneNumber(savedPhoneNumber);
                if (savedStreet) setStreet(savedStreet);
                if (savedHouseNumber) setHouseNumber(savedHouseNumber);
                if (savedApartmentNumber) setApartmentNumber(savedApartmentNumber);
                if (savedPostalCode) setPostalCode(savedPostalCode);
                if (savedCity) setCity(savedCity);
            } catch (error) {
                console.error("Error loading data from AsyncStorage:", error);
            }
        };

        loadData();
    }, []);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleShippingCollapse = () => {
        setIsShippingCollapsed(!isShippingCollapsed);
    };

    const togglePaymentCollapse = () => {
        setIsPaymentCollapsed(!isPaymentCollapsed);
    };

    return (
        <>
            <Navbar />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.formContainer}>
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

                <View style={styles.summaryContainer}>
                    <SummaryDetail
                        shippingMethod={shippingMethod}
                        price={price}
                    />
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    formContainer: {
        flex: 3,
    },
    summaryContainer: {
        flex: 2,
        marginTop: 16,
    },
});

export default PersonDetails;
