import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, TextInput } from 'react-native';
import * as Calendar from 'expo-calendar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyAf5qZm6Y0eVYtqQSy86QrHt9sSh6DGWSs';

const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`);
    if (response.data.status === 'OK') {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error('Geocoding failed with status: ' + response.data.status);
    }
  } catch (error) {
    console.error('Failed to geocode address', error);
    throw error;
  }
};

function MainPage() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchEvents() {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        if (calendars.length > 0) {
          const calendarId = calendars[0].id;
          const startDate = new Date();
          const endDate = new Date();
          endDate.setFullYear(startDate.getFullYear() + 1);
          const calendarEvents = await Calendar.getEventsAsync([calendarId], startDate, endDate);
          const eventsWithLocation = calendarEvents.filter(event => event.location);
          setEvents(eventsWithLocation);
        }
      } else {
        Alert.alert('Permissions required', 'Calendar access is needed to fetch events.');
      }
    }

    fetchEvents();
  }, []);

  const handleEventPress = async (event) => {
    if (event.location && (event.location.startsWith('http://') || event.location.startsWith('https://'))) {
      Linking.openURL(event.location);
    } else if (event.location) {
      try {
        const location = await geocodeAddress(event.location);
        navigation.navigate('ItinerairePage', {
          latitude: location.latitude,
          longitude: location.longitude,
          eventName: event.title,
          eventAddress: event.location
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to process location data');
      }
    } else {
      Alert.alert('Error', 'No location data available for this event');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.jpeg')} style={styles.logo} />
      <Text style={styles.header}>Scheduled Activities</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search activities..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView style={styles.scrollView}>
        {events.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.activityItem}
            onPress={() => handleEventPress(event)}
          >
            <Image source={require('./assets/calendar-icon.jpg')} style={styles.icon} />
            <Text style={styles.activityText}>{event.title} - {new Date(event.startDate).toLocaleDateString()}</Text>
          </TouchableOpacity>
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
  logo: {
    width: '100%',
    height: 200,
    alignSelf: 'center',
    marginTop: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  searchBar: {
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  scrollView: {
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  activityText: {
    fontSize: 16,
  }
});

export default MainPage;
