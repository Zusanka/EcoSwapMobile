import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

            console.log("Zalogowano pomyślnie:", response.data);
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
            responseType: "arraybuffer", // Pobierz dane binarne
        });

        // Konwersja danych binarnych na Base64 bez użycia natywnych modułów
        const base64Image = `data:image/jpeg;base64,${btoa(
            new Uint8Array(response.data)
                .reduce((data, byte) => data + String.fromCharCode(byte), "")
        )}`;

        return base64Image;
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
console.log(1);
        // Wysłanie żądania z tokenem
        const response = await api.post("/api/items", itemData, config);

        console.log("Ogłoszenie dodane:", response.data);
        return response.data;
    } catch (error) {
        console.error("Błąd dodawania ogłoszenia:", error.response?.data || error.message);
        throw error;
    }
};


// Funkcja pobierająca dane z endpointu /api/items
export const fetchItems = async () => {
    try {
        const response = await api.get('/api/items');
        console.log('Odpowiedź API:', response.data);

        return response.data; // Zwracamy pełną odpowiedź z API
    } catch (error) {
        console.error('Błąd podczas pobierania danych z API:', error.response?.data || error.message);
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
