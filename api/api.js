import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from 'buffer';
global.Buffer = Buffer;


// Adres Twojego backendu
const API_URL = "http://192.168.1.104:8080";

// Tworzymy instancję axios z domyślnym URL i nagłówkami
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor requestu – dorzucamy token, jeśli istnieje w AsyncStorage
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("token");
            console.log("Token z AsyncStorage:", token);
            if (token) {
                // W tokenie mamy już "Bearer <JWT>", więc wstawiamy go bez modyfikacji
                config.headers.Authorization = token;
            }
        } catch (error) {
            console.log("Błąd wczytywania tokena:", error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor odpowiedzi – jeśli serwer zwróci błąd 401, usuwamy token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
        }
        return Promise.reject(error);
    }
);

/* ========== AUTH ========== */

export const login = async (credentials) => {
    try {
        const response = await api.post("/api/auth/login", credentials);

        // Tworzymy poprawny "Authorization" do zapisu w AsyncStorage.
        if (response.data && response.data.token) {
            const fullBearerToken = `${response.data.type} ${response.data.token}`;
            await AsyncStorage.setItem("token", fullBearerToken);
            await AsyncStorage.setItem("user", JSON.stringify(response.data));

            console.log("Zalogowano pomyślnie:", response.data.token);
            return response.data;
        }
        throw new Error("Nieprawidłowa odpowiedź z serwera");
    } catch (error) {
        console.error("Błąd logowania:", error.message);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post("/api/auth/register", userData);
        return response.data;
    } catch (error) {
        console.error("Błąd rejestracji:", error.response?.data || error.message);
        throw error;
    }
};

/* ========== UŻYTKOWNIK ========== */

