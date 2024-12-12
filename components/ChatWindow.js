import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
} from "react-native";

const ChatWindow = ({ productName, productImage, onClose }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSend = () => {
        if (message.trim()) {
            const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            setMessages((prevMessages) => [...prevMessages, { text: message, isUser: true, timestamp }]);
            setMessage("");

            setTimeout(() => {
                const responseTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: "Odpowiedź z drugiej strony", isUser: false, timestamp: responseTimestamp },
                ]);
            }, 1000);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.productInfo}>
                    <Image source={{ uri: productImage }} style={styles.productImage} />
                    <Text style={styles.productName}>{productName}</Text>
                </View>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.messageContainer}>
                {messages.length === 0 ? (
                    <Text style={styles.noMessagesText}>Brak wiadomości...</Text>
                ) : (
                    <FlatList
                        data={messages}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View
                                style={[
                                    styles.message,
                                    item.isUser ? styles.userMessage : styles.responseMessage,
                                ]}
                            >
                                <Text>{item.text}</Text>
                                <Text
                                    style={[
                                        styles.timestamp,
                                        item.isUser ? styles.userTimestamp : styles.responseTimestamp,
                                    ]}
                                >
                                    {item.timestamp}
                                </Text>
                            </View>
                        )}
                    />
                )}
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Napisz wiadomość..."
                    value={message}
                    onChangeText={setMessage}
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>➤</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 300,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        padding: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    productInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    productImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    productName: {
        fontWeight: "bold",
        fontSize: 16,
    },
    closeButton: {
        fontSize: 20,
        color: "#888",
    },
    messageContainer: {
        maxHeight: 200,
        marginBottom: 10,
    },
    noMessagesText: {
        color: "#888",
        textAlign: "center",
    },
    message: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: "75%",
    },
    userMessage: {
        backgroundColor: "#007AFF",
        alignSelf: "flex-end",
        color: "#fff",
    },
    responseMessage: {
        backgroundColor: "#f1f1f1",
        alignSelf: "flex-start",
    },
    timestamp: {
        fontSize: 10,
        marginTop: 5,
    },
    userTimestamp: {
        color: "#fff",
        textAlign: "right",
    },
    responseTimestamp: {
        color: "#888",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: "#007AFF",
        borderRadius: 10,
        padding: 10,
    },
    sendButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default ChatWindow;
