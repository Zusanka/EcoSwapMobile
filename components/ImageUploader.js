import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";

const ImageUploader = ({ images, onImageUpload, onRemoveImage }) => {
    const handleImagePick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Potrzebne pozwolenie na dostęp do galerii!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImages = result.assets ? result.assets.map((asset) => asset.uri) : [result.uri];
            onImageUpload(selectedImages);
        }
    };

    return (
        <View>
            <Text style={styles.title}>Dodaj zdjęcia:</Text>
            <Text style={styles.subtitle}>*Pierwsze zdjęcie będzie zdjęciem głównym</Text>

            <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleImagePick}
            >
                <Text style={styles.uploadButtonText}>Dodaj pliki</Text>
            </TouchableOpacity>

            <FlatList
                data={[...Array(6)]}
                numColumns={3}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.imageGrid}
                renderItem={({ index }) => (
                    <View style={styles.imageContainer}>
                        {images[index] ? (
                            <View style={styles.imageWrapper}>
                                <Image
                                    source={{ uri: images[index] }}
                                    style={styles.image}
                                />
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => onRemoveImage(index)}
                                >
                                    <FontAwesome name="times" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <FontAwesome name="camera" size={24} color="#ccc" />
                        )}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 12,
        color: "#1e3a8a",
        marginBottom: 16,
    },
    uploadButton: {
        backgroundColor: "#28a745",
        paddingVertical: 12,
        borderRadius: 24,
        alignItems: "center",
        marginBottom: 16,
    },
    uploadButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    imageGrid: {
        gap: 8,
    },
    imageContainer: {
        width: "30%",
        aspectRatio: 1,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        margin: "1%",
    },
    imageWrapper: {
        position: "relative",
        width: "100%",
        height: "100%",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    removeButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#333",
        padding: 4,
        borderRadius: 16,
    },
});

export default ImageUploader;
