import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ImageBackground,
    TextInput,
    Modal,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store'; // Or AsyncStorage
import { Swipeable } from 'react-native-gesture-handler'; // Swipe to delete

import Screen from '../components/Screen';

const SAVED_TEXTS_KEY = 'saved_texts';

const SavedTextsScreen = ({ navigation }) => {
    const [savedTexts, setSavedTexts] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [inputText, setInputText] = useState('');

    // Load saved texts on mount
    React.useEffect(() => {
        const loadSavedTexts = async () => {
            const storedTexts = await SecureStore.getItemAsync(SAVED_TEXTS_KEY);
            if (storedTexts) {
                setSavedTexts(JSON.parse(storedTexts));
            }
        };
        loadSavedTexts();
    }, []);

    const saveTextsToStorage = async (texts) => {
        await SecureStore.setItemAsync(SAVED_TEXTS_KEY, JSON.stringify(texts));
    };

    const handleAddText = () => {
        if (!inputText.trim()) {
            Alert.alert('Error', 'Text cannot be empty!');
            return;
        }
        const newSavedTexts = [...savedTexts, inputText];
        setSavedTexts(newSavedTexts);
        saveTextsToStorage(newSavedTexts);
        setInputText('');
        setModalVisible(false);
    };

    const handleUseText = (text) => {
        Alert.alert(
            'Confirm',
            'Do you want to use this text?',
            [
                { text: 'Cancel' },
                { text: 'Yes', onPress: () => navigation.navigate('HomeScreen', { text }) },
            ],
            { cancelable: true }
        );
    };

    const handleDeleteText = (textToDelete) => {
        const updatedTexts = savedTexts.filter((text) => text !== textToDelete);
        setSavedTexts(updatedTexts);
        saveTextsToStorage(updatedTexts); // Save updated list to local storage
        Alert.alert('Deleted', 'Text successfully deleted.');
    };

    const renderSavedText = ({ item }) => {
        const renderRightAction = () => (
            <TouchableOpacity
                style={styles.swipeActionButton}
                onPress={() => handleDeleteText(item)}
            >
                <Ionicons name="trash" size={24} color="rgba(29, 181, 232, 0.99)" />
                <Text style={styles.swipeActionText}>Delete</Text>
            </TouchableOpacity>
        );

        return (
            <Swipeable renderRightActions={renderRightAction}>
                <TouchableOpacity
                    style={styles.textItem}
                    onPress={() => handleUseText(item)}
                >
                    <Text style={styles.textItemText}>{item}</Text>
                </TouchableOpacity>
            </Swipeable>
        );
    };

    return (
        <Screen style={styles.container}>
            <ImageBackground
                source={require('../assets/SavedTextScreenBackground.jpg')}
                style={styles.backgroundImage}
            >
                {/* Header with "+" button */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>Saved Texts</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Ionicons name="add-circle" size={30} color="#dbffff" />
                    </TouchableOpacity>
                </View>

                {/* List of saved texts */}
                {savedTexts.length > 0 ? (
                    <FlatList
                        data={savedTexts}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderSavedText}
                        contentContainerStyle={styles.list}
                    />
                ) : (
                    <Text style={styles.noTextsText}>No saved texts yet</Text>
                )}

                {/* Modal for adding new text */}
                <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add New Text</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your text"
                                multiline
                                value={inputText}
                                onChangeText={setInputText}
                            />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)} // Close the modal
                                    style={[styles.modalButton, { backgroundColor: 'white' }]}
                                >
                                    <Text
                                        style={[styles.modalButtonText, { color: 'red' }]}
                                    >
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleAddText}
                                    style={[styles.modalButton, styles.saveButton]}
                                >
                                    <Text style={styles.modalButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Fancy Back Button at Bottom Left */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </ImageBackground>
        </Screen>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'flex-start',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    noTextsText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#999',
    },
    list: {
        padding: 15,
    },
    textItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: 'rgba(29, 181, 232, 0.54)',
    },
    textItemText: {
        fontSize: 16,
        color: 'black',
    },
    swipeActionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        marginBottom: 10,
    },
    swipeActionText: {
        fontSize: 12,
        color: 'rgba(29, 181, 232, 0.99)',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'rgba(29, 181, 232, 0.54)',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        height: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: 'white',
        borderColor: '#ddd',
        borderWidth: 1,
    },
    saveButton: {
        backgroundColor: '#3498db',
    },
    modalButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SavedTextsScreen;