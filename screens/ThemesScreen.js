import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Persist selected theme
import Screen from '../components/Screen';
import Ionicons from '@expo/vector-icons/Ionicons'; // Fancy button icon

const predefinedThemes = [
    { id: '1', textColor: '#000000', backgroundColor: '#ecf0f1', letter: 'Aa' },
    { id: '2', textColor: '#ffffff', backgroundColor: '#8e44ad', letter: 'Bb' },
    { id: '3', textColor: '#000000', backgroundColor: '#f39c12', letter: 'Cc' },
    { id: '4', textColor: '#ffffff', backgroundColor: '#2ecc71', letter: 'Dd' },
    { id: '5', textColor: '#ffffff', backgroundColor: '#e74c3c', letter: 'Ee' },
    { id: '6', textColor: '#ffffff', backgroundColor: '#3498db', letter: 'Ff' },
    { id: '7', textColor: '#ffffff', backgroundColor: '#34495e', letter: 'Gg' },
    { id: '8', textColor: '#ffffff', backgroundColor: '#1abc9c', letter: 'Hh' },
    { id: '9', textColor: '#ffffff', backgroundColor: '#f1c40f', letter: 'Ii' },
    { id: '10', textColor: '#000000', backgroundColor: '#7f8c8d', letter: 'Jj' },
];

const ThemesScreen = ({ navigation }) => {
    const [selectedTheme, setSelectedTheme] = useState(predefinedThemes[0]); // Default to the first theme

    const handleThemeSelect = (theme) => {
        setSelectedTheme(theme); // Update the current selected theme
    };

    const handleSaveTheme = async () => {
        try {
            // Include a timestamp to track when this theme was saved
            const themeData = {
                textColor: selectedTheme.textColor,
                backgroundColor: selectedTheme.backgroundColor,
                savedAt: new Date().getTime(), // Save the current time
            };

            // Save the selected theme to AsyncStorage
            await AsyncStorage.setItem('selectedTheme', JSON.stringify(themeData));

            alert('Theme saved successfully!');
            navigation.goBack(); // Navigate back to the calling screen
        } catch (error) {
            console.error('Error saving theme:', error);
            alert('Failed to save theme. Please try again.');
        }
    };

    const handleCustomPalettePress = () => {
        navigation.navigate('CustomPaletteScreen'); // Navigate to the custom palette screen
    };

    const handleReturnToHome = () => {
        navigation.navigate('HomeScreen'); // Navigate back to the home screen
    };

    return (
        <Screen>
            <ImageBackground
                source={require('../assets/ThemesScreenBackground.jpg')}
                style={styles.backgroundImage}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Choose a Theme</Text>

                    {/* Predefined Themes */}
                    <FlatList
                        data={predefinedThemes}
                        keyExtractor={(item) => item.id}
                        numColumns={2} // Display two themes per row
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.themeBox,
                                    {
                                        backgroundColor: item.backgroundColor,
                                        borderWidth: selectedTheme.id === item.id ? 3 : 0,
                                        borderColor: selectedTheme.id === item.id ? '#000' : 'transparent',
                                    },
                                ]}
                                onPress={() => handleThemeSelect(item)} // Select the theme on press
                            >
                                <Text style={{ color: item.textColor, fontSize: 22, fontWeight: 'bold' }}>
                                    {item.letter} {/* Display the theme letter */}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />

                    {/* Save Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveTheme}>
                        <Text style={styles.saveButtonText}>Save Theme</Text>
                    </TouchableOpacity>

                    {/* Custom Palette and Home Buttons */}
                    <TouchableOpacity style={styles.customButton} onPress={handleCustomPalettePress}>
                        <Ionicons name="color-palette" size={30} color="#ffffff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.homeButton} onPress={handleReturnToHome}>
                        <Ionicons name="home" size={30} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </Screen>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#4A0072',
        textAlign: 'center',
    },
    themeBox: {
        margin: 10,
        width: 140,
        height: 140,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    saveButton: {
        width: '60%',
        backgroundColor: '#A5A40f',
        borderRadius: 10,
        padding: 15,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    customButton: {
        position: 'absolute',
        right: 20,
        bottom: 50,
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#8e44ad',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    homeButton: {
        position: 'absolute',
        left: 20,
        bottom: 50,
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#4A0072',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});

export default ThemesScreen;