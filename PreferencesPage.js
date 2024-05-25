import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

function PreferencesPage({ navigation }) {
  const [transportExpanded, setTransportExpanded] = useState(false);
  const [proprieteExpanded, setProprieteExpanded] = useState(false);
  const [handicapExpanded, setHandicapExpanded] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Préférences</Text>
      
      {/* Transport préféré */}
      <TouchableOpacity 
        style={styles.preferenceItem} 
        onPress={() => setTransportExpanded(!transportExpanded)}
      >
        <Image source={require('./assets/transport.jpeg')} style={styles.icon} />
        <Text style={styles.label}>Transport préféré</Text>

      </TouchableOpacity>
      {transportExpanded && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton}><Text>Voiture</Text></TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}><Text>Vélo</Text></TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}><Text>Marche à pieds</Text></TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}><Text>Transport en commun</Text></TouchableOpacity>
        </View>
      )}

      {/* Propriétés */}
      {/* ... Votre code pour la section Propriétés ici ... */}

      {/* Handicapé */}
      {/* ... Votre code pour la section Handicap ici ... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  arrowIcon: {
    width: 15,
    height: 15,
  },
  optionsContainer: {
    backgroundColor: '#f0f0f0', 
    padding: 10,
  },
  optionButton: {
    padding: 10,
  },
});

export default PreferencesPage;
