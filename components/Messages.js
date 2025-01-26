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
import { getConversations, getMessages, sendMessage, fetchItemById } from "../api/api";
import {useRoute} from "@react-navigation/native";

const Messages = () => {
    const route = useRoute();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingImages, setLoadingImages] = useState(false);
    const [currentUserName, setCurrentUserName] = useState(null);
    const [images, setImages] = useState({});
    const loadCurrentUser = async () => {
        try {
            const user = await AsyncStorage.getItem("user");
            if (user) {
                const parsedUser = JSON.parse(user);
                setCurrentUserName(parsedUser.username);
            }
        } catch (error) {
            console.error("Błąd podczas ładowania bieżącego użytkownika:", error);
        }
    };

    const fetchConversations = async () => {
        try {
            const response = await getConversations();
            setConversations(response);
        } catch (error) {
            console.error("Błąd podczas pobierania konwersacji:", error);
        }
    };

    const fetchImages = async () => {
        try {
            setLoadingImages(true);
            const imagesMap = {};
            for (const conversation of conversations) {
                const fetchedItem = await fetchItemById(conversation.itemId);
                imagesMap[conversation.itemId] = fetchedItem?.images?.[0] || null;
            }
            setImages(imagesMap);

        } catch (error) {
            console.error("Błąd podczas pobierania obrazów:", error);
        } finally {
            setLoadingImages(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            setLoadingMessages(true);
            const response = await getMessages(conversationId);
            setMessages(response);
        } catch (error) {
            console.error(`Błąd podczas pobierania wiadomości dla rozmowy ${conversationId}:`, error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const openChat = (conversation) => {
        setSelectedConversation(conversation);
        fetchMessages(conversation.conversationId);
    };

    useEffect(() => {
        const { conversationId } = route.params || {};
        if (conversationId && conversations.length > 0) {
            const conversation = conversations.find(
                (conv) => conv.conversationId === conversationId
            );
            if (conversation) {
                openChat(conversation);
            }
        }
    }, [route.params, conversations]);

    const handleSendMessage = async () => {
        if (message.trim() && selectedConversation) {
            try {
                const newMessage = {
                    senderName: currentUserName,
                    content: message.trim(),
                    sentAt: new Date().toISOString(),
                };

                await sendMessage(selectedConversation.conversationId, message);

                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setMessage("");
            } catch (error) {
                console.error("Błąd podczas wysyłania wiadomości:", error);
            }
        }
    };

    useEffect(() => {
        loadCurrentUser();
        fetchConversations();
    }, []);

    useEffect(() => {
        if (conversations.length > 0) {
            fetchImages();
        }
    }, [conversations]);

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
                    keyExtractor={(item) => String(item.conversationId)}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.userItem,
                                selectedConversation?.conversationId === item.conversationId &&
                                styles.activeUserItem,
                            ]}
                            onPress={() => openChat(item)}
                        >
                            {loadingImages ? (
                                <ActivityIndicator size="small" color="#007bff" />
                            ) : images[item.itemId] ? (
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${images[item.itemId].image}` }}
                                    style={styles.userImage}
                                />
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <Text>Ładowanie...</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View style={styles.chatContainer}>
                {selectedConversation ? (
                    <>
                        <View style={styles.chatHeader}>
                            <Text style={styles.chatHeaderName}>{selectedConversation.itemName}</Text>
                        </View>
                        <ScrollView style={styles.messages}>
                            {loadingMessages ? (
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
        width: "20%",
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
    placeholderImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
    },
    activeUserItem: {
        backgroundColor: "#f0f0f0",
    },
    chatContainer: {
        flex: 1,
        padding: 10,
    },
    chatHeader: {
        marginBottom: 10,
    },
    chatHeaderName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
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
