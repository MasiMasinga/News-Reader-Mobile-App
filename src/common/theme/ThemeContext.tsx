import React, { createContext, useContext, useEffect } from "react";

// MobX
import { observer } from "mobx-react-lite";

// Stores
import { settingsStore } from "../../stores/SettingsStore";

export type ThemeType = "light" | "dark";

type ThemeContextType = {
    theme: ThemeType;
    isDarkMode: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    isDarkMode: false,
    toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = observer(
    ({ children }: { children: React.ReactNode }) => {
      
        useEffect(() => {
            const initialDarkMode = settingsStore.darkMode;
            if (initialDarkMode !== (theme === "dark")) {
                settingsStore.setDarkMode(theme === "dark");
            }
        }, []);

        const theme: ThemeType = settingsStore.darkMode ? "dark" : "light";

        const toggleTheme = () => {
            settingsStore.setDarkMode(!settingsStore.darkMode);
        };

        return (
            <ThemeContext.Provider
                value={{ theme, isDarkMode: theme === "dark", toggleTheme }}
            >
                {children}
            </ThemeContext.Provider>
        );
    }
);
