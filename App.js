import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActivitiesScreen from './ActivitiesScreen';
import ItinerairePage from './ItinerairePage';  // Assurez-vous que ce chemin est correct
import TabNavigator from './TabNavigator';

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
