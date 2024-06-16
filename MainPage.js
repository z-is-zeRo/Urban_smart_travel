import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, TextInput } from 'react-native';
import * as Calendar from 'expo-calendar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyAf5qZm6Y0eVYtqQSy86QrHt9sSh6DGWSs';

const geocodeAddress = async (address) => {
  try {
    const formattedAddress = address.replace(/[^a-zA-Z0-9\s,]/g, ''); 
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(formattedAddress)}&key=${GOOGLE_API_KEY}`);
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

const openCalendarToAddEvent = async () => {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status === 'granted') {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    if (calendars.length > 0) {
      const defaultCalendar = calendars.find(cal => cal.allowsModifications) || calendars[0];
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 heures plus tard
      try {
        const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
          title: 'Nouvel Événement',
          startDate,
          endDate,
          timeZone: 'Europe/Paris'
        });
        await Calendar.openEventInCalendar(eventId);
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'événement: ", error);
      }
    } else {
      Alert.alert("Aucun calendrier disponible pour ajouter un événement");
    }
  } else {
    Alert.alert("Permission refusée", "L'application a besoin de la permission pour accéder au calendrier.");
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
          const eventsWithLocation = await Promise.all(calendarEvents.map(async event => {
            if (event.location && typeof event.location === 'string') {
              const location = await geocodeAddress(event.location);
              return { ...event, location, originalLocation: event.location };
            }
            return event;
          }));
          setEvents(eventsWithLocation);
        }
      } else {
        Alert.alert('Permissions required', 'Calendar access is needed to fetch events.');
      }
    }

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={require('./assets/logo.jpeg')} style={styles.logo} />
        <Text style={styles.header}>Scheduled Activities</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search activities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {filteredEvents.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.activityItem}
            onPress={() => {
              if (event.location) {
                navigation.navigate('ItinerairePage', {
                  latitude: event.location.latitude,
                  longitude: event.location.longitude,
                  eventName: event.title,
                  eventAddress: event.originalLocation
                });
              } else {
                Alert.alert('Error', 'No location data available for this event');
              }
            }}
          >
            <Image source={require('./assets/calendar-icon.jpg')} style={styles.icon} />
            <Text style={styles.activityText}>{event.title} - {new Date(event.startDate).toLocaleDateString()}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={openCalendarToAddEvent} style={styles.addButton}>
          <Image source={require('./assets/add2.png')} style={styles.addIcon} />
        </TouchableOpacity>
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
  },
  addButton: {
    alignItems: 'center',
    padding: 10,
  },
  addIcon: {
    width: 50,
    height: 50,
  }
});

export { geocodeAddress };
export default MainPage;
