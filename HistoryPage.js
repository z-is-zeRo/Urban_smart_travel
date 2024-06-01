import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';

function HistoryPage({ navigation }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        if (calendars.length > 0) {
          const calendarId = calendars[0].id;
          const endDate = new Date();
          const startDate = new Date();
          startDate.setMonth(endDate.getMonth() - 2); // Set to two months ago
          const calendarEvents = await Calendar.getEventsAsync([calendarId], startDate, endDate);
          setEvents(calendarEvents.slice(0, 6)); // Get only up to 6 past events
        }
      } else {
        Alert.alert('Permissions required', 'Calendar access is needed to fetch events.');
      }
    }

    fetchEvents();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Historical Activities</Text>
      {events.map((event, index) => (
        <TouchableOpacity key={index} style={styles.item}>
          <Image source={require('./assets/calendar-icon.jpg')} style={styles.icon} />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemText}>{event.title}</Text>
            <Text style={styles.itemDate}>{new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString()}</Text>
          </View>
        </TouchableOpacity>
      ))}
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
    color: '#000',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
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
  }
});

export default HistoryPage;
