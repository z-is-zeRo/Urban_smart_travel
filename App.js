import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActivitiesScreen from './ActivitiesScreen';
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
          name="Main"  // Ceci mènera au TabNavigator incluant MainPage faut pas que je forget ça
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
