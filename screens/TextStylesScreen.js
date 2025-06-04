import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screen from '../components/Screen';

const predefinedTextStyles = [
    // Interlaced font families with diverse styles
    { id: '1', fontFamily: 'Arial', fontSize: 20, fontWeight: 'normal', fontStyle: 'normal', letterSpacing: 0.5 },
    { id: '2', fontFamily: 'Times New Roman', fontSize: 22, fontWeight: 'bold', fontStyle: 'italic', letterSpacing: 1 },
    { id: '3', fontFamily: 'Courier New', fontSize: 18, fontWeight: 'normal', fontStyle: 'italic', letterSpacing: 0.8 },
    { id: '4', fontFamily: 'Comic Sans MS', fontSize: 24, fontWeight: 'bold', fontStyle: 'normal', letterSpacing: 0.6 },
    { id: '5', fontFamily: 'Impact', fontSize: 26, fontWeight: 'normal', fontStyle: 'italic', letterSpacing: 1.2 },
    { id: '6', fontFamily: 'Verdana', fontSize: 20, fontWeight: 'bold', fontStyle: 'normal', letterSpacing: 0.7 },
    { id: '7', fontFamily: 'Georgia', fontSize: 22, fontWeight: 'normal', fontStyle: 'italic', letterSpacing: 1.0 },
    { id: '8', fontFamily: 'FreeMono', fontSize: 18, fontWeight: 'bold', fontStyle: 'normal', letterSpacing: 0.9 },
    { id: '9', fontFamily: 'Brush Script MT', fontSize: 24, fontWeight: 'normal', fontStyle: 'italic', letterSpacing: 1.5 },
    { id: '10', fontFamily: 'Chalkduster', fontSize: 26, fontWeight: 'bold', fontStyle: 'normal', letterSpacing: 0.8 },
    { id: '11', fontFamily: 'Optima', fontSize: 20, fontWeight: 'normal', fontStyle: 'italic', letterSpacing: 0.5 },
    { id: '12', fontFamily: 'Didot', fontSize: 22, fontWeight: 'bold', fontStyle: 'italic', letterSpacing: 1.4 },
    { id: '13', fontFamily: 'OCR A Std', fontSize: 18, fontWeight: 'normal', fontStyle: 'normal', letterSpacing: 1.3 },
    { id: '14', fontFamily: 'Apple Chancery', fontSize: 24, fontWeight: 'bold', fontStyle: 'normal', letterSpacing: 1.6 },
    { id: '15', fontFamily: 'Jazz LET', fontSize: 26, fontWeight: 'normal', fontStyle: 'italic', letterSpacing: 0.9 },
];

const TextStylesScreen = ({ navigation }) => {
    const [selectedTextStyle, setSelectedTextStyle] = useState(predefinedTextStyles[0]);

    const handleStyleSelect = (style) => {
        setSelectedTextStyle(style);
    };

    const handleSaveStyle = async () => {
        try {
            // Save the selected text style to AsyncStorage
            await AsyncStorage.setItem('selectedTextStyle', JSON.stringify(selectedTextStyle));

            alert('Text style saved successfully!');
            navigation.goBack(); // Navigate back to the previous screen
        } catch (error) {
            console.error('Error saving text style:', error);
            alert('Failed to save text style. Please try again.');
        }
    };

    return (
        <Screen style={styles.container}>
            <ImageBackground
                source={require('../assets/TextStylesScreenBackground.jpg')}
                style={styles.backgroundImage}
            >
                <Text style={styles.title}>Choose a Text Style</Text>

                {/* Predefined Text Styles */}
                <FlatList
                    data={predefinedTextStyles}
                    keyExtractor={(item) => item.id}
                    numColumns={2} // Display two text styles per row
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.styleBox,
                                {
                                    borderWidth: selectedTextStyle.id === item.id ? 3 : 0,
                                    borderColor: selectedTextStyle.id === item.id ? '#000' : 'transparent',
                                },
                            ]}
                            onPress={() => handleStyleSelect(item)} // Select the text style on press
                        >
                            <Text
                                style={[
                                    styles.exampleText,
                                    {
                                        fontFamily: item.fontFamily,
                                        fontSize: item.fontSize,
                                        fontWeight: item.fontWeight,
                                        fontStyle: item.fontStyle,
                                        letterSpacing: item.letterSpacing,
                                    },
                                ]}
                            >
                                {item.fontFamily}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveStyle}>
                    <Text style={styles.saveButtonText}>Save Style</Text>
                </TouchableOpacity>
            </ImageBackground>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 5,
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 21,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    styleBox: {
        margin: 10,
        width: 160,
        height: 130,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
        elevation: 3,
    },
    exampleText: {
        textAlign: 'center',
    },
    saveButton: {
        width: '60%',
        backgroundColor: '#3498db',
        borderRadius: 10,
        padding: 15,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 50
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
});

export default TextStylesScreen;