export const getUserData = async (userId) => {
    try {
        const response = await api.get(`/api/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Błąd pobierania danych użytkownika:", error.response?.data || error.message);
        throw error;
    }
};

export const getUserItems = async (userId) => {
    try {
        const response = await api.get(`/api/items/user/${userId}/items`);
        return response.data; // Zakładam, że API zwraca tablicę ogłoszeń użytkownika
    } catch (error) {
        console.error("Błąd podczas pobierania ogłoszeń użytkownika:", error.response?.data || error.message);
        throw error;
    }
};

/* ========== OPINIE ========== */

// Pobieranie opinii użytkownika
export const getUserReviews = async (userId) => {
    try {
        const response = await api.get(`/api/reviews/user/${userId}`);
        console.log('getUserReviews response:', response.data); // Debugging
        // Sprawdź strukturę odpowiedzi
        if (response.data.reviews && Array.isArray(response.data.reviews)) {
            return response.data.reviews; // Jeśli odpowiedź ma pole 'reviews'
        }
        if (Array.isArray(response.data)) {
            return response.data; // Jeśli odpowiedź jest bezpośrednią tablicą
        }
        return []; // W przeciwnym razie, zwróć pustą tablicę
    } catch (error) {
        console.error("Błąd podczas pobierania opinii użytkownika:", error.response?.data || error.message);
        return []; // Zwracamy pustą tablicę w razie błędu
    }
};

// Pobieranie średniej oceny użytkownika
export const getUserAverageRating = async (userId) => {
    try {
        const response = await api.get(`/api/reviews/user/${userId}/average-rating`);
        console.log('getUserAverageRating response:', response.data); // Debugging
        // Sprawdź strukturę odpowiedzi
        if (typeof response.data.averageRating === 'number') {
            return response.data.averageRating;
        }
        if (typeof response.data === 'number') {
            return response.data; // Jeśli odpowiedź jest bezpośrednią wartością
        }
        return 0; // W przeciwnym razie, zwróć 0
    } catch (error) {
        console.error("Błąd podczas pobierania średniej oceny użytkownika:", error.response?.data || error.message);
        return 0; // Zwracamy 0 w razie błędu
    }
};
// ------------------- OPINIE
export const addReview = async (reviewData) => {
    try {
        const response = await api.post(`/api/reviews`, reviewData);
        return response.data;
    } catch (error) {
        console.log("Błąd podczas dodawania opinii:", error.response?.data || error.message);
        return null;
    }
};
// Aktualizacja opinii
export const updateReview = async (reviewId, updatedReview) => {
    try {
        const response = await api.put(`/api/reviews/${reviewId}`, updatedReview);
        return response.data;
    } catch (error) {
        console.error("Błąd podczas aktualizacji opinii:", error.response?.data || error.message);
        throw error;
    }
};

// Usuwanie opinii
export const deleteReview = async (reviewId) => {
    try {
        const response = await api.delete(`/api/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error("Błąd podczas usuwania opinii:", error.response?.data || error.message);
        throw error;
    }
};

export const updateDetails = async (userId, firstName, lastName, phoneNumber) => {
    try {
        const response = await api.put(`/api/users/${userId}/details`, {
            firstName,
            lastName,
            phoneNumber,
        });
        return response.data;
    } catch (error) {
        console.error("Błąd aktualizacji danych użytkownika:", error.response?.data || error.message);
        throw error;
    }
};

export const updateDescription = async (userId, description) => {
    try {
        const response = await api.put(`/api/users/${userId}/description`, { description });
        return response.data;
    } catch (error) {
        console.error("Błąd aktualizacji opisu użytkownika:", error.response?.data || error.message);
        throw error;
    }
};

export const updateProfilePicture = async (userId, base64Image) => {
    try {
        const response = await api.put(`/api/users/${userId}/profile-picture`, {
            image: base64Image,
        });
        return response.data;
    } catch (error) {
        console.error("Błąd aktualizacji zdjęcia profilowego:", error.response?.data || error.message);
        throw error;
    }
};

export const getProfilePicture = async (userId) => {
    try {
        const response = await api.get(`/api/users/${userId}/profile-picture`, {
            responseType: "json", // Oczekuj JSON-a
        });

        // Zakładam, że backend zwraca JSON o strukturze { image: "Base64" }
        const base64Image = response.data.image;

        // if (!base64Image) {
        //     throw new Error("Brak obrazu w odpowiedzi.");
        // }

        return base64Image; // Zwróć dane obrazu w Base64
    } catch (error) {
        console.error("Błąd pobierania zdjęcia profilowego:", error.response?.data || error.message);
        throw error;

    }
};



/* ========== OGŁOSZENIA ========== */

export const addNewItem = async (itemData) => {
    try {
        // Pobranie tokena z AsyncStorage
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error("Token nie został znaleziony.");
        }

        // Dodanie nagłówka Authorization
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        // Wysłanie żądania z tokenem
        const response = await api.post("/api/items", itemData, config);

        console.log("Ogłoszenie dodane:", response.data.name);
        return response.data;
    } catch (error) {
        console.error("Błąd dodawania ogłoszenia:", error.response?.data || error.message);
        throw error;
    }
};
// Usuwanie ogłoszenia, jeśli użytkownik jest jego właścicielem
export const deleteItem = async (itemId) => {
    try {
        // Pobranie tokena z AsyncStorage
        const token = await AsyncStorage.getItem("token");

        if (!token) {
            throw new Error("Token nie został znaleziony. Użytkownik nie jest zalogowany.");
        }

        // Konfiguracja nagłówków z tokenem
        const config = {
            headers: {
                Authorization: token, // Token zawiera już "Bearer <JWT>"
            },
        };

        // Wysłanie żądania DELETE do endpointu
        const response = await api.delete(`/api/items/${itemId}`, config);

        console.log("Ogłoszenie zostało usunięte:", itemId);
        return response.data;
    } catch (error) {
        console.error("Błąd podczas usuwania ogłoszenia:", error.response?.data || error.message);
        throw error;
    }
};


// Funkcja pobierająca dane z endpointu /api/items
export const fetchItems = async () => {
    try {
        const response = await api.get('/api/items');

        return response.data; // Zwracamy pełną odpowiedź z API
    } catch (error) {
        console.error('Błąd podczas pobierania danych z API:', error.response?.data || error.message);
        throw error;
    }
};

export const addToFavorites = async (favoriteItem) => {
    try {
        const response = await api.post(`/api/favorites/favorites/${favoriteItem}`, favoriteItem);
        return response.data;
    } catch (error) {
        console.error("Błąd podczas dodawania do ulubionych:", error.response?.data || error.message);
        throw error;
    }
};
export const fetchFavorites = async () => {
    try {
        const response = await api.get("/api/favorites");
        return response.data; // Zakładam, że zwraca tablicę przedmiotów
    } catch (error) {
        console.error("Błąd podczas pobierania ulubionych przedmiotów:", error.response?.data || error.message);
        throw error;
    }
};
export const removeFromFavorites = async (itemId) => {
    try {
        const response = await api.delete(`/api/favorites/${itemId}`);
        return response.data;
    } catch (error) {
        console.error("Błąd podczas usuwania z ulubionych:", error.response?.data || error.message);
        throw error;
    }
};
export const checkIfFavorite = async (itemId) => {
    try {
        const response = await api.get(`/api/favorites/check/${itemId}`);
        console.log(`Status ulubionych dla z API${itemId}:`, response.data); // Debug
        return response.data; // Zakładam, że backend zwraca obiekt `{ isFavorite: true/false }`
    } catch (error) {
        console.error("Błąd podczas sprawdzania, czy przedmiot jest w ulubionych:", error.response?.data || error.message);
        return { isFavorite: false }; // Domyślnie false w razie błędu
    }
};


