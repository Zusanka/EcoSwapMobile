import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Navbar = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = async () => {
        await AsyncStorage.removeItem("userToken");
        navigation.replace("Home");
    };

    const handleSearch = () => {
        if (searchQuery.trim().length > 0) {
            navigation.navigate("SearchResults", { query: searchQuery });
            setSearchQuery("");
        }
    };

    return (
        <View style={styles.navbar}>
            <Text style={styles.logo}>EcoSwap</Text>

            {/* 🔍 Pole wyszukiwania */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Szukaj rzeczy lub użytkownika..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <FontAwesome name="search" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* 🔹 Ikony */}
            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="heart" size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("MyAccount")}>
                    <FontAwesome name="user" size={24} color="#28a745" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Wyloguj</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    logo: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#28a745",
        fontFamily: "Dancing Script",
        flex: 1,
        textAlign: "left",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f1f1f1",
        borderRadius: 20,
        flex: 2,
        marginHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: "#28a745",
        padding: 8,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconButton: {
        marginHorizontal: 8,
    },
    logoutButton: {
        backgroundColor: "#dc3545",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginLeft: 8,
    },
    logoutButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default Navbar;
