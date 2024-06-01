import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProfilePage({ navigation }) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const userProfile = await AsyncStorage.getItem('userProfile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        setUsername(profile.username);
        setName(profile.name);
        setPostalCode(profile.postalCode);
        setAddress(profile.address);
        setEmail(profile.email);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    const profile = { username, name, postalCode, address, email };
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Activities' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profil</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Postal Code" value={postalCode} onChangeText={setPostalCode} />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <Button title="Mettre à jour" onPress={handleUpdateProfile} />
      <Button title="Déconnexion" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
});

export default ProfilePage;
