import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyAf5qZm6Y0eVYtqQSy86QrHt9sSh6DGWSs';

function ItinerairePage() {
  const [routeDetails, setRouteDetails] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCurrentLocationAndDirections = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);

        // Using static coordinates for origin and destination
        fetchDirections(
          { latitude: 37.77, longitude: -122.447 }, // Origin coordinates
          { latitude: 37.768, longitude: -122.511 } // Destination coordinates
        );
      } catch (err) {
        setError('Failed to fetch current location: ' + err.message);
      }
    };

    fetchCurrentLocationAndDirections();
  }, []);

  const fetchDirections = async (startCoords, destinationCoords) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${startCoords.latitude},${startCoords.longitude}&destination=${destinationCoords.latitude},${destinationCoords.longitude}&mode=transit&key=${GOOGLE_API_KEY}`);
      if (response.data.status === 'OK') {
        const points = decodePolyline(response.data.routes[0].overview_polyline.points);
        setRouteDetails({
          coordinates: points,
          duration: response.data.routes[0].legs[0].duration.text,
          distance: response.data.routes[0].legs[0].distance.text
        });
      } else {
        throw new Error(`Directions request failed with status: ${response.data.status}`);
      }
    } catch (error) {
      setError(`Failed to get directions: ${error.message}`);
    }
  };

  function decodePolyline(encoded) {
    let poly = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      poly.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return poly;
  }

  if (error) {
    return <View style={styles.container}><Text>{error}</Text></View>;
  }

  if (!currentLocation) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Get Directions" onPress={() => fetchDirections(currentLocation, { latitude: 37.768, longitude: -122.511 })} />
      {routeDetails ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker coordinate={{ latitude: 37.768, longitude: -122.511 }} title="Destination" />
          <Polyline coordinates={routeDetails.coordinates} strokeWidth={4} strokeColor="red" />
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  }
});

export default ItinerairePage;
