
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainPage from './MainPage';
import HistoryPage from './HistoryPage';
import PreferencesPage from './PreferencesPage';
import ProfilePage from './ProfilePage';
import ItinerairePage from './ItinerairePage';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Activities">
      <Tab.Screen name="Activities" component={MainPage} />
      <Tab.Screen name="Historique" component={HistoryPage} />
      <Tab.Screen name="Préférences" component={PreferencesPage} />
      <Tab.Screen name="Profil" component={ProfilePage} />
      <Tab.Screen name="Itineraire" component={ItinerairePage} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
