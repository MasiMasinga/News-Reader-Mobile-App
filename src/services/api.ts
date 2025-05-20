// Axios
import axios from "axios";
import { EXPO_PUBLIC_NEWS_API_KEY, EXPO_PUBLIC_NEWS_API_URL } from "@env";

// Store
import { settingsStore } from "../stores/SettingsStore";

const api = axios.create({
    baseURL: EXPO_PUBLIC_NEWS_API_URL,
    timeout: 120000,
    timeoutErrorMessage: "timeout",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
    },
    params: {
        apiKey: EXPO_PUBLIC_NEWS_API_KEY,
    },
});


api.interceptors.request.use(
    async (config) => {
        if (settingsStore.offlineReading) {
            return Promise.reject(new Error("Network Error - Offline Mode"));
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default api;
