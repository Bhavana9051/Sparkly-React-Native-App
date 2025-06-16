import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Screen from '../components/Screen';

const CustomPaletteScreen = ({ navigation }) => {
    const [textColor, setTextColor] = useState('#ffffff'); // Default text color
    const [backgroundColor, setBackgroundColor] = useState('#000000'); // Default background color

    const handleSaveCustomTheme = async () => {
        try {
            // Add the timestamp to the saved theme
            const customTheme = {
                textColor,
                backgroundColor,
                savedAt: new Date().getTime(), // Save the current timestamp
            };

            // Save the custom theme to AsyncStorage
            await AsyncStorage.setItem('customTheme', JSON.stringify(customTheme));
            alert('Custom theme saved successfully!');
            navigation.goBack(); // Navigate back to ThemesScreen or previous screen
        } catch (error) {
            console.error('Error saving custom theme:', error);
            alert('Failed to save theme. Please try again.');
        }
    };

    return (
        <Screen>
            <ImageBackground
                source={require('../assets/CustomPaletteScreenBackground.jpg')} // Full-screen image
                style={styles.backgroundImage}
            >
                <SafeAreaView style={styles.container}>
                    {/* Preview Area */}
                    <View
                        style={[
                            styles.previewBox,
                            { backgroundColor: backgroundColor }, // Dynamically change background color
                        ]}
                    >
                        <Text style={{ color: textColor, fontSize: 22 }}>Preview Text</Text>
                    </View>

                    {/* Color Picker for Background Color */}
                    <Text style={styles.title}>Pick Background Color</Text>
                    <ColorPicker
                        color={backgroundColor}
                        onColorChange={(color) => setBackgroundColor(color)} // Update background color dynamically
                        thumbSize={30}
                        sliderSize={15}
                        style={styles.colorPicker}
                    />

                    {/* Color Picker for Text Color */}
                    <Text style={styles.title}>Pick Text Color</Text>
                    <ColorPicker
                        color={textColor}
                        onColorChange={(color) => setTextColor(color)} // Update text color dynamically
                        thumbSize={30}
                        sliderSize={15}
                        style={styles.colorPicker}
                    />

                    {/* Save Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveCustomTheme}>
                        <Text style={styles.saveButtonText}>Save Custom Theme</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </ImageBackground>
        </Screen>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1, // Takes up the whole screen
        resizeMode: 'cover', // Cover the entire screen with the image
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent', // Ensure views are overlayed on the image
        paddingHorizontal: 15,
    },
    previewBox: {
        width: '100%',
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 10, // Increase space below preview
    },
    title: {
        fontSize: 17,
        color: '#ec156f',
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 5, // Increase spacing for better appearance
    },
    colorPicker: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginBottom: 20, // Increase spacing to avoid overlap
    },
    saveButton: {
        backgroundColor: '#3498db',
        borderRadius: 25,
        padding: 15,
        marginBottom: 30, // Ensure button placement avoids navbar overlap
        alignItems: 'center',
        width: '100%',
        alignSelf: 'center', // Centers button horizontally
    },
    saveButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default CustomPaletteScreen;