import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

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
    setCity
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <TouchableOpacity style={styles.collapseButton} onPress={toggleCollapse}>
                    <Icon name={isCollapsed ? "plus" : "minus"} size={20} color="gray" />
                </TouchableOpacity>

                <Text style={styles.title}>Dane osobowe</Text>

                {isCollapsed && name && surname ? (
                    <>
                        <Text style={styles.detailText}>Imię i nazwisko: {name} {surname}</Text>
                        <Text style={styles.detailText}>Nr tel: {phoneNumber}</Text>
                        <Text style={styles.detailText}>Adres: {streetName} {houseNumber} m.{apartmentNumber}</Text>
                        <Text style={styles.detailText}>{postalCode} {city}</Text>
                    </>
                ) : (
                    <View>
                        {/* Formularz do wypełnienia danych */}
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
                                keyboardType="phone-pad"
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

                        <View style={styles.rowContainer}>
                            <View style={styles.inputHalfContainer}>
                                <Text style={styles.label}>Nr domu:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="5"
                                    value={houseNumber}
                                    onChangeText={setHouseNumber}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputHalfContainer}>
                                <Text style={styles.label}>Nr mieszkania:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="10"
                                    value={apartmentNumber}
                                    onChangeText={setApartmentNumber}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={styles.rowContainer}>
                            <View style={styles.inputHalfContainer}>
                                <Text style={styles.label}>Kod pocztowy:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="00-000"
                                    value={postalCode}
                                    onChangeText={setPostalCode}
                                />
                            </View>

                            <View style={styles.inputHalfContainer}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 15,
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        padding: 16,
    },
    contentContainer: {
        flexDirection: "column",
    },
    collapseButton: {
        position: "absolute",
        right: 10,
        top: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    detailText: {
        fontSize: 16,
        color: "#4b5563",
        marginBottom: 8,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#4b5563",
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    inputHalfContainer: {
        width: "48%",
    },
});

export default PersonalDetails;
