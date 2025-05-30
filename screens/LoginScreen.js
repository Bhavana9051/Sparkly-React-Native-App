import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, ImageBackground } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import Screen from '../components/Screen';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const storedUser = await SecureStore.getItemAsync('user');
            if (!storedUser) {
                Alert.alert('Error', 'No user registered. Please register first.');
                return;
            }
            const { email: savedEmail, password: savedPassword } = JSON.parse(storedUser);

            if (email === savedEmail && password === savedPassword) {
                Alert.alert('Success', 'Logged in successfully!');
                navigation.replace('HomeScreen'); // Navigate to the main feature screen
            } else {
                Alert.alert('Error', 'Invalid email or password.');
            }
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
                source={require('../assets/LoginScreenBackground.jpg')} // Path to the image
                style={styles.backgroundImage}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Login</Text>

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

                    {/* Login Button */}
                    <Button title="Login" onPress={handleLogin} />

                    {/* Gmail Login Button */}
                    <Button
                        title="Continue with Gmail"
                        onPress={handleGmailLogin}
                        color="#db4437" // Gmail Red Color for Button
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
        backgroundColor: 'rgba(0,0,0,0.3)', // Add semi-transparent overlay for better readability
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#fff', // Light color to stand out on the background image
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 10,
        width: '80%',
        marginBottom: 15,
        backgroundColor: '#fff', // Keep input fields isolated visually
    },
});

export default LoginScreen;