import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import Navbar from "./Navbar";
import ItemCard from "./ItemCard";
import { getItemsByCategory } from "../api/api";

const CategoryPage = ({ route }) => {
    const { categoryName } = route.params;
    const [likedItems, setLikedItems] = useState({});
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const data = await getItemsByCategory(categoryName);
                setItems(data);
            } catch (error) {
                setError("Nie udało się pobrać danych.");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [categoryName]);

    const handleLikeClick = (itemId) => {
        setLikedItems((prevLikedItems) => ({
            ...prevLikedItems,
            [itemId]: !prevLikedItems[itemId],
        }));
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Navbar />
            <FlatList
                data={items}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                renderItem={({ item }) => (
                    <ItemCard
                        item={item}
                        liked={likedItems[item.id]}
                        onLike={() => handleLikeClick(item.id)}
                    />
                )}
                contentContainerStyle={styles.list}
                nestedScrollEnabled={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        fontSize: 16,
    },
    list: {
        paddingBottom: 16,
    },
});

export default CategoryPage;
