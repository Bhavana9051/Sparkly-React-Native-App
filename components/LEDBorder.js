import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';

const LEDBorder = ({ color = '#ff00ff', speed = 2000, width = 4 }) => {
    const progress = useSharedValue(0);
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    React.useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration: speed, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: progress.value * (screenWidth - 100) }
            ]
        };
    });

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Top border */}
            <View style={[styles.borderTop, { height: width }]}>
                <Animated.View
                    style={[
                        styles.led,
                        { backgroundColor: color, width: 100 },
                        animatedStyle
                    ]}
                />
            </View>

            {/* Other borders would be similar */}
        </View>
    );
};

const styles = StyleSheet.create({
    borderTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
    led: {
        height: '100%',
    }
});

export default LEDBorder;