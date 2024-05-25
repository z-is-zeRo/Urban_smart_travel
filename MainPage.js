import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

function MainPage() {
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEvents = async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        if (calendars.length > 0) {
          const calendarId = calendars[0].id;
          const startDate = new Date();
          const endDate = new Date(startDate.getFullYear() + 1);

          const calendarEvents = await Calendar.getEventsAsync([calendarId], startDate, endDate);
          const eventsWithLocation = await Promise.all(calendarEvents.map(async event => {
            if (event.location) {
              try {
                const location = await geocodeAddress(event.location);
                return { ...event, location };
              } catch (error) {
                console.error('Geocoding failed for:', event.location, error);
                return event; // Return the event without location if geocoding fails
              }
            }
            return event;
          }));
          setEvents(eventsWithLocation);
        }
      } else {
        Alert.alert('Permissions required', 'Calendar access is needed to fetch events');
      }
    };

    fetchEvents();
  }, []);

  const geocodeAddress = async (address) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
      const response = await axios.get(url);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={require('./assets/logo.jpeg')} style={styles.logo} />
        <Text style={styles.header}>Scheduled Activities</Text>
        {events.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.activityItem}
            onPress={() => {
              if (event.location) {
                navigation.navigate('Itineraire', { event });
              } else {
                Alert.alert('Error', 'No location data available for this event');
              }
            }}
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
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
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
