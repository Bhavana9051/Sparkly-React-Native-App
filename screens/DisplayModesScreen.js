import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Screen from '../components/Screen';

const DisplayModesScreen = () => {
    return (
        <Screen style={styles.container}>
            <Text style={styles.text}>Display Modes Customization Screen</Text>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
});

export default DisplayModesScreen;