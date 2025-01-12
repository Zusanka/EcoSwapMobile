import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// URL do Twojej aplikacji backendowej
const API_URL = "http://192.168.1.108:8080";

// Tworzymy instancję axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor: do każdego requestu dodajemy nagłówek z tokenem (o ile istnieje)
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor: jeśli dostaniemy 401, usuwamy token z AsyncStorage
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);

/* ========== AUTH ========== */

/** Rejestracja */
export const register = async (userData) => {
    try {
        const response = await api.post("/api/auth/register", userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/** Logowanie */
export const login = async (credentials) => {
    try {
        const response = await api.post("/api/auth/login", credentials);
        if (response.data && response.data.token) {
            await AsyncStorage.setItem("token", response.data.token);
            await AsyncStorage.setItem("user", JSON.stringify(response.data));
            return response.data;
        }
        throw new Error("Nieprawidłowa odpowiedź z serwera");
    } catch (error) {
        throw error;
    }
};

/** Pobranie danych użytkownika */
export const getUserData = async (userId) => {
    try {
        const response = await api.get(`/api/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/** Pobranie zdjęcia profilowego użytkownika */
export const getProfilePicture = async (userId) => {
    try {
        const response = await api.get(`/api/users/${userId}/profile-picture`, {
            responseType: "arraybuffer",
        });
        const base64 = btoa(
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );
        return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
    }
};

/** Aktualizacja zdjęcia profilowego */
export const updateProfilePicture = async (userId, imageUri) => {
    try {
        const formData = new FormData();
        formData.append("file", {
            uri: imageUri,
            type: "image/jpeg",
            name: `profile_${userId}.jpg`,
        });

        const response = await api.put(`/api/users/${userId}/profile-picture`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

/* ========== OGŁOSZENIA ========== */

/** Dodawanie nowego ogłoszenia */
export const addNewItem = async (itemData, token) => {
    try {
        const formData = new FormData();

        // Dodajemy pola tekstowe do FormData
        Object.keys(itemData).forEach((key) => {
            if (key !== "images") {
                formData.append(key, itemData[key]);
            }
        });

        // Dodajemy zdjęcia do FormData
        itemData.images.forEach((imageUri, index) => {
            formData.append("images", {
                uri: imageUri,
                type: "image/jpeg",
                name: `image_${index}.jpg`,
            });
        });

        const response = await api.post("/api/items", formData, {
            headers: { Authorization: "Bearer "+token, "Content-Type": "multipart/form-data"},
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/** Pobranie listy ogłoszeń */
export const getItems = async () => {
    try {
        const response = await api.get("/api/items");
        return response.data;
    } catch (error) {
        throw error;
    }
};

/** Pobranie ogłoszenia po ID */
export const getItemById = async (itemId) => {
    try {
        const response = await api.get(`/api/items/${itemId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/** Pobranie ogłoszeń na podstawie kategorii */
export const getItemsByCategory = async (categoryName) => {
    try {
        const response = await api.get(`/api/items?category=${categoryName}`);
        return response.data; // Tablica obiektów ogłoszeń
    } catch (error) {
        throw error;
    }
};


/** Usunięcie ogłoszenia */
export const deleteItem = async (itemId) => {
    try {
        const response = await api.delete(`/api/items/${itemId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* ========== INNE ========== */

/** Pobranie listy miast */
export const getCities = async () => {
    try {
        const response = await api.get("/api/cities");
        return response.data;
    } catch (error) {
        throw error;
    }
};

/** Pobranie listy kategorii */
export const getCategories = async () => {
    try {
        const response = await api.get("/api/categories");
        return response.data;
    } catch (error) {
        throw error;
    }
};

/** Pobranie listy marek */
export const getBrands = async () => {
    try {
        const response = await api.get("/api/brands");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserCreditCards = async () => {
    try {
        const response = await api.get("/api/credit-cards");
        return response.data; // tablica obiektów CreditCardDTO
    } catch (error) {
        throw error;
    }
};

/** Usunięcie karty kredytowej:
 * DELETE /api/credit-cards/{cardId}
 * Zwraca pustą odpowiedź (200 OK)
 */
export const deleteCreditCard = async (cardId) => {
    try {
        const response = await api.delete(`/api/credit-cards/${cardId}`);
        return response.data; // zwykle null/void, brak body
    } catch (error) {
        throw error;
    }
};
/** Pobranie listy kategorii i podkategorii */
export const getCategoriesWithSubcategories = async () => {
        try {
            const response = await api.get("/api/categories");
            return response.data; // Zwraca np. { "fashion": ["Shoes", "Clothes"], "electronics": ["Laptops", "Phones"] }
        } catch (error) {
            throw error;
        }
};