// Funkcja pobierająca szczegóły przedmiotu po ID (z like i dislike)
export const fetchItemById = async (itemId) => {
    try {
        const response = await api.get(`/api/items/${itemId}`);
        return response.data; // Zwraca pełne szczegóły przedmiotu, w tym like/dislike
    } catch (error) {
        console.error(`Błąd pobierania szczegółów przedmiotu ${itemId}:`, error.response?.data || error.message);
        throw error;
    }
};


/* ========== INNE ========== */

// Pobranie listy kategorii
export const getCategories = async () => {
    try {
        const response = await api.get("/api/categories/main");
        return response.data;
    } catch (error) {
        console.error("Błąd pobierania kategorii:", error.response?.data || error.message);
        throw error;
    }
};

// Pobieranie subkategorii
export const getSubcategories = async (mainCategoryId) => {
    try {
        const response = await api.get(`/api/categories/main/${mainCategoryId}/subcategories`);
        return response.data;
    } catch (error) {
        console.error("Błąd pobierania subkategorii:", error.response?.data || error.message);
        throw error;
    }
};

// Pobieranie marek
export const getBrands = async () => {
    try {
        const response = await api.get("/api/brands");
        return response.data;
    } catch (error) {
        console.error("Błąd pobierania marek:", error.response?.data || error.message);
        throw error;
    }
};
/* ========== WYSZUKIWANIE ========== */

// Dodajemy funkcję do wyszukiwania użytkowników
export const searchUsers = async (username) => {
    try {
        const response = await api.get(`/api/users/username/${encodeURIComponent(username)}`);
        return response.data; // Zakładam, że API zwraca pojedynczego użytkownika jako obiekt
    } catch (error) {
        return null;
    }
};
/* ========== ROZMOWY ========== */

// Pobieranie wiadomości z danej rozmowy
export const getMessages = async (conversationId) => {
    try {
        const response = await api.get(`/api/conversations/${conversationId}/messages`);
        return response.data;
    } catch (error) {
        console.error(`Błąd podczas pobierania wiadomości dla rozmowy ${conversationId}:`, error.response?.data || error.message);
        throw error;
    }
};

// Wysyłanie nowej wiadomości w rozmowie
export const sendMessage = async (conversationId, messageData) => {
    try {
        // Usuń nadmiarowe cudzysłowy, jeśli istnieją
        if (messageData.startsWith('"') && messageData.endsWith('"')) {
            messageData = JSON.parse(messageData);
        }

        // Wyślij dane jako surowy string
        const response = await api.post(`/api/conversations/${conversationId}/messages`, messageData, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });

        return response.data;
    } catch (error) {
        console.error(`Błąd podczas wysyłania wiadomości w rozmowie ${conversationId}:`, error.response?.data || error.message);
        throw error;
    }
};

// Rozpoczęcie nowej rozmowy na podstawie ID przedmiotu
export const startConversation = async (itemId, conversationData) => {
    try {
        // Usuń nadmiarowe cudzysłowy, jeśli istnieją
        if (conversationData.startsWith('"') && conversationData.endsWith('"')) {
            conversationData = JSON.parse(conversationData);
        }

        // Wyślij dane jako surowy string
        const response = await api.post(`/api/conversations/start/${itemId}`, conversationData, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });

        return response.data;
    } catch (error) {
        console.error(`Błąd podczas rozpoczęcia czatu ${itemId}:`, error.response?.data || error.message);
        throw error;
    }
};

// Pobieranie wszystkich rozmów użytkownika
export const getConversations = async () => {
    try {
        const response = await api.get(`/api/conversations`);
        return response.data;
    } catch (error) {
        console.error("Błąd podczas pobierania rozmów:", error.response?.data || error.message);
        throw error;
    }
};
