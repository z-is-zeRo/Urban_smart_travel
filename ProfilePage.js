import React from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';

function ProfilePage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profil</Text>
      <TextInput style={styles.input} placeholder="Username" />
      <TextInput style={styles.input} placeholder="Name" />
      <TextInput style={styles.input} placeholder="Postal Code" />
      <TextInput style={styles.input} placeholder="Address" />
      <TextInput style={styles.input} placeholder="Email" />
      <Button title="Mettre à jour" onPress={() => {}} />
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
