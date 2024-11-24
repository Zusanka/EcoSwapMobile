import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";
import * as ImagePicker from 'expo-image-picker';

const ImageUploader = ({ images, onImageUpload, onRemoveImage }) => {
    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            onImageUpload(result.assets.map(asset => asset.uri));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Dodaj zdjęcia:</Text>
            <Text style={styles.subText}>*Pierwsze zdjęcie będzie zdjęciem głównym</Text>

            <TouchableOpacity
                onPress={handleImagePick}
                style={styles.uploadButton}
            >
                <Text style={styles.uploadButtonText}>Dodaj pliki</Text>
            </TouchableOpacity>

            <View style={styles.imageGrid}>
                {[...Array(6)].map((_, index) => (
                    <View key={index} style={styles.imageContainer}>
                        {images[index] ? (
                            <View style={styles.imageWrapper}>
                                <Image
                                    source={{ uri: images[index] }}
                                    style={styles.image}
                                />
                                <TouchableOpacity
                                    onPress={() => onRemoveImage(index)}
                                    style={styles.removeButton}
                                >
                                    <FontAwesomeIcon icon={faTimes} size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <FontAwesomeIcon icon={faCamera} size={32} color="#888" />
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    uploadButton: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 15,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imageContainer: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    imageWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 5,
        borderRadius: 12,
    },
});

export default ImageUploader;
