import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ImageWithText = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('./assets/recipe5.jpeg')} // Ensure the image is in the correct path under your assets folder
        style={styles.image}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>EcoSwap</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    maxWidth: 400,
    maxHeight: 400,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#28a745',
    fontFamily: 'DancingScript-Regular', // Ensure you have the font correctly set up in your project
  },
});

export default ImageWithText;
