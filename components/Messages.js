import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getConversations, getMessages, sendMessage } from "../api/api"; // Import metod API

const Messages = () => {
    const [conversations, setConversations] = useState([]); // Lista konwersacji
    const [selectedConversation, setSelectedConversation] = useState(null); // Wybrana konwersacja
    const [messages, setMessages] = useState([]); // Wiadomości w wybranej konwersacji
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentUserName, setCurrentUserName] = useState(null); // Nazwa zalogowanego użytkownika

    // Funkcja do pobrania bieżącego użytkownika
    const loadCurrentUser = async () => {
        const user = await AsyncStorage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            setCurrentUserName(parsedUser.username);
        }
    };

    // Funkcja do pobrania konwersacji
    const fetchConversations = async () => {
        try {
            const response = await getConversations();
            setConversations(response);
        } catch (error) {
            console.error("Błąd podczas pobierania konwersacji:", error);
        }
    };

    // Funkcja do pobrania wiadomości dla wybranej konwersacji
    const fetchMessages = async (conversationId) => {
        try {
            setLoading(true);
            const response = await getMessages(conversationId);
            setMessages(response);
        } catch (error) {
            console.error(`Błąd podczas pobierania wiadomości dla rozmowy ${conversationId}:`, error);
        } finally {
            setLoading(false);
        }
    };

    // Obsługa kliknięcia w konwersację
    const openChat = (conversation) => {
        setSelectedConversation(conversation);
        fetchMessages(conversation.conversationId); // Pobierz wiadomości dla wybranej konwersacji
    };

    // Obsługa wysyłania wiadomości
    const handleSendMessage = async () => {
        if (message.trim() && selectedConversation) {
            try {
                const newMessage = {
                    senderName: currentUserName,
                    content: message.trim(),
                    sentAt: new Date().toISOString(), // Ustawiamy aktualną datę
                };

                // Wysyłamy wiadomość za pomocą API
                await sendMessage(selectedConversation.conversationId, message);

                // Dodajemy wiadomość do widoku
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setMessage(""); // Czyścimy pole tekstowe
            } catch (error) {
                console.error("Błąd podczas wysyłania wiadomości:", error);
            }
        }
    };

    // Pobierz dane przy montowaniu komponentu
    useEffect(() => {
        loadCurrentUser();
        fetchConversations();
    }, []);

    // Funkcja do formatowania daty
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.userList}>
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.itemId}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.userItem}
                            onPress={() => openChat(item)}
                        >
                            <Image source={{ uri: item.image }} style={styles.userImage} />
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View style={styles.chatContainer}>
                {selectedConversation ? (
                    <>
                        <View style={styles.chatHeader}>
                            <View style={styles.chatHeaderInfo}>
                                <Image
                                    source={{ uri: selectedConversation.image }}
                                    style={styles.chatHeaderImage}
                                />
                                <Text style={styles.chatHeaderName}>{selectedConversation.name}</Text>
                            </View>
                        </View>
                        <ScrollView style={styles.messages}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#007bff" />
                            ) : (
                                messages.map((msg, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.messageBubble,
                                            msg.senderName === currentUserName
                                                ? styles.userMessage
                                                : styles.otherMessage,
                                        ]}
                                    >
                                        <Text style={styles.messageText}>{msg.content}</Text>
                                        <Text style={styles.messageTime}>
                                            {formatDate(msg.sentAt)}
                                        </Text>
                                    </View>
                                ))
                            )}
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
        width: "18%",
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
