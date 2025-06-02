import React, { useEffect, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Text,
    Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import TextTicker from 'react-native-text-ticker';
import * as ScreenOrientation from 'expo-screen-orientation';

const MovingTextScreen = ({ route, navigation }) => {
    const { message } = route.params || { message: "Please provide valid text" };
    const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
    const [theme, setTheme] = useState({ textColor: '#fff', backgroundColor: '#000' });
    const [textSize, setTextSize] = useState(50);
    const [scrollDirection, setScrollDirection] = useState('RightToLeft'); // Default scroll direction
    const [isMultiLine, setIsMultiLine] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [useTicker, setUseTicker] = useState(false); // Toggle scrolling

    useEffect(() => {
        const unlockOrientation = async () => {
            await ScreenOrientation.unlockAsync();
        };
        unlockOrientation();
        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        };
    }, []);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenDimensions(window);
        });

        fetchTheme();
        return () => {
            subscription.remove();
        };
    }, []);

    const getFontSize = () => {
        const baseSize = Math.min(screenDimensions.width, screenDimensions.height);
        return (textSize / 100) * baseSize * 0.8;
    };

    const toggleSettingsModal = () => {
        setShowSettings(!showSettings);
    };

    const fetchTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('selectedTheme');
            const customTheme = await AsyncStorage.getItem('customTheme');
            const activeTheme = savedTheme ? JSON.parse(savedTheme) : JSON.parse(customTheme);

            if (activeTheme) {
                setTheme({
                    textColor: activeTheme.textColor || '#fff',
                    backgroundColor: activeTheme.backgroundColor || '#000',
                });
            }
        } catch (error) {
            console.error('Error fetching theme:', error);
        }
    };

    const renderSingleLineText = () => {
        const fontSize = getFontSize();

        if (useTicker) {
            return (
                <View style={styles.singleLineContainer}>
                    <TextTicker
                        style={{
                            fontSize,
                            color: theme.textColor,
                        }}
                        duration={scrollDirection.includes('Right') || scrollDirection.includes('Left') ? 5000 : 10000} // Duration depends on direction
                        loop
                        bounce={false} // Ticker-style scrolling only
                        repeatSpacer={50} // Space between repetitions
                        marqueeDelay={500} // Delay before the marquee starts scrolling
                    >
                        {message}
                    </TextTicker>
                </View>
            );
        }

        return (
            <View style={styles.singleLineContainer}>
                <Text style={[styles.text, { fontSize, color: theme.textColor }]}>
                    {message}
                </Text>
            </View>
        );
    };

    const renderMultiLineText = () => (
        <View style={styles.multiLineContainer}>
            {message.split(' ').map((word, index) => (
                <Text key={index} style={[styles.multiLineText, { fontSize: getFontSize(), color: theme.textColor }]}>
                    {word}
                </Text>
            ))}
        </View>
    );

    return (
        <Screen style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            {isMultiLine ? renderMultiLineText() : renderSingleLineText()}

            <TouchableOpacity
                style={[styles.settingsButton, { backgroundColor: theme.textColor }]}
                onPress={toggleSettingsModal}
            >
                <Ionicons name="settings" size={30} color={theme.backgroundColor} />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.returnButton, { backgroundColor: theme.textColor }]}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={30} color={theme.backgroundColor} />
            </TouchableOpacity>

            <Modal
                visible={showSettings}
                animationType="slide"
                transparent={true}
                onRequestClose={toggleSettingsModal}
            >
                <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.9)' }]}>
                    <Text style={[styles.modalTitle, { color: theme.textColor }]}>Text Display Settings</Text>

                    <View style={styles.sliderContainer}>
                        <Text style={[styles.sliderLabel, { color: theme.textColor }]}>Text Size: {textSize}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={30}
                            maximumValue={100}
                            step={1}
                            value={textSize}
                            onValueChange={setTextSize}
                            minimumTrackTintColor={theme.textColor}
                            maximumTrackTintColor="#666"
                            thumbTintColor={theme.textColor}
                        />
                    </View>

                    <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Scroll Direction</Text>
                    <View style={styles.directionOptions}>
                        {['RightToLeft', 'LeftToRight', 'TopToBottom', 'BottomToTop'].map(direction => (
                            <TouchableOpacity
                                key={direction}
                                style={[
                                    styles.optionButton,
                                    scrollDirection === direction && styles.selectedOption,
                                    { borderColor: theme.textColor },
                                ]}
                                onPress={() => setScrollDirection(direction)}
                                disabled={!useTicker} // Disable direction changes when ticker is off
                            >
                                <Text
                                    style={[
                                        styles.optionButtonText,
                                        { color: scrollDirection === direction ? theme.backgroundColor : theme.textColor },
                                        scrollDirection === direction && { fontWeight: 'bold' },
                                    ]}
                                >
                                    {direction.replace(/([A-Z])/g, ' $1').trim()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            useTicker && styles.selectedOption,
                            { borderColor: theme.textColor },
                        ]}
                        onPress={() => setUseTicker(!useTicker)}
                    >
                        <Text
                            style={[
                                styles.toggleButtonText,
                                { color: useTicker ? theme.backgroundColor : theme.textColor },
                                useTicker && { fontWeight: 'bold' },
                            ]}
                        >
                            {useTicker ? 'Scroll (On)' : 'Scroll (Off)'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: theme.textColor }]}
                        onPress={toggleSettingsModal}
                    >
                        <Text style={[styles.closeButtonText, { color: theme.backgroundColor }]}>Apply Settings</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    singleLineContainer: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
    },
    multiLineContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    multiLineText: {
        fontWeight: 'bold',
        marginVertical: 5,
        textAlign: 'center',
    },
    settingsButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    returnButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    sliderContainer: {
        width: '100%',
        marginBottom: 30,
    },
    sliderLabel: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        alignSelf: 'flex-start',
    },
    directionOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 25,
    },
    optionButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        margin: 5,
        borderRadius: 8,
        borderWidth: 1,
    },
    selectedOption: {
        backgroundColor: '#fff',
    },
    optionButtonText: {
        fontSize: 14,
    },
    toggleButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 30,
    },
    toggleButtonText: {
        fontSize: 16,
        textAlign: 'center',
    },
    closeButton: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MovingTextScreen;