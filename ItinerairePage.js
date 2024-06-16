import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import Collapsible from 'react-native-collapsible';

const GOOGLE_API_KEY = 'AIzaSyAf5qZm6Y0eVYtqQSy86QrHt9sSh6DGWSs'; // Use your actual Google API key

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
      <Collapsible collapsed={collapsed}>
        <Text style={styles.stepDetails}>{step.details}</Text>
        {step.stops && (
          <View>
            {step.stops.map((stop, index) => (
              <Text key={index} style={styles.stopText}>{stop}</Text>
            ))}
          </View>
        )}
      </Collapsible>
    </View>
  );
}

function ItinerairePage({ route }) {
  const { latitude, longitude } = route.params;
  const [routeDetails, setRouteDetails] = useState([]);
  const [selectedMode, setSelectedMode] = useState('DRIVING');
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
      console.log("Current Location:", location.coords); // Logging current location
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (!currentLocation) return;

    console.log("Destination Coordinates:", { latitude, longitude }); // Logging destination coordinates

    const fetchDirections = async (mode) => {
      const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
      const destination = `${latitude},${longitude}`;
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode.toLowerCase()}&key=${GOOGLE_API_KEY}`;

      try {
        const response = await axios.get(url);
        if (response.data.routes.length > 0) {
          const route = response.data.routes[0];
          const steps = route.legs[0].steps.map(step => ({
            mode: mode,
            instruction: step.html_instructions,
            details: `${step.distance.text}, about ${step.duration.text}`,
            stops: step.transit_details ? step.transit_details.stops.map(stop => stop.name) : null
          }));
          setRouteDetails(steps);
        } else {
          console.error("No routes found.");
        }
      } catch (error) {
        console.error("Failed to fetch directions:", error);
      }
    };

    fetchDirections(selectedMode);
  }, [selectedMode, currentLocation]);

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
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

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Text>Change Mode</Text>
      </TouchableOpacity>

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
  modalView: {
    flex: 1,
    marginTop: '50%',
    backgroundColor: 'white',
    padding: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
  },
  stopText: {
    fontSize: 16,
    paddingLeft: 20,
  }
});

export default ItinerairePage;
