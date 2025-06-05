import React from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ImageBackground, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screen from '../components/Screen';
import { DISPLAY_MODES, displayModesConfig } from '../constants/displayModes';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 2.5; // Increased size for better alignment

const DisplayModesScreen = ({ navigation }) => {
    const handleSelectMode = async (mode) => {
        try {
            await AsyncStorage.setItem('displayMode', mode);
            navigation.goBack();
        } catch (error) {
            console.error('Error saving display mode:', error);
        }
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            style={[styles.modeButton, { backgroundColor: 'rgba(30, 105, 217, 0.53)' }]}
            onPress={() => handleSelectMode(item)}
        >
            <Text style={styles.modeText}>
                {displayModesConfig[item].name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <Screen style={styles.container}>
            <ImageBackground
                source={require('../assets/DisplayModesScreenBackground.jpg')}
                style={styles.backgroundImage}
            >
                {/* Box around the heading */}
                <View style={styles.headerBox}>
                    <Text style={styles.title}>Select Display Mode</Text>
                </View>

                {/* Render Grid of Display Modes */}
                <FlatList
                    data={Object.values(DISPLAY_MODES)}
                    renderItem={renderItem}
                    keyExtractor={(item) => item}
                    numColumns={2} // Adjusting layout to arrange squares
                    contentContainerStyle={styles.listContainer}
                />

                {/* Fancy Home Button */}
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => navigation.navigate('HomeScreen')} // Navigate to HomeScreen
                >
                    <Text style={styles.homeButtonIcon}>←</Text>
                </TouchableOpacity>
            </ImageBackground>
        </Screen>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'flex-start',
    },
    container: {
        flex: 1,
        padding: 10,
    },
    headerBox: {
        backgroundColor: 'rgba(30, 105, 217, 0.83)', // Same color as display mode buttons
        borderRadius: 15,
        width: '90%', // Box width proportional to screen
        alignSelf: 'center', // Center horizontally
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        marginBottom: 20, // Space below the box
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white', // More noticeable title text color
        textShadowColor: 'rgba(0, 0, 0, 0.7)', // Add shadow for better contrast
        textShadowRadius: 4,
    },
    listContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20, // Add padding below for spacing
    },
    modeButton: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 15, // Rounded corners for squares
        elevation: 5, // Subtle shadow effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    modeText: {
        color: '#fff',
        fontSize: 18, // Larger font for readability
        fontWeight: 'bold',
        textAlign: 'center',
    },
    homeButton: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        width: 60,
        height: 60,
        borderRadius: 30, // Circular shape
        backgroundColor: 'rgba(30, 105, 217, 0.83)', // Same color as modes
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Shadow for a fancy look
    },
    homeButtonIcon: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default DisplayModesScreen;