import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

function HistoryPage({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Mon historique</Text>

      <TouchableOpacity style={styles.item}>
        <Image source={require('./assets/eglise.jpeg')} style={styles.icon} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemText}>Aller à Lourdes</Text>
          <Text style={styles.itemDate}>14.04.24 à 12h30</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Image source={require('./assets/hopital.jpeg')} style={styles.icon} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemText}>Rdv avec le médecin</Text>
          <Text style={styles.itemDate}>19.01.24 à 12h30</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Image source={require('./assets/ecole.jpeg')} style={styles.icon} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemText}>Aller à l’école</Text>
          <Text style={styles.itemDate}>11.03.24 à 16h20</Text>
        </View>
      </TouchableOpacity>

      {/* Bouton d'ajout en bas de l'écran */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // À ajuster selon le thème de votre application
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000', // À ajuster selon le thème de votre application
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // À ajuster selon le thème de votre application
    padding: 10,
    borderRadius: 10, // Arrondir les coins
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#000', 
  },
  itemDate: {
    fontSize: 14,
    color: '#666', 
  },
  addButton: {
    backgroundColor: '#000', 
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  }
});

export default HistoryPage;
