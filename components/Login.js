import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>EcoSwap</Text>
        <Text style={styles.welcomeText}>Witaj ponownie!</Text>
        <Text style={styles.subHeaderText}>Zaloguj się przez e-mail:</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Wpisz login"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hasło</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
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

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Nie pamiętasz hasła?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Zaloguj się</Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>lub zaloguj się przez</Text>
          <View style={styles.divider} />
        </View>

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

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Nie masz jeszcze konta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
            <Text style={styles.registerLink}>Zarejestruj się</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/pexels-cottonbro-4068314.jpg')}
          style={styles.backgroundImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>EcoSwap</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
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
  welcomeText: {
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
  forgotPassword: {
    fontSize: 14,
    color: '#1e40af',
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: '#38a169',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
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
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  registerLink: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  imageContainer: {
    flex: 1,
    display: 'none', // Możesz ustawić 'flex: 1' i usunąć 'display' jeśli używasz na dużych ekranach.
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
});

export default Login;
