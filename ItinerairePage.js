import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOOGLE_API_KEY = 'AIzaSyAf5qZm6Y0eVYtqQSy86QrHt9sSh6DGWSs';
const FLASK_API_URL = 'http://192.168.1.24:5001/predict';

const icons = {
  DRIVING: require('./assets/car.png'),
  WALKING: require('./assets/pieds3.png'),
  BICYCLING: require('./assets/velo2.png'),
  TRANSIT: require('./assets/bus3.png'),
};

function TransportIcon({ mode }) {
  return <Image source={icons[mode]} style={styles.iconStyle} />;
}

function RouteStep({ step }) {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <View style={styles.stepContainer}>
      <TouchableOpacity onPress={() => setCollapsed(!collapsed)} style={styles.stepHeader}>
        <TransportIcon mode={step.mode} />
        <Text style={styles.stepText}>{step.instruction.replace(/<[^>]+>/g, '')}</Text>
      </TouchableOpacity>
      {!collapsed && (
        <View style={styles.stepDetails}>
          <Text>{step.details}</Text>
          {step.stops && step.stops.map((stop, index) => (
            <Text key={index} style={styles.stopText}>{stop}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

function ItinerairePage({ route }) {
  const { latitude, longitude, eventName, eventAddress } = route.params;
  const [routeDetails, setRouteDetails] = useState([]);
  const [selectedMode, setSelectedMode] = useState(null); // Now null initially
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission not granted');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      determineTransportMode(location.coords); // Determine mode after getting location
    };
    getCurrentLocation();
  }, []);

  // Example function to determine transport mode based on multiple factors
  const determineTransportMode = async (location) => {
    const weather = await fetchWeatherData(location.latitude, location.longitude); // Example call to fetch weather
    const timeOfDay = new Date().getHours();
    const distance = calculateDistance(location, { latitude, longitude }); // Placeholder function

    // Example rule-based logic
    if (distance > 10) {
      setSelectedMode('DRIVING');
    } else if (weather.temp < 5 || weather.condition === 'rainy') {
      setSelectedMode('TRANSIT');
    } else if (timeOfDay > 6 && timeOfDay < 22) {
      setSelectedMode('WALKING');
    } else {
      setSelectedMode('BICYCLING');
    }
  };

  // Placeholder to fetch weather
  const fetchWeatherData = async (lat, lon) => {
    // Your API call logic here
    return { temp: 22, condition: 'sunny' }; // Mocked data
  };

  // Placeholder to calculate distance
  const calculateDistance = (origin, destination) => {
    return Math.sqrt(Math.pow(destination.latitude - origin.latitude, 2) + Math.pow(destination.longitude - origin.longitude, 2));
  };

  useEffect(() => {
    if (selectedMode && currentLocation) {
      fetchDirections(selectedMode);
    }
  }, [selectedMode, currentLocation]);

  const fetchDirections = async (mode) => {
    const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
    const destination = `${latitude},${longitude}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode.toLowerCase()}&key=${GOOGLE_API_KEY}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK' && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const steps = route.legs[0].steps.map(step => ({
          mode: mode,
          instruction: step.html_instructions,
          details: `${step.distance.text}, about ${step.duration.text}`,
          stops: step.transit_details ? step.transit_details.stops.map(stop => stop.name) : []
        }));
        setRouteDetails(steps);
      } else {
        console.error("No routes found.");
        setRouteDetails([]);
      }
    } catch (error) {
      console.error("Failed to fetch directions:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoHeader}>
        <Text style={styles.eventName}>{eventName}</Text>
        <Text style={styles.eventAddress}>{eventAddress}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.changeModeButton}>
          <Text style={styles.changeModeText}>{selectedMode || 'Select Mode'}</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalCompactView}>
          {Object.keys(icons).map((mode) => (
            <TouchableOpacity key={mode} onPress={() => {
              setSelectedMode(mode);
              setModalVisible(false);
            }}>
              <Text style={styles.modalText}>{mode}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      <MapView
        style={styles.map}
        region={{
          latitude: currentLocation ? currentLocation.latitude : latitude,
          longitude: currentLocation ? currentLocation.longitude : longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {currentLocation && <Marker coordinate={currentLocation} title={"Your Location"} />}
        <Marker coordinate={{ latitude, longitude }} title={"Destination"} />
      </MapView>

      <ScrollView style={styles.stepsContainer}>
        {routeDetails.map((step, index) => (
          <RouteStep key={index} step={step} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    height: 300,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  stepsContainer: {
    flex: 1,
    padding: 10,
  },
  stepContainer: {
    marginBottom: 10,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    padding: 10,
  },
  stepText: {
    marginLeft: 10,
  },
  stepDetails: {
    padding: 10,
    paddingLeft: 35,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  modalCompactView: {
    marginTop: '50%',
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
  },
  stopText: {
    fontSize: 16,
    paddingLeft: 20,
  },
  infoHeader: {
    padding: 10,
    backgroundColor: 'lightgrey',
    margin: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  transportMode: {
    fontSize: 16,
    color: '#666',
  },
  changeModeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'grey',
    padding: 5,
    borderRadius: 10,
    elevation: 2,
  },
  changeModeText: {
    color: 'white',
    fontSize: 12,
  },
});

export default ItinerairePage;
