import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    FlatList,
    Image,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { fetchItems, searchUsers,   getProfilePicture,
} from "../api/api";

const SearchResults = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [allItems, setAllItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigation = useNavigation();
    const [profileImage, setProfileImage] = useState(null);


    useEffect(() => {
        const loadAllItems = async () => {
            try {
                const itemsData = await fetchItems();
                if (Array.isArray(itemsData.content)) {
                    setAllItems(itemsData.content);
                } else if (itemsData.items && Array.isArray(itemsData.items)) {
                    setAllItems(itemsData.items);
                } else {
                    console.warn("Unexpected data structure for itemsData:", itemsData);
                    setAllItems([]);
                }
            } catch (error) {
                console.error("Błąd podczas pobierania przedmiotów:", error);
                setError("Nie udało się pobrać przedmiotów. Spróbuj ponownie.");
            }
        };

        loadAllItems();
    }, []);

    const handleSearch = async () => {
        console.log("query: " + searchQuery);

        if (searchQuery.trim() === "") {
            setFilteredItems([]);
            setUser(null);
            setError("");
            return;
        }

        setLoading(true);
        setError("");
        try {
            if (Array.isArray(allItems)) {
                const filtered = allItems.filter((item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setFilteredItems(filtered);
            } else {
                console.warn("allItems is not an array:", allItems);
                setFilteredItems([]);
            }

            const usersData = await searchUsers(searchQuery);

            if (usersData.username) {
                setUser(usersData);
                const profilePicBase64 = await getProfilePicture(usersData.userId);
                if (profilePicBase64) {
                    setProfileImage(`data:image/jpeg;base64,${profilePicBase64}`);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Błąd podczas wyszukiwania:", error);
            setError("Nie udało się wykonać wyszukiwania. Spróbuj ponownie.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchInputChange = (text) => {
        setSearchQuery(text);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.resultCard}
            onPress={() => navigation.navigate("Item", { itemId: item.itemId })}
        >
            {item.images?.length > 0 ? (
                <Image source={{ uri: `data:image/jpeg;base64,${item.images[0].image}`}}
                    style={styles.resultImage} />
            ) : (
                <View style={styles.noImageContainer}>
                    <Text style={styles.noImageText}>Brak zdjęcia</Text>
                </View>
            )}
            <View style={styles.resultDetails}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultBrand}>Marka: {item.brand?.name || "Nieznana"}</Text>
                <Text style={styles.resultDescription} numberOfLines={2}>
                    {item.description || "Brak opisu"}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderUser = () => {
        if (!user) return null;

        return (
            <TouchableOpacity
                style={styles.userCard}
                onPress={() => navigation.navigate("User", { userId: user.userId })}
            >
                <TouchableOpacity style={styles.imageWrapper}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.noAvatarText}>Brak zdjęcia</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <View style={styles.userDetails}>
                    <Text style={styles.userName}>{user.username}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Szukaj rzeczy lub użytkownika..."
                    value={searchQuery}
                    onChangeText={handleSearchInputChange}
                    returnKeyType="search"
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <FontAwesome name="search" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#28a745" />
                    <Text>Ładowanie wyników...</Text>
                </View>
            )}

            {!loading && (
                <View style={styles.resultsContainer}>
                    {/* Sekcja Przedmiotów */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Przedmioty</Text>
                        {filteredItems.length > 0 ? (
                            <FlatList
                                data={filteredItems}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.itemId.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        ) : (
                            <Text style={styles.noResultsText}>Brak przedmiotów pasujących do zapytania.</Text>
                        )}
                    </View>

                    {/* Sekcja Użytkowników */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Użytkownicy</Text>
                        {user ? (
                            renderUser()
                        ) : (
                            <Text style={styles.noResultsText}>Brak użytkowników pasujących do zapytania.</Text>
                        )}
                    </View>

                    {/* Komunikat o błędzie */}
                    {error !== "" && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8f8", padding: 10 },
    searchContainer: {
        flexDirection: "row",
        marginBottom: 15,
        alignItems: "center",
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    searchButton: {
        marginLeft: 10,
        backgroundColor: "#28a745",
        padding: 10,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    resultsContainer: {
        flex: 1,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    resultCard: {
        width: 200,
        marginRight: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    resultImage: {
        width: "100%",
        height: 120,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: "cover",
    },
    noImageContainer: {
        width: "100%",
        height: 120,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    noImageText: {
        fontSize: 14,
        color: "#777",
        textAlign: "center",
    },
    userCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    noAvatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    noAvatarText: {
        fontSize: 10,
        color: "#777",
        textAlign: "center",
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: "#555",
    },
    noResultsText: {
        fontSize: 14,
        color: "#777",
        textAlign: "center",
    },
    errorContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#f8d7da",
        borderRadius: 5,
    },
    errorText: {
        color: "#721c24",
        fontSize: 14,
        textAlign: "center",
    },

    imageWrapper: {
        width: 60,
        height: 60,
        borderRadius: 60,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
    },

    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 60,
        resizeMode: "cover",
    },
    placeholder: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#ccc",
    },


});

export default SearchResults;
