import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Navbar from "./Navbar";

const MyAccount = () => {
    const [images, setImages] = useState([]);
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvvNumber, setCvvNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [joinDate, setJoinDate] = useState('');
    const [activeTab, setActiveTab] = useState('personalData');
    const [isEditing, setIsEditing] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const loadData = async () => {
            const savedLogin = await AsyncStorage.getItem('login');
            const savedEmail = await AsyncStorage.getItem('email');
            const savedPassword = await AsyncStorage.getItem('password');
            const savedJoinDate = await AsyncStorage.getItem('joinDate');
            const savedName = await AsyncStorage.getItem('name');
            const savedSurname = await AsyncStorage.getItem('surname');
            const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
            const savedStreet = await AsyncStorage.getItem('street');
            const savedHouseNumber = await AsyncStorage.getItem('houseNumber');
            const savedApartmentNumber = await AsyncStorage.getItem('apartmentNumber');
            const savedPostalCode = await AsyncStorage.getItem('postalCode');
            const savedCity = await AsyncStorage.getItem('city');
            const savedCardNumber = await AsyncStorage.getItem('cardNumber');
            const savedCvvNumber = await AsyncStorage.getItem('cvvNumber');
            const savedExpirationDate = await AsyncStorage.getItem('expirationDate');
            const savedImage = await AsyncStorage.getItem('image');

            if (savedLogin) setLogin(savedLogin);
            if (savedEmail) setEmail(savedEmail);
            if (savedPassword) setPassword(savedPassword);
            if (savedJoinDate) setJoinDate(savedJoinDate);
            if (savedName) setName(savedName);
            if (savedSurname) setSurname(savedSurname);
            if (savedPhoneNumber) setPhoneNumber(savedPhoneNumber);
            if (savedStreet) setStreet(savedStreet);
            if (savedHouseNumber) setHouseNumber(savedHouseNumber);
            if (savedApartmentNumber) setApartmentNumber(savedApartmentNumber);
            if (savedPostalCode) setPostalCode(savedPostalCode);
            if (savedCity) setCity(savedCity);
            if (savedCardNumber) setCardNumber(savedCardNumber);
            if (savedCvvNumber) setCvvNumber(savedCvvNumber);
            if (savedExpirationDate) setExpirationDate(savedExpirationDate);
            if (savedImage) setImages([savedImage]);
        };

        loadData();
    }, []);

    const handleSave = async () => {
        await AsyncStorage.setItem('name', name);
        await AsyncStorage.setItem('surname', surname);
        await AsyncStorage.setItem('phoneNumber', phoneNumber);
        await AsyncStorage.setItem('street', street);
        await AsyncStorage.setItem('houseNumber', houseNumber);
        await AsyncStorage.setItem('apartmentNumber', apartmentNumber);
        await AsyncStorage.setItem('postalCode', postalCode);
        await AsyncStorage.setItem('city', city);
        await AsyncStorage.setItem('cardNumber', cardNumber);
        await AsyncStorage.setItem('cvvNumber', cvvNumber);
        await AsyncStorage.setItem('expirationDate', expirationDate);
        setIsEditing(false);
        Alert.alert("Sukces", "Zapisano zmiany");
    };

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleCardNumberChange = (value) => {
        const formattedValue = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumber(formattedValue);
    };

    const handleExpirationDateChange = (value) => {
        let formattedValue = value.replace(/\D/g, '').slice(0, 4);
        let month = formattedValue.slice(0, 2);
        if (month > 12) month = '12';
        let year = formattedValue.slice(2, 4);
        const currentYear = new Date().getFullYear() % 100;

        if (year && parseInt(year) < currentYear) {
            year = currentYear.toString().padStart(2, '0');
        }
        setExpirationDate(`${month}${year ? `/${year}` : ''}`);
    };

    return (
        <>
            <Navbar />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <TouchableOpacity onPress={handleToggleEdit} style={styles.editButton}>
                        <Icon name={isEditing ? "times" : "edit"} size={20} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.profileContainer}>
                        <View style={styles.imageContainer}>
                            {images.length === 0 ? (
                                <Text style={styles.noImageText}>Brak zdjęcia</Text>
                            ) : (
                                <Image source={{ uri: images[0] }} style={styles.profileImage} />
                            )}
                        </View>
                        <Text style={styles.loginText}>Login: {login}</Text>
                        <Text>Data dołączenia: {joinDate ? new Date(joinDate).toLocaleDateString() : 'Brak danych'}</Text>
                    </View>

                    <View style={styles.tabsContainer}>
                        <TouchableOpacity onPress={() => setActiveTab('personalData')} style={[styles.tabButton, activeTab === 'personalData' && styles.activeTab]}>
                            <Text style={styles.tabText}>Dane osobowe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab('address')} style={[styles.tabButton, activeTab === 'address' && styles.activeTab]}>
                            <Text style={styles.tabText}>Adres zamieszkania</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab('cards')} style={[styles.tabButton, activeTab === 'cards' && styles.activeTab]}>
                            <Text style={styles.tabText}>Moje karty</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tabContent}>
                        {activeTab === 'personalData' && (
                            <View>
                                {isEditing ? (
                                    <>
                                        <Text>Email:</Text>
                                        <TextInput value={email} onChangeText={setEmail} style={styles.input} />
                                        <Text>Hasło:</Text>
                                        <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
                                        <Text>Nr telefonu:</Text>
                                        <TextInput value={phoneNumber} onChangeText={setPhoneNumber} style={styles.input} />
                                        <Text>Imię:</Text>
                                        <TextInput value={name} onChangeText={setName} style={styles.input} />
                                        <Text>Nazwisko:</Text>
                                        <TextInput value={surname} onChangeText={setSurname} style={styles.input} />
                                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                            <Icon name="save" size={20} color="#fff" />
                                            <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <Text>Email: {email}</Text>
                                        <Text>Hasło: {password}</Text>
                                        <Text>Nr telefonu: {phoneNumber}</Text>
                                        <Text>Imię: {name}</Text>
                                        <Text>Nazwisko: {surname}</Text>
                                    </>
                                )}
                            </View>
                        )}

                        {activeTab === 'address' && (
                            <View>
                                {isEditing ? (
                                    <>
                                        <Text>Ulica:</Text>
                                        <TextInput value={street} onChangeText={setStreet} style={styles.input} />
                                        <Text>Nr domu:</Text>
                                        <TextInput value={houseNumber} onChangeText={setHouseNumber} style={styles.input} />
                                        <Text>Nr mieszkania:</Text>
                                        <TextInput value={apartmentNumber} onChangeText={setApartmentNumber} style={styles.input} />
                                        <Text>Kod pocztowy:</Text>
                                        <TextInput value={postalCode} onChangeText={setPostalCode} style={styles.input} />
                                        <Text>Miejscowość:</Text>
                                        <TextInput value={city} onChangeText={setCity} style={styles.input} />
                                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                            <Icon name="save" size={20} color="#fff" />
                                            <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <Text>Ulica: {street}</Text>
                                        <Text>Nr domu: {houseNumber}</Text>
                                        <Text>Nr mieszkania: {apartmentNumber}</Text>
                                        <Text>Kod pocztowy: {postalCode}</Text>
                                        <Text>Miejscowość: {city}</Text>
                                    </>
                                )}
                            </View>
                        )}

                        {activeTab === 'cards' && (
                            <View>
                                {isEditing ? (
                                    <>
                                        <Text>Numer karty:</Text>
                                        <TextInput value={cardNumber} onChangeText={handleCardNumberChange} style={styles.input} keyboardType="numeric" />
                                        <Text>CVV:</Text>
                                        <TextInput value={cvvNumber} onChangeText={setCvvNumber} style={styles.input} keyboardType="numeric" maxLength={3} />
                                        <Text>Data ważności:</Text>
                                        <TextInput value={expirationDate} onChangeText={handleExpirationDateChange} style={styles.input} keyboardType="numeric" maxLength={5} />
                                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                            <Icon name="save" size={20} color="#fff" />
                                            <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <Text>Numer karty: {cardNumber}</Text>
                                        <Text>CVV: {cvvNumber}</Text>
                                        <Text>Data ważności: {expirationDate}</Text>
                                    </>
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    editButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#007bff',
        borderRadius: 20,
        padding: 10,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        marginBottom: 10,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    noImageText: {
        textAlign: 'center',
        color: '#6b7280',
    },
    loginText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#e5e7eb',
    },
    tabButton: {
        paddingBottom: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: '#38a169',
    },
    tabText: {
        fontSize: 16,
    },
    tabContent: {
        paddingVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#38a169',
        paddingVertical: 10,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        marginLeft: 8,
    },
});

export default MyAccount;
