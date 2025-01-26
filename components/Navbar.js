import React, { useState } from "react";
import {
    View,
    Text,
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
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            navigation.replace("Home");
        } catch (error) {
            console.log("Error during logout:", error);
        }
    };

    const handleSearch = () => {
        navigation.navigate("SearchResults");
    };

    return (
        <View style={styles.navbar}>
            <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("Home")}
            >
                <Text style={styles.logo}>EcoSwap</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <FontAwesome name="search" size={20} />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate("Favorites")}
                >
                    <FontAwesome name="heart" size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate("Messages")}
                >
                    <FontAwesome name="envelope" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate("MyAccount")}
                >
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
        fontSize: 25,
        fontWeight: "bold",
        color: "#28a745",
        fontFamily: "Dancing Script",
        flex: 1,
        textAlign: "left",
    },
    searchButton: {
        color: "#28a745",
        padding: 8,
        borderRadius: 20,
        marginLeft: 0,
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconButton: {
        marginHorizontal: 8,
    },
    logoutButton: {
        backgroundColor: "red",
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
