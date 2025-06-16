import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Animated,
    BackHandler,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation, route }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const slideAnim = useState(new Animated.Value(300))[0];
    const [text, setText] = useState('');

    useEffect(() => {
        const resetOrientation = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        };
        resetOrientation();
    }, []);

    // Fixed BackHandler with proper subscription pattern
    useFocusEffect(
        useCallback(() => {
            if (route.params?.text) {
                setText(route.params.text);
            }

            const onBackPress = () => {
                Alert.alert(
                    'Hold on!',
                    'Are you sure you want to exit the app?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        { text: 'Exit', onPress: () => BackHandler.exitApp() },
                    ]
                );
                return true;
            };

            // Correct event subscription
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress
            );

            // Proper cleanup method
            return () => backHandler.remove();
        }, [route.params])
    );

    const handleHeartClick = () => {
        setShowSidebar(!showSidebar);
        Animated.timing(slideAnim, {
            toValue: showSidebar ? 300 : 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const handleSidebarNavigation = (screenName) => {
        navigation.navigate(screenName);
    };

    // Smoother logout function
    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'WelcomeScreen' }],
        });
    };

    const handleEnterPress = () => {
        if (!text.trim()) {
            alert('Please enter a message!');
            return;
        }
        navigation.navigate('MovingTextScreen', { message: text });
    };

    const handleClearText = () => {
        setText('');
    };

    return (
        <Screen>
            <ImageBackground
                source={require('../assets/HomeScreen_pic.jpg')}
                style={styles.backgroundImage}
            >
                <View style={styles.topBar}>
                    <Text style={styles.topBarText}>Hello Sparkly!</Text>
                    <TouchableOpacity onPress={handleHeartClick}>
                        <View style={styles.heartIcon}>
                            <Ionicons name="heart" size={24} color="#ffffff" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.centerContent}>
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your message"
                            value={text}
                            onChangeText={setText}
                        />
                        <TouchableOpacity onPress={handleClearText} style={styles.refreshIcon}>
                            <Ionicons name="refresh" size={24} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.enterButton}
                        onPress={handleEnterPress}
                    >
                        <Text style={styles.enterButtonText}>Enter</Text>
                    </TouchableOpacity>
                </View>

                <Animated.View
                    style={[
                        styles.sidebar,
                        { transform: [{ translateX: slideAnim }] },
                    ]}
                >
                    {[
                        { label: 'Themes', screen: 'ThemesScreen' },
                        { label: 'Saved Texts', screen: 'SavedTextsScreen' },
                        { label: 'Text Styles', screen: 'TextStylesScreen' },
                        { label: 'Display Modes', screen: 'DisplayModesScreen' },
                        { label: 'Logout', screen: 'WelcomeScreen', action: handleLogout },
                    ].map((btn, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.sidebarButton,
                                {
                                    width: Math.max(150 - index * 20, 100),
                                    top: index * 60,
                                    right: 0,
                                },
                            ]}
                            onPress={btn.action ? btn.action : () => handleSidebarNavigation(btn.screen)}
                        >
                            <Text
                                style={[
                                    styles.sidebarButtonText,
                                    { fontSize: Math.max(15 - index * 2, 10) },
                                ]}
                            >
                                {btn.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            </ImageBackground>
        </Screen>
    );
};

// Styles remain unchanged from original
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'flex-start',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 20,
    },
    topBarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6495ed',
    },
    heartIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3498db',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    enterButton: {
        backgroundColor: '#3498db',
        borderRadius: 25,
        width: 150,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    enterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    inputGroup: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: '85%',
        height: 50,
        borderColor: '#bdc3c7',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    refreshIcon: {
        position: 'absolute',
        left: 250,
        top: 12,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#3498db',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sidebar: {
        position: 'absolute',
        top: 100,
        right: 10,
        backgroundColor: 'transparent',
    },
    sidebarButton: {
        height: 40,
        marginBottom: 10,
        backgroundColor: '#2980b9',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    sidebarButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default HomeScreen;