import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ThemesScreen from '../screens/ThemesScreen';
import SavedTextsScreen from '../screens/SavedTextsScreen';
import TextStylesScreen from '../screens/TextStylesScreen';
import DisplayModesScreen from '../screens/DisplayModesScreen';
import MovingTextScreen from '../screens/MovingTextScreen';
import CustomPaletteScreen from '../screens/CustomPaletteScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      {/* Define stack navigator */}
      <Stack.Navigator initialRouteName="WelcomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ThemesScreen" component={ThemesScreen} />
        <Stack.Screen name="CustomPaletteScreen" component={CustomPaletteScreen} />
        <Stack.Screen name="SavedTextsScreen" component={SavedTextsScreen} />
        <Stack.Screen name="TextStylesScreen" component={TextStylesScreen} />
        <Stack.Screen name="DisplayModesScreen" component={DisplayModesScreen} />
        <Stack.Screen name="MovingTextScreen" component={MovingTextScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;