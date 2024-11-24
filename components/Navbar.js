import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import ChatWindow from "./ChatWindow"; 

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
    const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("item");
    const navigation = useNavigation();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleSearchDropdown = () => {
        setIsSearchDropdownOpen(!isSearchDropdownOpen);
        setIsServicesDropdownOpen(false);
    };

    const toggleServicesDropdown = () => {
        setIsServicesDropdownOpen(!isServicesDropdownOpen);
        setIsSearchDropdownOpen(false);
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleSearchSubmit = () => {
        console.log("Search query:", searchQuery);
        console.log("Search type:", searchType);
    };

    return (
        <>
            <View style={styles.navbar}>
                <View style={styles.navContainer}>
                    <TouchableOpacity onPress={toggleMobileMenu} style={styles.menuButton}>
                        <Icon name={isMobileMenuOpen ? "times" : "bars"} size={24} color="gray" />
                    </TouchableOpacity>

                    <Text style={styles.title}>EcoSwap</Text>

                    <View style={styles.searchContainer}>
                        <TouchableOpacity onPress={toggleSearchDropdown} style={styles.searchTypeButton}>
                            <Icon name={searchType === "user" ? "user" : "box"} size={16} color="white" />
                        </TouchableOpacity>
                        <TextInput
                            value={searchQuery}
                            onChangeText={(text) => setSearchQuery(text)}
                            placeholder="Search..."
                            style={styles.searchInput}
                        />
                        <Icon name="search" size={16} color="gray" style={styles.searchIcon} />
                    </View>

                    <View style={styles.actionsContainer}>
                        <TouchableOpacity onPress={toggleChat}>
                            <Icon name="comment" size={24} color="gray" style={styles.actionIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
                            <Icon name="heart" size={24} color="red" style={styles.actionIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Registration')} style={styles.registerButton}>
                            <Text style={styles.registerButtonText}>Załóż konto</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {isMobileMenuOpen && (
                    <ScrollView style={styles.mobileMenu}>
                        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.menuItem}>
                            <Text style={styles.menuItemText}>Home</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('About')} style={styles.menuItem}>
                            <Text style={styles.menuItemText}>About</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Contact')} style={styles.menuItem}>
                            <Text style={styles.menuItemText}>Contact</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Favorites')} style={styles.menuItem}>
                            <Text style={styles.menuItemText}>Ulubione</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Registration')} style={[styles.menuItem, styles.registerButtonMobile]}>
                            <Text style={styles.registerButtonText}>Załóż konto</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>

            {/* Okno czatu */}
            <Modal visible={isChatOpen} animationType="slide">
                <ChatWindow onClose={toggleChat} />
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    navContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    menuButton: {
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontFamily: 'DancingScript-Regular',
        color: 'green',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 16,
    },
    searchTypeButton: {
        backgroundColor: 'green',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
    },
    searchInput: {
        backgroundColor: '#f1f1f1',
        flex: 1,
        paddingHorizontal: 8,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
    },
    searchIcon: {
        position: 'absolute',
        right: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionIcon: {
        marginHorizontal: 8,
    },
    registerButton: {
        backgroundColor: 'green',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 25,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 14,
    },
    mobileMenu: {
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 10,
    },
    menuItem: {
        paddingVertical: 10,
    },
    menuItemText: {
        fontSize: 16,
    },
    registerButtonMobile: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 25,
        marginTop: 10,
    },
});

export default Navbar;
