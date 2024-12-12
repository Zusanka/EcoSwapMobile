import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Messages = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [users] = useState([
        { id: 1, name: "Koszula z królikami", lastMessage: "Dzień dobry, można prosić o wymiary bluzki?", lastMessageTime: "17:54", clothingImage: require("../assets/6.jpeg") },
        { id: 2, name: "Plecak", lastMessage: "Wiadomość", lastMessageTime: "1:00", clothingImage: require("../assets/2.jpeg") },
        { id: 3, name: "T-shirt", lastMessage: "Gdzie jest moje zamówienie?", lastMessageTime: "2:00", clothingImage: require("../assets/1.jpeg") },
    ]);

    const [messages, setMessages] = useState({
        1: [
            { text: "Dzień dobry, można prosić o wymiary bluzki?", isUser: true, timestamp: "17:54" },
            { text: "Odpowiedź z drugiej strony", isUser: false, timestamp: "17:54" },
        ],
        2: [
            { text: "Hello, User 2!", isUser: true, timestamp: "1:00 PM" },
            { text: "How can I assist you?", isUser: false, timestamp: "1:05 PM" },
        ],
        3: [
            { text: "Hello, User 3!", isUser: true, timestamp: "2:00 PM" },
            { text: "Where is my order?", isUser: false, timestamp: "2:05 PM" },
        ],
    });

    const openChat = (user) => {
        setSelectedUser(user);
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                text: message,
                isUser: true,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prevMessages) => ({
                ...prevMessages,
                [selectedUser.id]: [...prevMessages[selectedUser.id], newMessage],
            }));
            setMessage("");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.userList}>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.userItem}
                            onPress={() => openChat(item)}
                        >
                            <Image source={item.clothingImage} style={styles.userImage} />
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{item.name}</Text>
                                <Text style={styles.lastMessage}>{item.lastMessage}</Text>
                                <Text style={styles.messageTime}>{item.lastMessageTime}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View style={styles.chatContainer}>
                {selectedUser ? (
                    <>
                        <View style={styles.chatHeader}>
                            <View style={styles.chatHeaderInfo}>
                                <Image
                                    source={selectedUser.clothingImage}
                                    style={styles.chatHeaderImage}
                                />
                                <Text style={styles.chatHeaderName}>{selectedUser.name}</Text>
                            </View>
                        </View>
                        <ScrollView style={styles.messages}>
                            {messages[selectedUser.id].map((msg, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.messageBubble,
                                        msg.isUser ? styles.userMessage : styles.otherMessage,
                                    ]}
                                >
                                    <Text style={styles.messageText}>{msg.text}</Text>
                                    <Text style={styles.messageTime}>{msg.timestamp}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={styles.messageInputContainer}>
                            <TextInput
                                style={styles.messageInput}
                                placeholder="Napisz wiadomość..."
                                value={message}
                                onChangeText={setMessage}
                            />
                            <TouchableOpacity
                                style={styles.sendButton}
                                onPress={handleSendMessage}
                            >
                                <FontAwesome name="send" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.noChatSelected}>
                        <Text style={styles.noChatText}>Wybierz użytkownika, aby rozpocząć czat</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#f8f8f8",
    },
    userList: {
        width: "30%",
        backgroundColor: "#fff",
        borderRightWidth: 1,
        borderRightColor: "#ccc",
    },
    userItem: {
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userInfo: {
        marginLeft: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    lastMessage: {
        fontSize: 14,
        color: "#666",
    },
    // messageTime: {
    //     fontSize: 12,
    //     color: "#999",
    // },
    chatContainer: {
        flex: 1,
        padding: 10,
    },
    chatHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    chatHeaderInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    chatHeaderImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 10,
    },
    chatHeaderName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    messages: {
        flex: 1,
    },
    messageBubble: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        maxWidth: "70%",
    },
    userMessage: {
        backgroundColor: "#007bff",
        alignSelf: "flex-end",
        color: "#fff",
    },
    otherMessage: {
        backgroundColor: "#e0e0e0",
        alignSelf: "flex-start",
    },
    messageText: {
        fontSize: 16,
    },
    messageTime: {
        fontSize: 12,
        color: "#999",
        alignSelf: "flex-end",
    },
    messageInputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    messageInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#007bff",
        justifyContent: "center",
        alignItems: "center",
    },
    noChatSelected: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noChatText: {
        fontSize: 16,
        color: "#666",
    },
});

export default Messages;
