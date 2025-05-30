import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, ImageBackground } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import Screen from '../components/Screen';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        try {
            // Save credentials securely
            await SecureStore.setItemAsync('user', JSON.stringify({ email, password }));

            Alert.alert('Success', 'Registration complete!');
            navigation.replace('LoginScreen'); // Navigate to login for first login
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
    };

    const handleGmailLogin = () => {
        Alert.alert('Gmail Authentication', 'Mock Gmail login successful!');
        navigation.replace('HomeScreen'); // Simulate successful Gmail login
    };

    return (
        <Screen>
            {/* Background Image */}
            <ImageBackground
                source={require('../assets/RegisterScreenBackground.jpg')} // Path to the background image
                style={styles.backgroundImage}
            >
                <View style={styles.container}>
                    {/* Title */}
                    <Text style={styles.title}>Register</Text>

                    {/* Email Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* Password Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        secureTextEntry
                        onChangeText={setPassword}
                    />

                    {/* Register Button */}
                    <Button title="Register" onPress={handleRegister} />

                    {/* Gmail Login Button */}
                    <Button
                        title="Continue with Gmail"
                        onPress={handleGmailLogin}
                        color="#db4437" // Gmail button with red color
                    />
                </View>
            </ImageBackground>
        </Screen>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1, // Take up the full screen
        resizeMode: 'cover', // Cover the entire screen with the image
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent overlay for readability
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#fff', // White color for title text to stand out on the background
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 10,
        width: '80%',
        marginBottom: 15,
        backgroundColor: '#fff', // Keep inputs readable
    },
});

export default RegisterScreen;