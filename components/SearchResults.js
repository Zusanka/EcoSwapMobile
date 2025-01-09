import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SearchResults = ({ route }) => {
    const { query } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Wyniki wyszukiwania dla: "{query}"</Text>
            {/* Tutaj można dodać kod do pobierania wyników */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default SearchResults;
