import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ChatWindow from './ChatWindow';

const Navbar = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('item');
    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const toggleSearchDropdown = () => {
        setIsSearchDropdownOpen(!isSearchDropdownOpen);
    };

    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        setIsSearchDropdownOpen(false);
    };

    const handleSearchSubmit = () => {
        console.log('Search query:', searchQuery);
        console.log('Search type:', searchType);
    };

    return (
        <View style={styles.navbar}>
            <Text style={styles.logo}>EcoSwap</Text>

            <View style={styles.searchContainer}>
                <TouchableOpacity style={styles.searchTypeButton} onPress={toggleSearchDropdown}>
                    <FontAwesome
                        name={searchType === 'user' ? 'user' : 'box'}
                        size={18}
                        color="white"
                    />
                </TouchableOpacity>
                {isSearchDropdownOpen && (
                    <View style={styles.dropdown}>
                        <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => handleSearchTypeChange('user')}
                        >
                            <FontAwesome name="user" size={16} color="white" />
                            <Text style={styles.dropdownText}>User</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => handleSearchTypeChange('item')}
                        >
                            <FontAwesome name="box" size={16} color="white" />
                            <Text style={styles.dropdownText}>Item</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearchSubmit}
                />
                <FontAwesome name="search" size={16} color="#888" style={styles.searchIcon} />
            </View>

            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={toggleChat} style={styles.iconButton}>
                    <FontAwesome name="comment" size={24} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="heart" size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>Załóż konto</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={isChatOpen} animationType="slide" transparent={true}>
                <ChatWindow onClose={toggleChat} />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    logo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#28a745',
        fontFamily: 'Dancing Script',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 10,
        position: 'relative',
    },
    searchTypeButton: {
        backgroundColor: '#28a745',
        padding: 8,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    dropdown: {
        position: 'absolute',
        top: 40,
        left: 0,
        backgroundColor: '#28a745',
        borderRadius: 8,
        zIndex: 10,
        padding: 8,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    dropdownText: {
        color: 'white',
        marginLeft: 8,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        padding: 8,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        paddingLeft: 12,
    },
    searchIcon: {
        position: 'absolute',
        right: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginHorizontal: 8,
    },
    registerButton: {
        backgroundColor: '#28a745',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    registerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Navbar;
