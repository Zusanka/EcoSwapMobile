import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ScrollView,
    StyleSheet,
    Alert,
} from "react-native";
import Navbar from "./Navbar";
import ItemCard from "./ItemCard";

const CategoryPage = ({ route }) => {
    const { categoryName } = route.params;

    const [likedItems, setLikedItems] = useState({});
    const [sortOption, setSortOption] = useState("priceAsc");
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [selectedClothingType, setSelectedClothingType] = useState("All");
    const [selectedSize, setSelectedSize] = useState("All");
    const [selectedCondition, setSelectedCondition] = useState("All");
    const [selectedColor, setSelectedColor] = useState("All");

    const itemsInCategory = [
        { id: 1, name: "T-shirt", dateAdded: "2024-10-29", category: "Moda", price: 29.99, brand: "Stradivarius", image: "1.jpeg" },
        { id: 2, name: "Plecak z eko skóry", dateAdded: "2024-10-30", category: "Moda", price: 49.99, brand: "Zara", image: "2.jpeg" },
        { id: 3, name: "Skórzane buty", dateAdded: "2024-10-30", category: "Obuwie", price: 79.99, brand: "CCC", image: "3.jpeg" },
        { id: 4, name: "Książka", dateAdded: "2024-10-30", category: "Książki", price: 19.99, brand: "Wydawnictwo Znak", image: "4.jpeg" },
        { id: 5, name: "Spódnica zamszowa", dateAdded: "2024-10-30", category: "Moda", price: 15.99, brand: "Orsay", image: "5.jpeg" },
        { id: 6, name: "Koszula w króliki", dateAdded: "2024-10-30", category: "Moda", price: 39.99, brand: "H&M", image: "6.jpeg" },
    ];

    const filteredItems = itemsInCategory.filter(
        (item) => item.category.toLowerCase() === categoryName.toLowerCase()
    );

    const filteredByBrandClothingSizeCondition = filteredItems
        .filter((item) => selectedBrand === "All" || item.brand === selectedBrand)
        .filter((item) => selectedClothingType === "All" || item.clothingType === selectedClothingType)
        .filter((item) => selectedSize === "All" || item.size === selectedSize)
        .filter((item) => selectedCondition === "All" || item.condition === selectedCondition)
        .filter((item) => selectedColor === "All" || item.color === selectedColor);

    const sortItems = (items) => {
        switch (sortOption) {
            case "priceAsc":
                return items.sort((a, b) => a.price - b.price);
            case "priceDesc":
                return items.sort((a, b) => b.price - a.price);
            case "dateAdded":
                return items.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            default:
                return items;
        }
    };

    const handleLikeClick = (itemId) => {
        setLikedItems((prevLikedItems) => ({
            ...prevLikedItems,
            [itemId]: !prevLikedItems[itemId],
        }));
    };

    const sortedItems = sortItems(filteredByBrandClothingSizeCondition);

    return (
        <View style={styles.container}>
            <Navbar />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.header}>Produkty w kategorii: {categoryName}</Text>

                {sortedItems.length === 0 ? (
                    <Text style={styles.noItemsText}>Brak produktów w tej kategorii.</Text>
                ) : (
                    <FlatList
                        data={sortedItems}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <ItemCard
                                item={item}
                                liked={likedItems[item.id]}
                                onLike={() => handleLikeClick(item.id)}
                            />
                        )}
                        contentContainerStyle={styles.list}
                    />
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    content: {
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1e3a8a",
        marginBottom: 16,
    },
    noItemsText: {
        textAlign: "center",
        color: "#888",
        fontSize: 16,
        marginVertical: 20,
    },
    list: {
        paddingBottom: 16,
    },
});

export default CategoryPage;
