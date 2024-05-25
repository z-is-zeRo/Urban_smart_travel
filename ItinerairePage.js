import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const ItinerairePage = ({ route }) => {
  const { event } = route.params;
  const [routeDetails, setRouteDetails] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    };

    fetchCurrentLocation();
  }, []);

  const fetchDirections = async () => {
    if (!currentLocation || !event.location) {
      setError('Current location or event location is not available.');
      return;
    }
    try {
      const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${currentLocation.longitude},${currentLocation.latitude};${event.location.longitude},${event.location.latitude}?geometries=geojson&access_token=pk.eyJ1IjoiemVybzAwMDAiLCJhIjoiY2x3bW90NWQyMGd0ODJqcHM0dTlscnRpaCJ9.eEJ6ykSmA1Fg3Ps9ARjKdg`);
      const directions = response.data.routes[0];
      setRouteDetails({
        coordinates: directions.geometry.coordinates.map(coord => ({ latitude: coord[1], longitude: coord[0] })),
        duration: directions.duration,
        distance: directions.distance
      });
    } catch (error) {
      setError(`Failed to get directions: ${error.message}`);
    }
  };

  if (error) {
    return <View style={styles.container}><Text>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Button title="Get Directions" onPress={fetchDirections} />
      {routeDetails ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Polyline coordinates={routeDetails.coordinates} strokeWidth={4} strokeColor="red" />
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  }
});

export default ItinerairePage;
