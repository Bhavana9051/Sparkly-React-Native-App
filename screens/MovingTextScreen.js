import React, { useEffect, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Text,
} from 'react-native';
import { DISPLAY_MODES, displayModesConfig } from '../constants/displayModes';
import FloatingEmojis from '../components/FloatingEmojis';
import LEDBorder from '../components/LEDBorder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { Marquee } from '@animatereactnative/marquee';
import { CommonActions } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';

const MovingTextScreen = ({ route, navigation }) => {
    const { message } = route.params || { message: "Please provide valid text" }; // Fallback for message
    const [theme, setTheme] = useState({ textColor: '#fff', backgroundColor: '#000' });
    const [textStyle, setTextStyle] = useState({});
    const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
    const [textSize, setTextSize] = useState(route.params?.textSize || 50);
    const [scrollSpeed, setScrollSpeed] = useState(route.params?.scrollSpeed || 1);
    const [scrollDirection, setScrollDirection] = useState(route.params?.scrollDirection || 'RightToLeft');
    const [useTicker, setUseTicker] = useState(route.params?.useTicker ?? true);
    const [isMultiLine, setIsMultiLine] = useState(route.params?.isMultiLine || false);
    const [displayMode, setDisplayMode] = useState(DISPLAY_MODES.DEFAULT);

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

        fetchThemeAndStyle(); // Fetch both theme and text style
        return () => {
            subscription?.remove();
        };
    }, []);

    useEffect(() => {
        fetchDisplayMode();
    }, []);


    const fetchDisplayMode = async () => {
        try {
            const savedMode = await AsyncStorage.getItem('displayMode');
            if (savedMode) {
                setDisplayMode(savedMode);
            }
        } catch (error) {
            console.error('Error fetching display mode:', error);
        }
    };


    const fetchThemeAndStyle = async () => {
        try {
            const savedTextStyleRaw = await AsyncStorage.getItem('selectedTextStyle');
            const savedThemeRaw = await AsyncStorage.getItem('selectedTheme');
            const customThemeRaw = await AsyncStorage.getItem('customTheme');

            const savedTextStyle = savedTextStyleRaw ? JSON.parse(savedTextStyleRaw) : null;
            const savedTheme = savedThemeRaw ? JSON.parse(savedThemeRaw) : null;
            const customTheme = customThemeRaw ? JSON.parse(customThemeRaw) : null;

            let activeTheme;

            if (savedTheme && customTheme) {
                activeTheme = customTheme.savedAt > savedTheme.savedAt ? customTheme : savedTheme;
            } else if (customTheme) {
                activeTheme = customTheme;
            } else if (savedTheme) {
                activeTheme = savedTheme;
            } else {
                activeTheme = { textColor: '#fff', backgroundColor: '#000' };
            }

            setTheme({
                textColor: activeTheme.textColor || '#fff',
                backgroundColor: activeTheme.backgroundColor || '#000',
            });

            if (savedTextStyle) {
                setTextStyle(savedTextStyle); // Update the text style
            }
        } catch (error) {
            console.error('Error fetching theme or text style:', error);
        }
    };

    const getMarqueeDirection = () => {
        if (scrollDirection === 'RightToLeft') {
            return { direction: 'horizontal', reverse: false };
        } else if (scrollDirection === 'LeftToRight') {
            return { direction: 'horizontal', reverse: true };
        } else if (scrollDirection === 'TopToBottom') {
            return { direction: 'vertical', reverse: true };
        } else if (scrollDirection === 'BottomToTop') {
            return { direction: 'vertical', reverse: false };
        }
    };

    const getFontSize = () => {
        const baseSize = Math.min(screenDimensions.width, screenDimensions.height);
        return (textSize / 100) * baseSize * 0.8;
    };

    const renderDisplayEffects = () => {
        const config = displayModesConfig[displayMode];

        switch (displayMode) {
            case DISPLAY_MODES.FLOATING_EMOJIS:
            case DISPLAY_MODES.SNOWFLAKES:
            case DISPLAY_MODES.SPARKLES:
                return (
                    <FloatingEmojis
                        emojis={config.emojis}
                        count={30}
                        size={24}
                    />
                );

            case DISPLAY_MODES.LED_BORDER:
                return <LEDBorder />;

            default:
                return null;
        }
    };

    const getTextEffects = () => {
        return displayModesConfig[displayMode]?.textEffect || {};
    };

    const renderSingleLineText = () => {
        if (!useTicker) {
            return (
                <View style={styles.singleLineContainer}>
                    <Text
                        style={[
                            styles.text,
                            {
                                fontSize: getFontSize(),
                                color: theme.textColor,
                                fontFamily: textStyle?.fontFamily,
                                fontWeight: textStyle?.fontWeight,
                                fontStyle: textStyle?.fontStyle,
                                letterSpacing: textStyle?.letterSpacing,
                            },
                            getTextEffects()
                        ]}
                    >
                        {message}
                    </Text>
                </View>
            );
        }

        const { direction, reverse } = getMarqueeDirection();

        return (
            <View style={styles.singleLineContainer}>
                <Marquee
                    spacing={20}
                    speed={scrollSpeed}
                    direction={direction}
                    reverse={reverse}
                    style={{ width: '100%' }}
                >
                    <Text
                        style={[
                            styles.text,
                            {
                                fontSize: getFontSize(),
                                color: theme.textColor,
                                fontFamily: textStyle?.fontFamily,
                                fontWeight: textStyle?.fontWeight,
                                fontStyle: textStyle?.fontStyle,
                                letterSpacing: textStyle?.letterSpacing,
                            },
                            getTextEffects()
                        ]}
                    >
                        {message}
                    </Text>
                </Marquee>
            </View>
        );
    };

    const renderMultiLineText = () => {
        if (!message) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: theme.textColor }, getTextEffects()]}>
                        No message provided to display.
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.multiLineContainer}>
                {message.split(' ').map((word, index) => (
                    <Text
                        key={index}
                        style={[
                            styles.multiLineText,
                            {
                                fontSize: getFontSize(),
                                color: theme.textColor,
                                fontFamily: textStyle?.fontFamily,
                                fontWeight: textStyle?.fontWeight,
                                fontStyle: textStyle?.fontStyle,
                                letterSpacing: textStyle?.letterSpacing,
                            },
                            getTextEffects()
                        ]}
                    >
                        {word}
                    </Text>
                ))}
            </View>
        );
    };

    return (
        <Screen style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            {renderDisplayEffects()}
            {isMultiLine ? renderMultiLineText() : renderSingleLineText()}

            {/* Navigate to Settings Screen */}
            <TouchableOpacity
                style={[styles.settingsButton, { backgroundColor: theme.textColor }]}
                onPress={() =>
                    navigation.navigate('Settings', {
                        textSize,
                        scrollSpeed,
                        scrollDirection,
                        useTicker,
                        isMultiLine,
                        theme,
                        message: message || "Please provide valid text", // Pass message to SettingsScreen
                    })
                }
            >
                <Ionicons name="settings" size={30} color={theme.backgroundColor} />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.returnButton, { backgroundColor: theme.textColor }]}
                onPress={() => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'HomeScreen' }], // Reset the stack to start with HomeScreen
                        })
                    );
                }}
            >
                <Ionicons name="arrow-back" size={30} color={theme.backgroundColor} />
            </TouchableOpacity>
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
        textAlign: 'center',
    },
    multiLineText: {
        marginVertical: 5,
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontWeight: 'bold',
        fontSize: 18,
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
});

export default MovingTextScreen;