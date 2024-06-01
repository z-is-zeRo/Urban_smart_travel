import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import MainPage from './MainPage';
import HistoryPage from './HistoryPage';
import PreferencesPage from './PreferencesPage';
import ProfilePage from './ProfilePage';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Main':
              iconName = focused ? require('./assets/act.png') : require('./assets/act.png');
              break;
            case 'Historique':
              iconName = focused ? require('./assets/hist.png') : require('./assets/hist.png');
              break;
            case 'Préférences':
              iconName = focused ? require('./assets/param.png') : require('./assets/param.png');
              break;
            case 'Profil':
              iconName = focused ? require('./assets/prof.png') : require('./assets/prof.png');
              break;
          }
          return <Image source={iconName} style={{ width: size, height: size }} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
      initialRouteName="Main"
    >
      <Tab.Screen name="Main" component={MainPage} />
      <Tab.Screen name="Historique" component={HistoryPage} />
      <Tab.Screen name="Préférences" component={PreferencesPage} />
      <Tab.Screen name="Profil" component={ProfilePage} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
