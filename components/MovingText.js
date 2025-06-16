import React, { useRef, useEffect } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

const MovingText = ({ text }) => {
    const scrollX = useRef(new Animated.Value(-300)).current; // Start off-screen

    useEffect(() => {
        Animated.loop(
            Animated.timing(scrollX, {
                toValue: 300, // Move text to the right
                duration: 5000,
                useNativeDriver: true,
            })
        ).start();
    }, [scrollX]);

    return (
        <Animated.Text style={[styles.text, { transform: [{ translateX: scrollX }] }]}>
            {text}
        </Animated.Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 24,
        color: 'black',
    },
});

export default MovingText;