import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ActivitiesScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [form, setForm] = useState('signin');

  const storeUser = async (username, password) => {
    if (username.trim() === '' || password.trim() === '') {
      alert('Username and password cannot be empty.');
      return;
    }
    try {
      await AsyncStorage.setItem(username, password);
      alert('User registered successfully!');
      navigation.navigate('Main', { screen: 'Activities' });
    } catch (e) {
      alert('Failed to save the user.');
    }
  };

  const verifyUser = async (username, password) => {
    if (username.trim() === '' || password.trim() === '') {
      alert('Username and password cannot be empty.');
      return;
    }
    try {
      const storedPassword = await AsyncStorage.getItem(username);
      if (storedPassword !== null && storedPassword === password) {
        navigation.navigate('Main', { screen: 'Activities' });
      } else {
        alert('Invalid username or password!');
      }
    } catch (e) {
      alert('Failed to sign in.');
    }
  };

  const handleSignUp = () => {
    if (username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      alert('Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    storeUser(username, password);
  };

  const handleSignIn = () => {
    verifyUser(username, password);
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.jpeg')} style={styles.logo} />
      <Text style={styles.title}>Urban Smart Travel</Text>
      <Text style={styles.subtitle}>Application</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, form === 'signin' ? styles.activeButton : {}]}
          onPress={() => setForm('signin')}>
          <Text style={styles.buttonText}>SIGN IN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, form === 'signup' ? styles.activeButton : {}]}
          onPress={() => setForm('signup')}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>

      {form === 'signin' ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.connectButton} onPress={handleSignIn}>
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity style={styles.connectButton} onPress={handleSignUp}>
            <Text style={styles.connectButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 18,
    color: 'grey',
    marginBottom: 16
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 8
  },
  activeButton: {
    backgroundColor: 'blue'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  form: {
    width: '80%'
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5
  },
  connectButton: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

export default ActivitiesScreen;
