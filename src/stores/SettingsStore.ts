import { makeAutoObservable, runInAction } from "mobx";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

class SettingsStore {
    darkMode: boolean = false;
    offlineReading: boolean = false;

    constructor() {
        makeAutoObservable(this);
        this.loadSettings();
    }

    async loadSettings() {
        try {
            const settings = await AsyncStorage.getItem("appSettings");

            if (settings) {
                const parsedSettings = JSON.parse(settings);

                runInAction(() => {
                    this.darkMode = parsedSettings.darkMode ?? false;
                    this.offlineReading =
                        parsedSettings.offlineReading ?? false;
                });
            }
        } catch (error) {
            console.error("Error loading settings:", error);
        }
    }

    async saveSettings() {
        try {
            const settings = {
                darkMode: this.darkMode,
                offlineReading: this.offlineReading,
            };

            await AsyncStorage.setItem("appSettings", JSON.stringify(settings));
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    }

    setDarkMode(value: boolean) {
        this.darkMode = value;
        this.saveSettings();
    }

    setOfflineReading(value: boolean) {
        this.offlineReading = value;
        this.saveSettings();
    }
}

export const settingsStore = new SettingsStore();
