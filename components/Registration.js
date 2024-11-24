import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Registration = () => {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleRegister = () => {
    const joinDate = new Date().toISOString(); 
    // Simulate saving data to local storage (use AsyncStorage for real apps)
    console.log('Zapisano dane:', { login, email, password, joinDate });
    Alert.alert("Rejestracja", "Rejestracja zakończona pomyślnie");
    navigation.navigate('PersonDetails');
  };

  return (
    <View style={styles.container}>
      {/* Sekcja z obrazem */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/pexels-cottonbro-4068314.jpg')}
          style={styles.backgroundImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>EcoSwap</Text>
        </View>
      </View>

      {/* Sekcja formularza */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>EcoSwap</Text>
        <Text style={styles.headerText}>Zarejestruj się!</Text>
        <Text style={styles.subHeaderText}>Utwórz swoje konto:</Text>
        
        {/* Pole login */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Login</Text>
          <TextInput
            style={styles.input}
            value={login}
            onChangeText={setLogin}
            placeholder="Wpisz login"
          />
        </View>
        
        {/* Pole e-mail */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Wpisz e-mail"
          />
        </View>
        
        {/* Pole hasło */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hasło</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Wpisz hasło"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
              <Icon
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Przycisk rejestracji */}
        <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Zarejestruj się</Text>
        </TouchableOpacity>

        {/* Linie podziału */}
        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>lub zarejestruj się przez</Text>
          <View style={styles.divider} />
        </View>

        {/* Przyciski rejestracji z social media */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#DB4437' }]}>
            <Icon name="google" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#4267B2' }]}>
            <Icon name="facebook" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#C13584' }]}>
            <Icon name="instagram" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Link do logowania */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Masz już konto?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Zaloguj się</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1,
    display: 'none', // Można to zmienić na 'flex: 1' w przypadku dużych ekranów.
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  overlayText: {
    fontSize: 48,
    color: 'white',
    fontFamily: 'DancingScript-Regular',
  },
  formContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    color: '#38a169',
    textAlign: 'center',
    fontFamily: 'DancingScript-Regular',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4b5563',
    marginBottom: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingVertical: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  registerButton: {
    backgroundColor: '#38a169',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  orText: {
    fontSize: 14,
    color: '#6b7280',
    paddingHorizontal: 8,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default Registration;
