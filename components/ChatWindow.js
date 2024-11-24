import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatWindow = ({ productName, productImage, onClose }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSend = () => {
        if (message.trim()) {
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages((prevMessages) => [...prevMessages, { text: message, isUser: true, timestamp }]);
            setMessage("");

            setTimeout(() => {
                const responseTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setMessages((prevMessages) => [...prevMessages, { text: "Odpowiedź z drugiej strony", isUser: false, timestamp: responseTimestamp }]);
            }, 1000);
        }
    };

    return (
        <View style={styles.chatContainer}>
            <View style={styles.headerContainer}>
                <View style={styles.productInfoContainer}>
                    <View style={styles.productImageContainer}>
                        <Text style={styles.productImageText}>{productImage}</Text>
                    </View>
                    <Text style={styles.productName}>{productName}</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <FontAwesomeIcon icon={faTimes} size={20} color="gray" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.messageContainer}>
                {messages.length === 0 ? (
                    <Text style={styles.noMessagesText}>Brak wiadomości...</Text>
                ) : (
                    messages.map((msg, index) => (
                        <View
                            key={index}
                            style={[
                                styles.messageBubble,
                                msg.isUser ? styles.userMessage : styles.otherMessage,
                            ]}
                        >
                            <Text style={styles.messageText}>{msg.text}</Text>
                            <Text style={[
                                styles.timestamp,
                                msg.isUser ? styles.userTimestamp : styles.otherTimestamp,
                            ]}>{msg.timestamp}</Text>
                        </View>
                    ))
                )}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Napisz wiadomość..."
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    style={styles.textInput}
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <FontAwesomeIcon icon={faPaperPlane} size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    chatContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 300,
        height: 400,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        padding: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    productInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImageContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    productImageText: {
        color: '#888',
    },
    productName: {
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    messageContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 5,
    },
    noMessagesText: {
        textAlign: 'center',
        color: '#888',
        marginVertical: 10,
    },
    messageBubble: {
        borderRadius: 8,
        padding: 8,
        marginVertical: 5,
        maxWidth: '70%',
    },
    userMessage: {
        backgroundColor: '#007bff',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#e4e6eb',
        alignSelf: 'flex-start',
    },
    messageText: {
        color: '#fff',
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
    },
    userTimestamp: {
        color: '#cce7ff',
        alignSelf: 'flex-end',
    },
    otherTimestamp: {
        color: '#888',
        alignSelf: 'flex-start',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 16,
    },
});

export default ChatWindow;
