import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { enableScreens } from "react-native-screens";

// Navigation
import AppNavigation from "./src/navigation/AppNavigation";

// Stores
import { newsStore } from "./src/stores/NewsStore";
import { settingsStore } from "./src/stores/SettingsStore";

// Global styles
import "./global.css";

enableScreens();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
});

export default function App() {
    const colorScheme = useColorScheme();

    useEffect(() => {
        if (colorScheme === "dark" && !settingsStore.darkMode) {
            settingsStore.setDarkMode(true);
        }

        newsStore.loadFavorites().then(() => {});

        try {
            newsStore.fetchArticles();
        } catch (error) {
            console.error("Error fetching initial articles:", error);
        }
    }, []);

    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <AppNavigation />
                <StatusBar style={settingsStore.darkMode ? "light" : "dark"} />
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}
