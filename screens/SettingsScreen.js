import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';

const SettingsScreen = ({ navigation, route }) => {
    const { textSize, scrollSpeed, scrollDirection, useTicker, isMultiLine, theme, message } = route.params;

    const [updatedTextSize, setUpdatedTextSize] = useState(textSize);
    const [updatedScrollSpeed, setUpdatedScrollSpeed] = useState(scrollSpeed);
    const [updatedScrollDirection, setUpdatedScrollDirection] = useState(scrollDirection);
    const [updatedUseTicker, setUpdatedUseTicker] = useState(useTicker);
    const [updatedIsMultiLine, setUpdatedIsMultiLine] = useState(isMultiLine);
    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window')); // Track dimensions

    // Monitor screen orientation changes
    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setWindowDimensions(window); // Update dimensions dynamically
        });

        // Cleanup subscription properly
        return () => {
            subscription?.remove();
        };
    }, []);

    // Determine if the current screen orientation is landscape
    const isLandscape = windowDimensions.width > windowDimensions.height;

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: theme.backgroundColor },
                isLandscape ? { paddingHorizontal: 20 } : { padding: 10 }, // Adjust for landscape
            ]}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.scrollViewContent,
                    { minHeight: windowDimensions.height }, // Ensure ScrollView works in any orientation
                ]}
            >
                <Text style={[styles.title, { color: theme.textColor }]}>Text Display Settings</Text>

                {/* Text Size Slider */}
                <View style={styles.sliderContainer}>
                    <Text style={[styles.sliderLabel, { color: theme.textColor }]}>Text Size: {updatedTextSize}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={30}
                        maximumValue={100}
                        step={1}
                        value={updatedTextSize}
                        onValueChange={setUpdatedTextSize}
                        minimumTrackTintColor={theme.textColor}
                        maximumTrackTintColor="#666"
                        thumbTintColor={theme.textColor}
                    />
                </View>

                {/* Scroll Speed Slider */}
                <View style={styles.sliderContainer}>
                    <Text style={[styles.sliderLabel, { color: theme.textColor }]}>Scroll Speed: {updatedScrollSpeed}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0.5}
                        maximumValue={5}
                        step={0.1}
                        value={updatedScrollSpeed}
                        onValueChange={setUpdatedScrollSpeed}
                        minimumTrackTintColor={theme.textColor}
                        maximumTrackTintColor="#666"
                        thumbTintColor={theme.textColor}
                    />
                </View>

                {/* Scroll Direction Options */}
                <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Scroll Direction</Text>
                <View style={styles.directionOptions}>
                    {['RightToLeft', 'LeftToRight', 'TopToBottom', 'BottomToTop'].map((direction) => (
                        <TouchableOpacity
                            key={direction}
                            onPress={() => setUpdatedScrollDirection(direction)}
                            style={[
                                styles.button,
                                updatedScrollDirection === direction && styles.selectedButton,
                                { borderColor: theme.textColor },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    {
                                        color:
                                            updatedScrollDirection === direction
                                                ? theme.backgroundColor
                                                : theme.textColor,
                                    },
                                ]}
                            >
                                {direction.replace(/([A-Z])/g, ' $1').trim()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Toggle Multi-Line Text */}
                <TouchableOpacity
                    onPress={() => setUpdatedIsMultiLine(!updatedIsMultiLine)}
                    style={[styles.button, updatedIsMultiLine && styles.selectedButton]}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            updatedIsMultiLine ? { color: theme.backgroundColor } : { color: theme.textColor },
                        ]}
                    >
                        {updatedIsMultiLine ? 'Multi-Line (On)' : 'Multi-Line (Off)'}
                    </Text>
                </TouchableOpacity>

                {/* Toggle Scroll Ticker */}
                <TouchableOpacity
                    onPress={() => setUpdatedUseTicker(!updatedUseTicker)}
                    style={[styles.button, updatedUseTicker && styles.selectedButton]}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            updatedUseTicker ? { color: theme.backgroundColor } : { color: theme.textColor },
                        ]}
                    >
                        {updatedUseTicker ? 'Scroll (On)' : 'Scroll (Off)'}
                    </Text>
                </TouchableOpacity>

                {/* Apply Settings Button */}
                <TouchableOpacity
                    style={[styles.applyButton, { backgroundColor: theme.textColor }]}
                    onPress={() =>
                        navigation.navigate('MovingTextScreen', {
                            textSize: updatedTextSize,
                            scrollSpeed: updatedScrollSpeed,
                            scrollDirection: updatedScrollDirection,
                            useTicker: updatedUseTicker,
                            isMultiLine: updatedIsMultiLine,
                            message,
                        })
                    }
                >
                    <Text style={[styles.applyButtonText, { color: theme.backgroundColor }]}>Apply Settings</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    sliderContainer: {
        width: '90%',
        marginBottom: 20,
    },
    sliderLabel: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    directionOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    button: {
        marginVertical: 5,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderRadius: 8,
    },
    selectedButton: {
        backgroundColor: '#fff',
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
    },
    applyButton: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginBottom: 10,
    },
    applyButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SettingsScreen;