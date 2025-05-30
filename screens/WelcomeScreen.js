import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

import Screen from '../components/Screen';

const WelcomeScreen = ({ navigation }) => {
    return (
        <Screen>
            {/* Background Image */}
            <ImageBackground
                source={require('../assets/WelcomeScreenBackground.jpg')} // Path to the image
                style={styles.backgroundImage}
            >
                <View style={styles.container}>
                    {/* Title */}
                    <Text style={styles.title}>Welcome to Sparkly!</Text>

                    {/* Register Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('RegisterScreen')}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('LoginScreen')}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </Screen>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1, // Take up the full screen
        resizeMode: 'cover', // Ensure the image covers the entire screen
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: 'rgba(0,0,0,0.3)', // Add semi-transparent overlay for better readability
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 50,
        color: '#fff', // Light color to stand out on background
        textAlign: 'center',
    },
    button: {
        width: '80%',
        height: 50,
        backgroundColor: '#3498db',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5, // Add slight shadow for depth
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default WelcomeScreen;