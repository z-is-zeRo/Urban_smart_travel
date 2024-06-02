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
          name="Main"  // Ceci mènera au TabNavigator incluant MainPage
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ItinerairePage"  // Ajout d'ItinerairePage ici
          component={ItinerairePage}
          options={{ headerShown: true }}  // Vous pouvez ajuster ceci si nécessaire
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
