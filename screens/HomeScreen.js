import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Icon library
import Screen from '../components/Screen'; // Import the reusable screen wrapper
import * as ScreenOrientation from 'expo-screen-orientation'; // Handle orientation changes
import { useFocusEffect } from '@react-navigation/native'; // For detecting when the screen gains focus

const HomeScreen = ({ navigation, route }) => {
    const [showSidebar, setShowSidebar] = useState(false); // Toggle sidebar visibility
    const slideAnim = useState(new Animated.Value(300))[0]; // Animation starts off-screen to the right
    const [text, setText] = useState(''); // User input state

    // Hook: Lock the orientation to portrait when returning to HomeScreen
    useEffect(() => {
        const resetOrientation = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        };
        resetOrientation();
    }, []);

    // Hook: Trigger when the screen comes into focus (e.g., after navigating back)
    useFocusEffect(
        React.useCallback(() => {
            // If the screen is navigated to with a parameter, update the text state
            if (route.params?.text) {
                setText(route.params.text); // Set the text from `SavedTextsScreen`
            }
        }, [route.params])
    );

    // Handle animation of the sidebar
    const handleHeartClick = () => {
        // Trigger sidebar animation
        setShowSidebar(!showSidebar);
        Animated.timing(slideAnim, {
            toValue: showSidebar ? 300 : 0, // Slide in or out
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const handleSidebarNavigation = (screenName) => {
        navigation.navigate(screenName);
    };

    const handleEnterPress = () => {
        if (!text.trim()) {
            alert('Please enter a message!');
            return;
        }
        navigation.navigate('MovingTextScreen', { message: text });
    };

    const handleClearText = () => {
        setText(''); // Clear the input text
    };

    return (
        <Screen>
            {/* Background Image */}
            <ImageBackground
                source={require('../assets/HomeScreen_pic.jpg')}
                style={styles.backgroundImage}
            >
                {/* Top Bar with "Hello Sparkly" and Heart Icon */}
                <View style={styles.topBar}>
                    <Text style={styles.topBarText}>Hello Sparkly!</Text>
                    <TouchableOpacity onPress={handleHeartClick}>
                        <View style={styles.heartIcon}>
                            <Ionicons name="heart" size={24} color="#ffffff" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Center Content: Input Box and Enter Button */}
                <View style={styles.centerContent}>
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your message"
                            value={text}
                            onChangeText={setText}
                        />
                        {/* Refresh Icon aligned perfectly with text box */}
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

                {/* Sidebar Buttons */}
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
                    ].map((btn, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.sidebarButton,
                                {
                                    width: Math.max(150 - index * 30, 100), // Shrinking width
                                    top: index * 60, // Progressively increase top position (for diagonal layout)
                                    right: 0, // Keep right edges constant
                                },
                            ]}
                            onPress={() => handleSidebarNavigation(btn.screen)}
                        >
                            <Text
                                style={[
                                    styles.sidebarButtonText,
                                    { fontSize: Math.max(15 - index * 2, 10) }, // Shrinking font size
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

const styles = StyleSheet.create({
    // [Styles unchanged from original code]
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