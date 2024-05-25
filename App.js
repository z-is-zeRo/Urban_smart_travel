import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator'; // Ensure this file correctly imports and sets up all needed screens.

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator /> // This will handle all the screen navigation.
    </NavigationContainer>
  );
}
