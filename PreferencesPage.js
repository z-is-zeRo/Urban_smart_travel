import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function PreferencesPage({ navigation }) {
  const [transportExpanded, setTransportExpanded] = useState(false);
  const [commuteExpanded, setCommuteExpanded] = useState(false);
  const [handicapExpanded, setHandicapExpanded] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState('');
  const [selectedCommute, setSelectedCommute] = useState('');
  const [isHandicapped, setIsHandicapped] = useState('');

  useEffect(() => {
    const fetchPreferences = async () => {
      const savedTransport = await AsyncStorage.getItem('selectedTransport');
      const savedCommute = await AsyncStorage.getItem('selectedCommute');
      const savedHandicap = await AsyncStorage.getItem('isHandicapped');
      if (savedTransport) {
        setSelectedTransport(savedTransport);
      }
      if (savedCommute) {
        setSelectedCommute(savedCommute);
      }
      if (savedHandicap) {
        setIsHandicapped(savedHandicap);
      }
    };

    fetchPreferences();
  }, []);

  const handleSelectTransport = async (transport) => {
    setSelectedTransport(transport);
    await AsyncStorage.setItem('selectedTransport', transport);
  };

  const handleSelectCommute = async (commute) => {
    setSelectedCommute(commute);
    await AsyncStorage.setItem('selectedCommute', commute);
  };

  const handleSelectHandicap = async (option) => {
    setIsHandicapped(option);
    await AsyncStorage.setItem('isHandicapped', option);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Préférences</Text>
      
      <TouchableOpacity 
        style={styles.preferenceItem} 
        onPress={() => setTransportExpanded(!transportExpanded)}
      >
        <Image source={require('./assets/transport.jpeg')} style={styles.icon} />
        <Text style={styles.label}>Transport préféré</Text>
      </TouchableOpacity>
      {transportExpanded && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectTransport('Voiture')}>
            <Image source={require('./assets/car.png')} style={styles.icon} />
            <Text style={selectedTransport === 'Voiture' ? styles.selectedOption : {}}>Voiture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectTransport('Vélo')}>
            <Image source={require('./assets/velo.png')} style={styles.icon} />
            <Text style={selectedTransport === 'Vélo' ? styles.selectedOption : {}}>Vélo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectTransport('Marche')}>
            <Image source={require('./assets/marche.png')} style={styles.icon} />
            <Text style={selectedTransport === 'Marche' ? styles.selectedOption : {}}>Marche à pieds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectTransport('Commun')}>
            <Image source={require('./assets/commun.jpeg')} style={styles.icon} />
            <Text style={selectedTransport === 'Commun' ? styles.selectedOption : {}}>Commun</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={styles.preferenceItem} 
        onPress={() => setCommuteExpanded(!commuteExpanded)}
      >
        <Image source={require('./assets/public-trans.png')} style={styles.icon} />
        <Text style={styles.label}>Transports en commun</Text>
      </TouchableOpacity>
      {commuteExpanded && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectCommute('Metro')}>
            <Image source={require('./assets/metro.png')} style={styles.icon} />
            <Text style={selectedCommute === 'Metro' ? styles.selectedOption : {}}>Métro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectCommute('Tram')}>
            <Image source={require('./assets/tram.png')} style={styles.icon} />
            <Text style={selectedCommute === 'Tram' ? styles.selectedOption : {}}>Tram</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectCommute('Bus')}>
            <Image source={require('./assets/bus2.png')} style={styles.icon} />
            <Text style={selectedCommute === 'Bus' ? styles.selectedOption : {}}>Bus</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={styles.preferenceItem} 
        onPress={() => setHandicapExpanded(!handicapExpanded)}
      >
        <Image source={require('./assets/handicape.png')} style={styles.icon} />
        <Text style={styles.label}>Handicapé</Text>
      </TouchableOpacity>
      {handicapExpanded && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectHandicap('Oui')}>
            <Text style={isHandicapped === 'Oui' ? styles.selectedOption : {}}>Oui</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectHandicap('Non')}>
            <Text style={isHandicapped === 'Non' ? styles.selectedOption : {}}>Non</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
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
    marginRight: 10,
  },
  optionsContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  selectedOption: {
    fontWeight: 'bold',
    color: 'blue',
  }
});

export default PreferencesPage;
