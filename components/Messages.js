import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from './Navbar';

const Messages = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [users] = useState([
        { id: 1, name: 'Jeans', lastMessage: 'Hello, how are you?', lastMessageTime: '12:30', clothingImage: require('../assets/recipe5.jpeg') },
        { id: 2, name: 'Jacket', lastMessage: 'Hi, I need help with the product', lastMessageTime: '1:00', clothingImage: require('../assets/recipe5.jpeg') },
        { id: 3, name: 'Shirt', lastMessage: 'Where is my order?', lastMessageTime: '2:00', clothingImage: require('../assets/recipe5.jpeg') },
    ]);

    const [messages, setMessages] = useState({
        1: [
            { text: 'Hello, User 1!', isUser: true, timestamp: '12:30 PM' },
            { text: 'How are you doing?', isUser: true, timestamp: '12:35 PM' },
            { text: 'I am good, thanks!', isUser: false, timestamp: '12:40 PM' },
        ],
        2: [
            { text: 'Hello, User 2!', isUser: true, timestamp: '1:00 PM' },
            { text: 'How can I assist you?', isUser: false, timestamp: '1:05 PM' },
            { text: 'I need help with a product.', isUser: true, timestamp: '1:10 PM' },
        ],
        3: [
            { text: 'Hello, User 3!', isUser: true, timestamp: '2:00 PM' },
            { text: 'Where is my order?', isUser: false, timestamp: '2:05 PM' },
            { text: 'Your order will arrive soon.', isUser: true, timestamp: '2:10 PM' },
        ],
    });

    const openChat = (user) => {
        setSelectedUser(user);
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = { text: message, isUser: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            setMessages(prevMessages => ({
                ...prevMessages,
                [selectedUser.id]: [...prevMessages[selectedUser.id], newMessage],
            }));
            setMessage('');
        }
    };

    const handleBuyNow = () => {
        Alert.alert('Zakupiono', `Zakupiono ${selectedUser.name}!`);
    };

    return (
        <>
            <Navbar />
            <View style={styles.container}>
                <View style={styles.chatContainer}>
                    {/* Left Panel - Lista użytkowników */}
                    <View style={styles.userListContainer}>
                        <Text style={styles.messageHeader}>Wiadomości</Text>
                        <ScrollView>
                            {users.map((user) => (
                                <TouchableOpacity
                                    key={user.id}
                                    style={styles.userItem}
                                    onPress={() => openChat(user)}
                                >
                                    <Image
                                        source={user.clothingImage}
                                        style={styles.userImage}
                                    />
                                    <View style={styles.userInfo}>
                                        <Text style={styles.userName}>{user.name}</Text>
                                        <Text style={styles.userLastMessage}>{user.lastMessage}</Text>
                                        <Text style={styles.userLastMessageTime}>{user.lastMessageTime}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Right Panel - Czat z wybranym użytkownikiem */}
                    <View style={styles.chatWindowContainer}>
                        {selectedUser ? (
                            <>
                                <View style={styles.chatHeader}>
                                    <View style={styles.selectedUserInfo}>
                                        <Image
                                            source={selectedUser.clothingImage}
                                            style={styles.selectedUserImage}
                                        />
                                        <Text style={styles.selectedUserName}>{selectedUser.name}</Text>
                                    </View>
                                    <TouchableOpacity onPress={handleBuyNow} style={styles.buyNowButton}>
                                        <Text style={styles.buyNowButtonText}>KUP TERAZ</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                <Text style={styles.chatSubtitle}>rozmowa z {selectedUser.name}</Text>

                                <ScrollView style={styles.messagesContainer}>
                                    {messages[selectedUser.id].map((msg, index) => (
                                        <View key={index} style={[styles.messageItem, msg.isUser ? styles.messageUser : styles.messageOther]}>
                                            <Image
                                                source={require('../assets/woman.png')}
                                                style={[styles.messageImage, msg.isUser ? styles.messageImageUser : styles.messageImageOther]}
                                            />
                                            <View style={[styles.messageBox, msg.isUser ? styles.messageBoxUser : styles.messageBoxOther]}>
                                                <Text style={styles.messageText}>{msg.text}</Text>
                                                <Text style={styles.messageTimestamp}>{msg.timestamp}</Text>
                                            </View>
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
                                    <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                                        <Icon name="paper-plane" size={24} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <View style={styles.noUserSelectedContainer}>
                                <Text style={styles.noUserSelectedText}>Wybierz użytkownika, aby rozpocząć czat</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 16,
    },
    chatContainer: {
        flexDirection: 'row',
        height: '85%',
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    userListContainer: {
        width: '30%',
        padding: 16,
        borderRightWidth: 1,
        borderRightColor: '#e5e7eb',
    },
    messageHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userInfo: {
        marginLeft: 16,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userLastMessage: {
        fontSize: 14,
        color: '#6b7280',
    },
    userLastMessageTime: {
        fontSize: 12,
        color: '#9ca3af',
    },
    chatWindowContainer: {
        flex: 1,
        padding: 16,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    selectedUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedUserImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    selectedUserName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    buyNowButton: {
        backgroundColor: '#38a169',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    buyNowButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    chatSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 8,
    },
    messagesContainer: {
        flex: 1,
        marginBottom: 16,
    },
    messageItem: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    messageUser: {
        flexDirection: 'row-reverse',
    },
    messageOther: {
        flexDirection: 'row',
    },
    messageImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    messageBox: {
        maxWidth: '70%',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 8,
    },
    messageBoxUser: {
        backgroundColor: '#3b82f6',
    },
    messageBoxOther: {
        backgroundColor: '#e5e7eb',
    },
    messageText: {
        color: '#fff',
    },
    messageTimestamp: {
        fontSize: 10,
        color: '#f0f0f0',
        marginTop: 4,
        textAlign: 'right',
    },
    messageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    messageInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#fff',
        marginRight: 16,
    },
    sendButton: {
        backgroundColor: '#3b82f6',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noUserSelectedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noUserSelectedText: {
        fontSize: 18,
        color: '#9ca3af',
    },
});

export default Messages;
