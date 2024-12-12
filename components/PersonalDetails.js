import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const PersonalDetails = ({
                             isCollapsed,
                             toggleCollapse,
                             name,
                             setName,
                             surname,
                             setSurname,
                             phoneNumber,
                             setPhoneNumber,
                             streetName,
                             setStreetName,
                             houseNumber,
                             setHouseNumber,
                             apartmentNumber,
                             setApartmentNumber,
                             postalCode,
                             setPostalCode,
                             city,
                             setCity,
                         }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.collapseButton} onPress={toggleCollapse}>
                <Text style={styles.collapseButtonText}>{isCollapsed ? '+' : '-'}</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Dane osobowe</Text>

            {isCollapsed && name && surname ? (
                <View>
                    <Text style={styles.detailText}>Imię i nazwisko: {name} {surname}</Text>
                    <Text style={styles.detailText}>Nr tel: {phoneNumber}</Text>
                    <Text style={styles.detailText}>Adres: {streetName} {houseNumber} m.{apartmentNumber}</Text>
                    <Text style={styles.detailText}>{postalCode} {city}</Text>
                </View>
            ) : (
                <View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Imię:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Jan"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nazwisko:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Kowalski"
                            value={surname}
                            onChangeText={setSurname}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Telefon:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="(+48)500123576"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Adres Zamieszkania:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Jana Pawła II"
                            value={streetName}
                            onChangeText={setStreetName}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={styles.inputContainerHalf}>
                            <Text style={styles.label}>Nr domu:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="5"
                                value={houseNumber}
                                onChangeText={setHouseNumber}
                            />
                        </View>

                        <View style={styles.inputContainerHalf}>
                            <Text style={styles.label}>Nr mieszkania:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="10"
                                value={apartmentNumber}
                                onChangeText={setApartmentNumber}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.inputContainerHalf}>
                            <Text style={styles.label}>Kod pocztowy:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="00-000"
                                value={postalCode}
                                onChangeText={setPostalCode}
                            />
                        </View>

                        <View style={styles.inputContainerHalf}>
                            <Text style={styles.label}>Miejscowość:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Warszawa"
                                value={city}
                                onChangeText={setCity}
                            />
                        </View>
                    </View>
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
    collapseButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#f3f4f6',
        padding: 10,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    collapseButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 10,
    },
    detailText: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 5,
    },
    inputContainer: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 14,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputContainerHalf: {
        flex: 1,
        marginHorizontal: 4,
    },
});

export default PersonalDetails;
