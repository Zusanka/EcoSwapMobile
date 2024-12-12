import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ImageWithText = () => {
  return (
      <View style={styles.container}>
        <Image
            source={require("./recipe5.jpeg")} // Upewnij się, że ścieżka do obrazu jest poprawna
            style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>EcoSwap</Text>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  textContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#28a745",
    textAlign: "center",
    fontFamily: "DancingScript-Regular", // Dodaj niestandardową czcionkę, jeśli została zaimportowana
  },
});

export default ImageWithText;
