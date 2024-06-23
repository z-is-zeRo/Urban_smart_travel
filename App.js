import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox } from 'react-native';
import ActivitiesScreen from './ActivitiesScreen';
import ItinerairePage from './ItinerairePage';
import TabNavigator from './TabNavigator';

// Ignorer tous les avertissements de logs
LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Activities">
        <Stack.Screen 
          name="Activities" 
          component={ActivitiesScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main"  
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ItinerairePage"  
          component={ItinerairePage}
          options={{ headerShown: true }}  
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
